"use client";

import { useAuth } from "@/context/AuthContext";
import {
  IconAt,
  IconBell,
  IconFileChart,
  IconFileLike,
  IconFileSettings,
  IconLock,
  IconMenu3,
  IconUserCog,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

let activeTabLineRef: React.RefObject<HTMLHRElement>;
let sideBarIconTab: React.RefObject<HTMLButtonElement>;
let pageStateTab: React.RefObject<HTMLButtonElement>;

const SideNav = ({ children }: { children: React.ReactNode }) => {
  // active tab
  const [pageState, setPageState] = React.useState("");
  const [showSideNav, setShowSideNav] = React.useState(false);
  const router = useRouter();
  let { userAuth } = useAuth();
  let isAdmin = userAuth?.isAdmin;
  let access_token = userAuth?.access_token;
  let new_notification_available = userAuth?.new_notification_available;

  activeTabLineRef = useRef<HTMLHRElement>(null);
  sideBarIconTab = useRef<HTMLButtonElement>(null);
  pageStateTab = useRef<HTMLButtonElement>(null);

  const changePageState = (e: any) => {
    let { offsetWidth, offsetLeft } = e.target;

    if (activeTabLineRef.current) {
      activeTabLineRef.current.style.width = `${offsetWidth}px`;
      activeTabLineRef.current.style.left = `${offsetLeft}px`;
    }

    if (e.target == sideBarIconTab.current) {
      setShowSideNav(!showSideNav);
    }
  };

  useEffect(() => {
    // activeTabRef.current?.click();

    // Ensure this only runs on the client side
    if (typeof window !== "undefined") {
      const page = location.pathname.split("/")[2] || "";
      setPageState(page.replace("-", " "));
    }
  }, []);
  return access_token === null ? (
    <>{router.push("/signin")}</>
  ) : (
    <>
      <section className="relative flex gap-10 py-0 max-md:flex-col">
        <div className="sticky top-[80px] z-30">
          <div className="md:hidden bg-white py-1 border-b border-gray-100 flex flex-nowrap overflow-x-auto">
            <button
              className="p-5 capitalize"
              ref={sideBarIconTab}
              onClick={changePageState}
            >
              <IconMenu3 className="pointer-events-none" />
            </button>
            <button className="p-5 capitalize" ref={pageStateTab}>
              {pageState}
            </button>
            <hr
              ref={activeTabLineRef}
              className="absolute duration-500 bottom-0"
            />
          </div>

          <div
            className={
              "min-h-[200px] h-[calc(100vh-80px-60px)] md:h-full mt-10 md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-gray-300 md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100vw+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
              (!showSideNav
                ? "max-md:opacity-0 max-md:pointer-events-none"
                : "opacity-100 pointer-events-auto")
            }
          >
            <h1 className="text-xl text-gray-500 mb-3">Dashboard</h1>
            <hr className="border-gray-400 -ml-6 mb-8 mr-6" />

            <Link
              className="sidebar-link"
              href="/dashboard/manage-events"
              onClick={(e: any) => setPageState(e.target.innerText)}
            >
              <IconFileLike />
              Events
            </Link>

            <Link
              className={"sidebar-link"}
              href="/dashboard/notifications"
              onClick={(e: any) => setPageState(e.target.innerText)}
            >
              <div className="relative">
                <IconBell />
                {new_notification_available && (
                  <span className="bg-red-400 w-3 h-3 rounded-full absolute top-0 right-0 z-10"></span>
                )}
              </div>
              Notifications
            </Link>

            {/* Only admin and creator can access editor */}
            {isAdmin && (
              <Link
                className="sidebar-link"
                href="/editor"
                onClick={(e: any) => setPageState(e.target.innerText)}
              >
                <IconFileSettings />
                Editor
              </Link>
            )}

            <h1 className="text-xl text-gray-500 mb-3 mt-20">Settings</h1>
            <hr className="border-gray-400 -ml-6 mb-8 mr-6" />

            <Link
              className="sidebar-link"
              href="/dashboard/settings/edit-profile"
              onClick={(e: any) => setPageState(e.target.innerText)}
            >
              <IconUserCog />
              Edit Profile
            </Link>

            <Link
              className="sidebar-link"
              href="/dashboard/settings/change-password"
              onClick={(e: any) => setPageState(e.target.innerText)}
            >
              <IconLock />
              Change Password
            </Link>
          </div>
        </div>

        <>{children}</>
      </section>
    </>
  );
};

export default SideNav;
