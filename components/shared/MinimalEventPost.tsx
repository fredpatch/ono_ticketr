import getDay, { getFullDay } from "@/common/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MinimalEventPostProps {
  event: any;
  index: any;
}

const MinimalEventPost = ({ event, index }: MinimalEventPostProps) => {
  let {
    title,
    event_id,
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
    <Link
      href={`/events/${event_id}`}
      key={index}
      className="flex mb-8 gap-5 mt-10"
    >
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            width={40}
            height={40}
            className="w-6 h-6 rounded-full"
            alt="thumbnail"
          />
          <p className=" line-clamp-1">
            {fullname}@{username}
          </p>
          <p className="min-w-fit"> {getDay({ timestamp: publishedAt })} </p>
        </div>

        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalEventPost;
