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
  IconSun,
} from "@tabler/icons-react";
import UserNavigationPanel from "./UserNavigationPanel";
// import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { logo1, logo2 } from "@/public/assets/logo";
import { useTheme } from "@/context/ThemeContext";
import { StoreInLocal } from "@/common/localeStore";
// import { useAuth } from "@/context/AuthContextV2";
import useAuthStore, { getAuthStore } from "@/store/store";
import { useAuthV3 } from "@/app/api/AuthProviderV3";

const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

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
  let { theme, toggleTheme } = useTheme();

  const { access_token, setAuth, user } = useAuthStore();
  const profile_img = user?.profile_img;
  const role = user?.role;

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
  };

  // useEffect(() => {
  //   if (access_token) {
  //     axios
  //       .get(ServerDomain + "/notifications/new-notifications", {
  //         headers: { Authorization: `Bearer ${access_token}` },
  //       })
  //       .then(({ data }) => {
  //         setUserAuth({ ...userAuth, new_notification_available: data });
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }, [access_token]);

  const changeTheme = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    toggleTheme();

    document.body.setAttribute("data-theme", newTheme);
    StoreInLocal("theme", newTheme);
  };

  return (
    <>
      <nav className="navbar z-50 bg-white dark:bg-zinc-800 transition-colors duration-200 ease-in-out">
        <Link href="/" className="flex-none">
          <Image
            src={theme === "light" ? logo1 : logo2}
            alt="logo"
            className="h-14 w-14 rounded-full"
          />
        </Link>

        {/* Search box */}
        <div
          className={
            "absolute bg-white dark:bg-zinc-800  w-full left-0 top-full mt-0.! border-b border-gray-400/20 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-auto bg-gray-200/40 dark:bg-slate-200 p-4 pl-6 pr-[12%] md:pr-6 rounded-full dark:placeholder:text-zinc-800 placeholder:text-gray-700/50 md:pl-12"
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
          {role === "admin" ||
            (role === "moderator" && (
              <Link
                href="/editor"
                className="hidden bg-gray-100 gap-2 md:flex link items-center rounded-md"
              >
                <IconFilePencil className="h-6 w-6" />
                <p>New Post</p>
              </Link>
            ))}

          {/* Theme toggle */}
          <button
            onClick={changeTheme}
            className="relative w-12 h-12 rounded-full items-center justify-center flex bg-gray-100 dark:bg-zinc-300 dark:hover:bg-white hover:bg-black/10"
          >
            {theme === "light" ? (
              <IconMoonStars className="h-6 w-6 dark:text-zinc-800" />
            ) : (
              <IconSun className="h-6 w-6 dark:text-zinc-800" />
            )}
          </button>

          {/* Notification */}
          {access_token ? (
            <>
              {role === "admin" && (
                <Link href={"/dashboard/notifications"}>
                  <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black/10">
                    <IconBell className="h-6 w-6" />

                    {/* {new_notification_available && (
                        <span className="bg-red-500 w-3 h-3 rounded-full absolute top-3 right-3 z-10"></span>
                      )} */}
                  </button>
                </Link>
              )}
            </>
          ) : (
            ""
          )}

          {access_token ? (
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
