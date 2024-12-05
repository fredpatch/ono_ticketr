"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { IconFile, IconHome2, IconUser } from "@tabler/icons-react";
import AnimationWrapper from "./AnimationWrapper";
import useAuthStore, { getAuthStore } from "@/store/store";
import { useAuthV3 } from "@/app/api/AuthProviderV3";

interface UserNavigationPanelProps {
  profile_imag: any;
}

const UserNavigationPanel = ({ profile_imag }: UserNavigationPanelProps) => {
  const { logout } = useAuthV3();
  const { user } = useAuthStore();
  const username = user?.username;
  const role = user?.role;

  return (
    <AnimationWrapper
      transition={{ duration: 0.2, delay: 0 }}
      keyValue="userPanel"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <button className="w-12 h-12 mt-1"> */}
          <img
            src={profile_imag}
            alt="profile"
            className="object-cover w-12 h-12 rounded-full"
          />
          {/* </button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 mr-10">
          <DropdownMenuLabel className="capitalize font-inter">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Only available admin and creator can create new post */}
          {role === "admin" && (
            <DropdownMenuItem className="w-full">
              <Link
                href="/editor"
                className="flex items-center gap-2 font-inter link"
              >
                <IconFile className="w-6 h-6" size={24} />
                New Post
              </Link>
            </DropdownMenuItem>
          )}

          {/* Profile view only available for admin and creator */}
          {role === "admin" && (
            <DropdownMenuItem>
              <Link
                href={`/user/${username}`}
                className="flex items-center gap-2 font-inter link"
              >
                <IconUser className="w-6 h-6" size={24} />
                Profile
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link
              href={`/dashboard/manage-events`}
              className="flex items-center gap-2 font-inter link"
            >
              <IconHome2 size={24} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              className="w-full pl-8 font-inter text-left"
              onClick={logout}
            >
              <h1 className="m-1 text-lg font-bold">Sign Out</h1>
              <p className="text-gray-400">@{username}</p>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
