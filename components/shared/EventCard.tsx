"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  MapPin,
  PencilIcon,
  StarIcon,
} from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import { IconHeart } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContextV2";
import { getAuthStore } from "@/store/store";

const EventCard = ({ event }: any) => {
  let router = useRouter();
  let {
    event_id,
    banner,
    startDateTime,
    author: {
      personal_info: { username: event_author },
    },
  } = event;
  // let { userAuth } = useAuth();
  let { user, access_token } = getAuthStore();
  // const username = userAuth?.username;
  const username = user?.username;

  const actualDate = Date.now();
  const eventDate = new Date(startDateTime).getTime();

  const isPastEvent = eventDate < actualDate;
  const isEventOwner = event_author === username;
  // console.log("event card", event);

  // Ticket status
  const renderTicketStatus = () => {
    if (!access_token) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/events/${event_id}/edit`);
            }}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-400 transition-colors duration-200 shadow-md dark:shadow-white flex items-center justify-center gap-2"
          >
            <PencilIcon className="w-5 h-5" />
            Edit Event
          </button>
        </div>
      );
    }

    /* If user bought a ticket already */
    if (event) {
      return (
        <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">
              You have a ticket!
            </span>
          </div>
          <button
            // onClick={() => router.push(`/tickets/${userTicket._id}`)}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
          >
            View your ticket
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        onClick={() => router.push(`/events/${event_id}`)}
        className={`bg-white rounded-xl shadow-sm hover:shadow-lg dark:shadow-zinc-400 transition-all duration-300 border dark:border-gray-600 border-gray-100 cursor-pointer overflow-hidden relative hover:opacity-100 ${
          isPastEvent ? "opacity-65" : ""
        } "
      }`}
      >
        {/* Event Image */}
        <div className="relative w-full h-48">
          <Image
            src={banner}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Event Details */}
        <div className={`p-6 ${banner ? "relative" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-col items-start gap-2">
                {isEventOwner && (
                  <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <StarIcon className="w-3 h-3" />
                    Your Event
                  </span>
                )}
                <h1
                  className="text-2xl font-semibold font-gelasio
               text-gray-700"
                >
                  {event.title}
                </h1>
              </div>

              {isPastEvent && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                  Past Event
                </span>
              )}
            </div>
            {/* Price Tag */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <span
                className={`px-4 py-1.5 font-semibold text-sm rounded-full ${
                  isPastEvent
                    ? "bg-gray-50 text-gray-500"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {!event?.isFree
                  ? event?.price
                    ? `${event.price.toFixed()} xaf`
                    : "Free"
                  : "Free"}
              </span>
              <span className="flex items-center gap-2 text-gray-400">
                <IconHeart
                  className={`w-6 h-6 ${
                    isPastEvent
                      ? "text-gray-500 fill-gray-200"
                      : "text-red-400 fill-red-200"
                  }`}
                />
                {event?.activity.total_likes}
              </span>
              {/* {availability.purchasedCount >= availability.totalTickets && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                Sold Out
              </span>
            )} */}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>
                {new Date(event.startDateTime).toLocaleDateString()}{" "}
                {isPastEvent && "(Ended)"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-gray-600 text-sm line-clamp-2">
            {event.description}
          </p>

          {/* <div onClick={(e) => e.stopPropagation()}>
            {!isPastEvent && renderTicketStatus()}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default EventCard;
