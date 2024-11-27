"use client";

import getDay from "@/common/date";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";

const NotificationCard = ({ notificationState, index, data }: any) => {
  // console.log("@@@ notificationState ==> ", data);
  let {
    // reply,
    type,
    user,
    user: {
      personal_info: { fullname, username, profile_img },
    },
    // replied_on_comment,
    // comment,
    createdAt,
    event: { _id, event_id, title },
    _id: notification_id,
    seen,
  } = data;

  let {
    notifications: { results, totalDocs },
    setNotifications,
    notifications,
  } = notificationState;

  let { userAuth } = useAuth();
  const access_token = userAuth?.access_token;
  const isAdmin = userAuth?.isAdmin;
  const author_profile_img = userAuth?.profile_img;
  const author_username = userAuth?.username;

  return (
    <div
      className={
        "p-6 border-b border-gray-400 border-l-black " +
        (!seen ? " border-l-2" : " ")
      }
    >
      <div className="flex gap-5 mb-3">
        <img
          src={profile_img}
          alt="profile image"
          className="w-14 h-14 rounded-full flex-none"
        />

        <div className="w-full">
          <h1 className="font-medium text-xl text-gray-500">
            <span className=" lg:inline-block hidden capitalize">
              {fullname}{" "}
            </span>

            <Link
              href={`/user/${username}`}
              className="underline mx-1 text-black"
            >
              @{username}
            </Link>

            <span className="font-normal">
              {type === "like"
                ? " Liked your post"
                : type === "comment"
                ? " Commented on your post"
                : " Replied on"}
            </span>
          </h1>

          {/* {type === "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-gray-100">
              <p>{replied_on_comment?.comment}</p>
            </div>
          ) : (
            )} */}
          <Link
            href={`/events/${event_id}`}
            className="font-medium text-gray-500 hover:underline line-clamp-1"
          >
            {`"${title}"`}
          </Link>
        </div>
      </div>

      {type != "like" ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {/* {comment?.comment} */}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay({ timestamp: createdAt })}</p>

        {/* {type != "like" ? (
          <>
            {!reply ? (
              <button
                className="underline hover:text-black"
                onClick={handleReplyClick}
              >
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              className="underline hover:text-black"
              onClick={(e) =>
                handleDeleteClick(comment._id, "comment", e.target)
              }
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )} */}
      </div>

      <div>
        <p className="text-right text-dark-grey mt-2">{index + 1} .</p>
      </div>
    </div>
  );
};

export default NotificationCard;
