"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CardEventProps {
  event: any;
}

export default function CardDemo({ event }: CardEventProps) {
  let {
    title,
    event_id: id,
    banner,
    description,
    location,
    startDateTime,
    endDateTime,
    price,
    isFree,
    url,
    category,
    content,
    tags,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    activity,
    draft,
    publishedAt,
    updatedAt,
  } = event;

  return (
    <div className="mx-auto sm:w-full max-w-xl h-[16rem] group/card">
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-full rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          `bg-[${banner}] bg-cover`
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <Link href={`/events/${id}`} key={id}>
          <div className="flex flex-row items-center space-x-4 z-10">
            <Image
              height="100"
              width="100"
              alt="Avatar"
              src="/imgs/user-profile.png"
              className="h-10 w-10 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-800 relative z-10">
                {username}@{fullname}
              </p>
              <p className="text-sm text-gray-400">2 min read</p>
            </div>
          </div>
        </Link>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800 relative z-10">
            {title}
          </h1>
          <p className="font-normal text-md text-gray-700 relative z-10 my-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
