"use client";

import { useEventContext } from "@/app/(root)/events/[event_id]/page";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { IconBrandTwitter, IconHeart } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect } from "react";

const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

const EventInteraction = () => {
  // title,
  //   event_id: id,
  //   banner,
  //   description,
  //   location,
  //   startDateTime,
  //   endDateTime,
  //   price,
  //   isFree,
  //   url,
  //   content,
  //   tags,
  //   author: {
  //     personal_info: { fullname, username: author_username, profile_img },
  //   },
  //   activity: { total_likes },
  //   draft,
  //   publishedAt,
  //   updatedAt,
  let {
    event,
    event: {
      _id,
      title,
      event_id,
      activity,
      activity: { total_likes },
      author: {
        personal_info: { fullname, username: author_username, profile_img },
      },
    },
    setEvent,
    isLikedByUser,
    setIsLikedByUser,
  } = useEventContext();

  let { userAuth } = useAuth();
  const access_token = userAuth?.access_token;
  const username = userAuth?.username;

  useEffect(() => {
    if (access_token) {
      axios
        .post(
          ServerDomain + "/notifications/isLiked-by-user",
          { _id },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
          // console.log("@@@ isLikedByUser", data);
          setIsLikedByUser(data.result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleLike = () => {
    if (access_token) {
      // like the post
      // setIsLikedByUser((preVal: any) => !preVal);

      // !isLikedByUser ? total_likes++ : total_likes--;
      // setEvent({ ...event, activity: { ...activity, total_likes } });

      axios
        .post(
          ServerDomain + "/notifications/like-event",
          {
            _id,
            isLikedByUser,
          },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
          console.log(data);
          setIsLikedByUser(!isLikedByUser);
          setEvent({
            ...event,
            activity: {
              ...activity,
              total_likes: !isLikedByUser ? total_likes + 1 : total_likes - 1,
            },
          });

          toast({
            description: `You ${
              isLikedByUser ? "unliked" : "liked"
            } this event`,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // not logged in
      toast({
        description: "Please login to like this event.",
      });
    }
  };

  return (
    <>
      <hr className="border-gray-300 my-2" />
      <div className="flex justify-between gap-6">
        <div className="flex justify-center gap-6 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200/100 " +
              (isLikedByUser
                ? "bg-red-300/50 text-red-400"
                : "bg-gray-100 text-black")
            }
          >
            {isLikedByUser && (
              <IconHeart className="flex items-center fill-red-400" />
            )}

            {!isLikedByUser && (
              <IconHeart className="flex items-center fill-gray-400" />
            )}
          </button>

          <p className="text-xl text-gray-400">
            {total_likes ? total_likes : ""}
          </p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              href={`/editor/${event_id}`}
              className="underline hover:text-purple-400"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            target="_blank"
            href={`https://www.twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
            <IconBrandTwitter className="text-xl hover:text-blue-400" />
          </Link>
        </div>
      </div>
      <hr className="border-gray-300 my-2" />
    </>
  );
};

export default EventInteraction;
