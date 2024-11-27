"use client";

import React, { useEffect, useRef, useState } from "react";
import AnimationWrapper from "./AnimationWrapper";
import { profileDataStructure } from "@/app/(root)/user/[id]/page";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";
import axios from "axios";
import { ServerDomain } from "@/app/(root)/(ono)/page";
import { FileUploader } from "./FileUploader";
import { toast } from "@/hooks/use-toast";
import { StoreInLocal } from "@/common/localeStore";
import InputBox from "./InputBox";
import {
  IconAt,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconMail,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";

let BIO_LIMIT = 150;
export const LOCAL_SOCIAL_LINKS_KEY = "temp_social_links";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

const getLocalSocialLinks = (): SocialLinks => {
  const storedLinks = localStorage.getItem(LOCAL_SOCIAL_LINKS_KEY);
  return storedLinks ? JSON.parse(storedLinks) : {};
};

export const setLocalSocialLinks = (socialLinks: SocialLinks) => {
  localStorage.setItem(LOCAL_SOCIAL_LINKS_KEY, JSON.stringify(socialLinks));
};

export const clearLocalSocialLinks = () => {
  localStorage.removeItem(LOCAL_SOCIAL_LINKS_KEY);
};

const EditProfilePage = () => {
  const [profileState, setProfileState] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(BIO_LIMIT);
  const [updatedProfileImg, setUpdatedProfileImg] = useState<string | null>(
    null
  );
  const [files, setFiles] = useState<File[]>([]);

  let editProfileForm = useRef<HTMLFormElement | null>(null);

  let {
    personal_info: {
      username: profile_username,
      fullname,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profileState;
  let { userAuth, setUserAuth } = useAuth();
  let access_token = userAuth?.access_token;
  let username = userAuth?.username;
  let isAdmin = userAuth?.isAdmin;

  useEffect(() => {
    if (access_token) {
      const localLinks = getLocalSocialLinks();

      if (Object.keys(localLinks).length > 0) {
        setProfileState((prev) => ({
          ...prev,
          social_links: {
            ...prev.social_links,
            ...localLinks,
          },
        }));
      }
      axios
        .post(ServerDomain + "/user/get-profile", { username: username })
        .then(({ data }) => {
          setProfileState(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [access_token]);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersLeft(BIO_LIMIT - e.target.value.length);
  };

  const handleFileChange = (url: any, file?: File) => {
    setFiles((prevFiles) => [...prevFiles, file!]);
    setUpdatedProfileImg(url);

    // console.log("@@@ Profile img url", profile_img);
    try {
      let newUserAuth = {
        ...userAuth,
        profile_img: url,
        access_token: userAuth?.access_token || null,
        username: userAuth?.username || "",
        fullname: userAuth?.fullname || "",
        isAdmin: userAuth?.isAdmin || Boolean(false),
        new_notification_available:
          userAuth?.new_notification_available || null,
      };

      StoreInLocal("user", JSON.stringify(newUserAuth));
      setUserAuth(newUserAuth);
      toast({
        description: "Profile Picture loaded successfully !",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Failed to load the profile picture !",
        description: `An error occurred while uploading your profile picture: ${error}.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();

    if (!editProfileForm.current) {
      return toast({ description: "Form not found", variant: "destructive" });
    }

    let form = new FormData(editProfileForm.current);
    let formData: Record<string, any> = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let {
      username,
      bio,
      youtube,
      twitter,
      instagram,
      facebook,
      website,
      tiktok,
    } = formData;

    if (username.length < 3) {
      return toast({
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
    }
    if (bio.length > BIO_LIMIT) {
      return toast({
        description: `Bio should be less than ${BIO_LIMIT} characters long`,
        variant: "destructive",
      });
    }

    if (e.target.className.includes("disable")) {
      return;
    }

    e.target.classList.add("disable");

    axios
      .post(
        ServerDomain + "/user/update-user-profile",
        {
          username,
          bio,
          social_links: {
            youtube,
            twitter,
            instagram,
            facebook,
            website,
            tiktok,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        if (userAuth?.username !== data.username) {
          // Update profileState with the new data
          setProfileState((prevState) => ({
            ...prevState,
            personal_info: {
              ...prevState.personal_info,
              username: data.username,
              bio: data.bio,
            },
            social_links: data.social_links,
          }));

          let newUserAuth = {
            ...userAuth,
            profile_img: data?.profile_img || userAuth?.profile_img,
            access_token: userAuth?.access_token || null,
            username: data.username,
            fullname: data.fullname || userAuth?.fullname,
            isAdmin: userAuth?.isAdmin || Boolean(false),
            new_notification_available:
              userAuth?.new_notification_available || null,
          };

          e.target.classList.remove("disable");

          StoreInLocal("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }

        toast({ description: "Profile updated 🫡" });
      })
      .catch(({ response }) => {
        console.log(response.data.error);
        e.target.classList.remove("disable");
        toast({ description: response.data.error });
      });
  };

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    const updatedLinks = {
      ...profileState.social_links,
      [key]: value,
    };

    setProfileState((prevState) => ({
      ...prevState,
      social_links: updatedLinks,
    }));

    // Save to local storage
    setLocalSocialLinks(updatedLinks);
  };

  return (
    <AnimationWrapper>
      {loading && <Loader />}
      {!loading && (
        <form ref={editProfileForm} className="space-y-4">
          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                // htmlFor="uploadImg"
                // id="uploadImg"
                className="relative block w-48 h-48 bg-gray-300 rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
                <img
                  src={updatedProfileImg || profile_img}
                  alt="Profile Image"
                />

                <FileUploader
                  endPoint="profileImage"
                  onFieldChange={handleFileChange}
                  imageUrl={profile_img}
                  setFiles={setFiles}
                />
              </label>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <InputBox
                    name="fullname"
                    value={fullname}
                    type="text"
                    placeholder="Full Name"
                    icon={<IconUser />}
                  />
                </div>

                <div>
                  <InputBox
                    name={"email"}
                    value={email}
                    type={"email"}
                    placeholder={"Email"}
                    icon={<IconMail />}
                    disabled={true}
                  />
                </div>
              </div>

              <InputBox
                type={"text"}
                name={"username"}
                value={profile_username}
                placeholder={"Username"}
                icon={<IconAt />}
              />

              <p className="text-dark-grey -mt-3">
                Username will be used to search user and will be visible to all
                users.
              </p>

              <textarea
                name="bio"
                maxLength={BIO_LIMIT}
                defaultValue={bio}
                placeholder={"Enter a short bio"}
                onChange={handleCharacterChange}
                className="input-box placeholder:text-gray-400 h-64 w-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
              ></textarea>
              <p className="mt-1 text-dark-grey">
                {charactersLeft} Characters Left
              </p>

              <p className="my-6 text-dark-grey">
                Add your social handles below
              </p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key: any, i: any) => {
                  let IconComponent;

                  // Map keys to Tabler icons
                  switch (key) {
                    case "facebook":
                      IconComponent = IconBrandFacebook;
                      break;
                    case "twitter":
                      IconComponent = IconBrandTwitter;
                      break;
                    case "instagram":
                      IconComponent = IconBrandInstagram;
                      break;
                    case "youtube":
                      IconComponent = IconBrandYoutube;
                      break;
                    case "tiktok":
                      IconComponent = IconBrandTiktok;
                      break;
                    default:
                      IconComponent = IconWorld; // Default for 'website' or unknown keys
                  }

                  return (
                    <InputBox
                      key={key}
                      type={"text"}
                      name={key}
                      value={social_links[key as keyof SocialLinks]}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          key as keyof SocialLinks,
                          e.target.value
                        )
                      }
                      placeholder={`https://${key}.com`}
                      icon={
                        <IconComponent className="text-2xl hover:text-black text-gray-400" />
                      }
                    />
                  );
                })}
              </div>

              <button
                className="btn-dark px-10 w-auto"
                type="submit"
                onClick={handleUpdateProfile}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfilePage;
