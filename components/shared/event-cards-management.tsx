"use client";

import getDay from "@/common/date";
import { useAuth } from "@/context/AuthContext";
import { delete_event } from "@/services/dataServices";
import Link from "next/link";
import { useState } from "react";

const EventStats = ({ stats }: any) => {
  // console.log("stats", stats);
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
      {Object.keys(stats).map((info, i) => {
        return (
          !info.includes("parent") && (
            <div
              key={i}
              className={
                "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
                (i != 0 ? " border-grey border-l " : "")
              }
            >
              <h1 className="text-xl lg:text-2xl mb-2">
                {stats[info].toLocaleString()}
              </h1>
              <p className="max-lg:text-gray-400 capitalize">
                {info.split("_")[1]}
              </p>
            </div>
          )
        );
      })}
    </div>
  );
};

export const ManagePublishedEventsCard = ({ event }: any) => {
  let { title, event_id, banner, publishedAt, activity } = event;

  let [showStat, setShowStat] = useState(false);
  let { userAuth } = useAuth();
  let access_token = userAuth?.access_token;
  let role = userAuth?.role;

  return (
    <>
      <div className="flex gap-10 border-b mb-6 border-grey pb-6 items-center">
        <img
          src={banner}
          alt="banner"
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none rounded-md bg-grey object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              href={`/events/${event_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </Link>

            <p className="text-dark-grey line-clamp-1">
              Published on {getDay({ timestamp: publishedAt })}
            </p>
          </div>

          {role === "admin" ||
            (role === "moderator" && (
              <>
                <div className="flex gap-6 mt-3">
                  <Link
                    href={`/editor/${event_id}`}
                    className="underline pr-4 py-2 hover:text-purple-500"
                  >
                    Edit
                  </Link>
                  <button
                    className="lg:hidden pr-4 py-2 underline"
                    onClick={() => setShowStat((prevVal: any) => !prevVal)}
                  >
                    Stats
                  </button>
                  <button
                    className="pr-4 py-2 text-red-600 underline hover:text-red-300"
                    onClick={(e: any) =>
                      deleteEvent(event, access_token, e.target)
                    }
                  >
                    Delete
                  </button>
                </div>
              </>
            ))}
        </div>

        <div className="max-lg:hidden">
          <EventStats stats={activity} />
        </div>
      </div>

      {showStat && (
        <div className="lg:hidden">
          <EventStats stats={activity} />
        </div>
      )}
    </>
  );
};

export const ManageDraftEventCard = ({ event }: any) => {
  let { title, event_id, description, index } = event;

  let { userAuth } = useAuth();
  let access_token = userAuth?.access_token;
  let role = userAuth?.role;

  index++;

  return (
    <>
      <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
        <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
          {index < 10 ? "0" + index : index}
        </h1>

        <div>
          <h1 className="blog-title mb-3">{title}</h1>
          <p className="line-clamp-2 font-gelasio">
            {description.length ? description : "No description"}
          </p>

          <div className="flex gap-6 mt-3">
            {role === "admin" ||
              (role === "moderator" && (
                <>
                  <Link
                    href={`/editor/${event_id}`}
                    className="underline pr-4 py-2 hover:text-violet-500"
                  >
                    Edit
                  </Link>

                  <button
                    className="pr-4 py-2 text-red-600 hover:text-red-300 underline"
                    onClick={(e) => deleteEvent(event, access_token, e.target)}
                  >
                    Delete
                  </button>
                </>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

const deleteEvent = (event: any, access_token: any, target: any) => {
  let { index, event_id, setStateFunc } = event;

  delete_event(event_id, access_token, setStateFunc, index, target);
};
