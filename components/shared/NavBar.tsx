"use client";

import { logo, logo_dark } from "@/public/imgs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import Form from "next/form";

import {
  IconBell,
  IconFilePencil,
  IconMoonStars,
  IconSearch,
} from "@tabler/icons-react";
import UserNavigationPanel from "./UserNavigationPanel";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { ServerDomain } from "@/app/(root)/(ono)/page";
import { logo1, logo2 } from "@/public/assets/logo";

const placeholders = [
  "Beach party",
  "Hot Summer",
  "No stress",
  "Prestigieux",
  "Showcase",
];

const NavBar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const router = useRouter();

  const { userAuth, setUserAuth } = useAuth();
  const isAdmin = userAuth?.isAdmin;
  const access_token = userAuth?.access_token;
  const profile_img = userAuth?.profile_img;
  const new_notification_available = userAuth?.new_notification_available;

  // console.log("new_notification_available", new_notification_available);

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleSearchFn = (e: any) => {
    let query = e.target.value;
    if (e.keyCode == 13 && query.length) {
      // router.replace(`/events/search-posts?query=${query}`);
      router.push(`/search-posts/${query}`);
    }

    // console.log("query", query);
  };

  useEffect(() => {
    if (access_token) {
      axios
        .get(ServerDomain + "/notifications/new-notifications", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, new_notification_available: data });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [access_token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link href="/" className="flex-none">
          <Image src={logo2} alt="logo" className="h-14 w-14 rounded-full" />
        </Link>

        {/* Search box */}
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.! border-b border-gray-400/20 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          {/* <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          /> */}
          {/* <Input
            type="text"
            placeholder="Search..."
            className="w-full md:w-auto bg-gray-200/40 p-4 pl-6 pr-[12%] md:pr-2 rounded-full placeholder:text-gray-700/50 md:pl-10"
            onKeyDown={handleSearchFn}
          /> */}
          {/* <Form action="/events/search-posts">
            <input
              type="text"
              name="query"
              placeholder="Search for events..."
              className="w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>
          </Form> */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-auto bg-gray-200/40 p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-gray-700/50 md:pl-12"
            onKeyDown={handleSearchFn}
          />

          <IconSearch className="h-4 w-4 absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gray-700/50" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto md:gap-6">
          {/* Search icon */}
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full md:hidden bg-gray-200/40"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <IconSearch className="h-6 w-6" />
          </button>

          {/* New post */}
          {isAdmin && (
            <Link
              href="/editor"
              className="hidden bg-gray-100 gap-2 md:flex link items-center rounded-md"
            >
              <IconFilePencil className="h-6 w-6" />
              <p>New Post</p>
            </Link>
          )}

          {/* Theme toggle */}
          <button
            // onClick={changeTheme}
            className="relative w-12 h-12 rounded-full items-center justify-center flex bg-gray-100 hover:bg-black/10"
          >
            <IconMoonStars className="h-6 w-6" />
          </button>

          {/* Notification */}
          {access_token ? (
            <>
              {isAdmin && (
                <Link href={"/dashboard/notifications"}>
                  <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black/10">
                    <IconBell className="h-6 w-6" />

                    {new_notification_available && (
                      <span className="bg-red-500 w-3 h-3 rounded-full absolute top-3 right-3 z-10"></span>
                    )}
                  </button>
                </Link>
              )}
            </>
          ) : (
            ""
          )}

          {access_token != null ? (
            <div
              className="relative"
              onClick={handleUserNavPanel}
              onBlur={handleBlur}
            >
              <UserNavigationPanel profile_imag={profile_img} />
            </div>
          ) : (
            <></>
          )}

          {access_token != null ? (
            ""
          ) : (
            <>
              <Link href="/signin" className="py-2 btn-dark">
                Sign In
              </Link>

              <Link href="/signup" className="hidden py-2 btn-light md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
