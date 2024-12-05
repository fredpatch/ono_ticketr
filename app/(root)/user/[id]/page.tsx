"use client";

import NotFound from "@/app/not-found";
import AboutUser from "@/components/shared/AboutUser";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import EventPostCard from "@/components/shared/EventPostCard";
import InPageNavigation, {
  activeTabRef,
} from "@/components/shared/InpageNavigation";
import Loader from "@/components/shared/Loader";
import { LoadMoreDataBtn } from "@/components/shared/LoadMoreDataBtn";
import NoDataMessage from "@/components/shared/NoDataMessage";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FilterPaginationData } from "@/common/filter-pagination-data";
import Image from "next/image";
import { useAuthV3 } from "@/app/api/AuthProviderV3";

const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

const profileDataStructure = {
  personal_info: {
    fullname: "",
    email: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  social_links: {
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    website: "",
  },
  account_info: {
    total_events: 0,
    total_reads: 0,
  },
  joinedAt: "",
};

interface EventItem {
  event_id: string;
  title: string;
  banner: string;
  description: string;
}

interface Events {
  results: EventItem[];
  page: number;
  totalDocs?: number;
  user_id: string;
}

const ProfilePage = () => {
  const profileId = useParams().id as string;

  let hasFetchedUser = useRef(false);
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [events, setEvents] = useState<Events | null>(null);
  let [profile_loaded, setProfileLoaded] = useState("");

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_events, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let { user } = useAuthV3();
  // const username = userAuth?.username;
  const username = user?.username;
  const role = user?.role;

  const user_profile = async () => {
    axios
      .post(ServerDomain + "/user/get-profile", { username: profileId })
      .then(({ data: user }) => {
        // console.log("@@@ USER =>", user);
        if (user != null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        get_user_events({ user_id: user._id });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const get_user_events = ({ page = 1, user_id }: any) => {
    user_id = user_id === undefined ? events?.user_id : user_id;

    axios
      .post(ServerDomain + "/events/search-posts", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await FilterPaginationData({
          state: events,
          data: data.events,
          page,
          countRoute: "/events/search-posts-count",
          data_to_send: {
            author: user_id,
          },
        });

        // console.log("@@@ FORMATTED DATA", formattedData);
        setEvents(formattedData);
      });
  };

  const searchParams = useSearchParams();
  const activeTab = searchParams ? searchParams.get("tab") : null;

  useEffect(() => {
    // Safely checking if activeTabRef is defined
    if (activeTabRef && activeTabRef.current) {
      activeTabRef.current.click();
    }

    if (hasFetchedUser.current) return;

    if (profileId != profile_loaded) {
      setEvents(null);
    }

    if (events == null) {
      resetStates();
      user_profile();
    }
    hasFetchedUser.current = true; // Mark data as fetched, prevent future calls
  }, [profileId, events]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <>
      <AnimationWrapper keyValue="profile-page">
        {role === "admin" && (
          <>
            {loading && <Loader />}

            {!loading &&
              (profile_username.length ? (
                <section className=" h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                  <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                    <img
                      src={profile_img}
                      alt="profile image"
                      className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                    />
                    <h1 className="text-2xl font-medium">
                      @{profile_username}
                    </h1>
                    <p className="text-xl capitalize h-6">{fullname}</p>
                    <p className="text-md text-dark-grey">
                      {total_events.toLocaleString()} Posts -{" "}
                      {total_reads.toLocaleString()} Reads
                    </p>

                    <div className="flex gap-4 mt-2">
                      {profileId === username ? (
                        <Link
                          href={"/dashboard/settings/edit-profile"}
                          className="btn-light rounded-md"
                        >
                          Edit Profile
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>

                    <AboutUser
                      className={"max-md:hidden"}
                      bio={bio}
                      social_links={social_links}
                      joinedAt={joinedAt}
                    />
                  </div>

                  <div className="max-md:mt-12 w-full">
                    <InPageNavigation
                      routes={["Events Published", "About"]}
                      defaultHidden={["About"]}
                      defaultActiveIndex={activeTab != "About" ? 0 : 1}
                    >
                      <>
                        {events == null ? (
                          <Loader />
                        ) : events.results.length ? (
                          events.results.map((event, i) => {
                            return (
                              <AnimationWrapper
                                key={i}
                                keyValue={"event-" + i}
                                transition={{ duration: 1, delay: i * 0.1 }}
                              >
                                <EventPostCard
                                  event={event}
                                  // author={event.author.personal_info}
                                />
                              </AnimationWrapper>
                            );
                          })
                        ) : (
                          <NoDataMessage message="No events found yet" />
                        )}

                        <LoadMoreDataBtn
                          state={events}
                          fetchDataFun={get_user_events}
                        />
                      </>

                      <AboutUser
                        bio={bio}
                        social_links={social_links}
                        joinedAt={joinedAt}
                      />
                    </InPageNavigation>
                  </div>
                </section>
              ) : (
                <NotFound />
              ))}
          </>
        )}
      </AnimationWrapper>

      {role != "admin" && <NotFound />}
    </>
  );
};

export default ProfilePage;
