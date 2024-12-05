"use client";

import React, { useEffect, useRef, useState } from "react";

export type SearchParamProps = {
  params: { event_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

import { get_event } from "@/services/dataServices";
import { useParams } from "next/navigation";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import Loader from "@/components/shared/Loader";
import getDay from "@/common/date";
import Link from "next/link";
import EventInteraction from "@/components/shared/EventInteraction";
import EventContent from "@/components/shared/EventContent";
import EventPostCard from "@/components/shared/EventPostCard";
// import { useAuth } from "@/context/AuthContext";
import EventContext from "@/context/EventContext";
import { useAuth } from "@/context/AuthContextV2";
import { getAuthStore } from "@/store/store";
import Image from "next/image";
import {
  IconCalendar,
  IconCalendarMonth,
  IconMap,
  IconMapPin,
  IconPin,
  IconTicket,
} from "@tabler/icons-react";
import EventCard from "@/components/shared/EventCard";
import { Button } from "@/components/ui/button";

const eventStructureOno = {
  event_id: "",
  title: "",
  banner: "",
  description: "", // Short description with a max length, similar to `des`
  content: [], // Content sections, an array for flexibility
  tags: [],
  author: {
    personal_info: {
      fullname: "",
      email: "",
      username: "",
      profile_img: "",
    },
  },
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0,
  },
  comments: [], // Array to hold comment IDs or comment data
  draft: false, // Boolean for draft or published status
  location: "", // String for location details
  startDateTime: new Date().toISOString(), // Default to current date
  endDateTime: new Date().toISOString(), // Default to current date
  price: 0,
  isFree: true, // Boolean flag for free events
  url: "", // External URL related to the event
  category: "", // String or ID for category
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Define types for event structure
interface EventAuthor {
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
  };
}

interface EventActivity {
  total_likes: number;
}

interface EventBlock {
  // Define properties of a block, such as text, images, etc.
  type: string;
  data: any; // Replace 'any' with specific types if possible
}

interface EventContent {
  blocks: EventBlock[];
}

interface EventStructure {
  title: string;
  event_id: string;
  banner: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  price: number;
  isFree: boolean;
  url: string;
  content: EventContent[];
  tags: string[];
  author: EventAuthor;
  activity: EventActivity;
  draft: boolean;
  publishedAt: string;
  updatedAt: string;
}

const EventPage = () => {
  const hasFetchedData = useRef(false);
  const [event, setEvent] = useState<EventStructure>(eventStructureOno);
  const [similarEvents, setSimilarEvents] = useState<EventStructure[] | null>(
    null
  );
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const { access_token } = getAuthStore();

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
    content,
    tags,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    activity: { total_likes },
    draft,
    publishedAt,
    updatedAt,
  } = event;

  useEffect(() => {
    if (hasFetchedData.current) return;
    resetStates();
    get_event(event_id, setEvent, setSimilarEvents, setLoading, access_token);
    hasFetchedData.current = true; // Mark data as fetched, prevent future calls
  }, [event_id]);

  const resetStates = () => {
    setEvent(eventStructureOno);
    setSimilarEvents(null);
    setIsLikedByUser(false);
    setLoading(true);
  };

  return (
    <AnimationWrapper keyValue="event-page">
      {loading ? (
        <Loader />
      ) : (
        <EventContext.Provider
          value={{ event, setEvent, isLikedByUser, setIsLikedByUser }}
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {banner && (
                  <div className="aspect-[21/9] relative w-full">
                    <Image
                      src={banner}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <EventInteraction />
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Event Details */}
                    <div className="space-y-8">
                      <div>
                        <h1 className="text-4xl font-bold dark:text-gray-50 text-gray-900 mb-4">
                          {title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-100">
                          <div className="my-12 font-gelasio blog-page-content">
                            {content[0].blocks.map((block: any, index: any) => {
                              return (
                                <div key={index} className="my-4 md:my-8">
                                  <EventContent block={block} />
                                </div>
                              );
                            })}
                          </div>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex">
                            <IconCalendarMonth className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="text-sm font-medium">Date</span>
                          </div>
                          <p className="text-gray-500">
                            {new Date(startDateTime).toLocaleString("en-US")}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center text-gray-600 mb-1">
                            <IconMapPin className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="text-sm font-medium">
                              Location
                            </span>
                          </div>
                          <p className="text-gray-500">{location}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center text-gray-600 mb-1">
                            <IconTicket className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="text-sm font-medium">Price</span>
                          </div>
                          <p className="text-gray-500">
                            {price.toFixed(2)} CFA
                          </p>
                        </div>

                        {/* Tickets availability */}
                        {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900">
                      {availability.totalTickets - availability.purchasedCount}{" "}
                      / {availability.totalTickets} left
                    </p>
                  </div> */}
                      </div>

                      {/* Additional Event Information */}
                      <div className="bg-blue-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          Event Information
                        </h3>
                        <ul className="space-y-2 text-blue-700 font-medium">
                          <li>
                            • Please arrive 15 minutes before the event starts
                          </li>
                          <li>• Tickets are non-refundable</li>
                          <li>• Age restriction: 18+</li>
                        </ul>
                      </div>
                    </div>

                    {/* Right Column - Event Tickets Purchase */}
                    <div>
                      <div className="">
                        <EventCard key={"event"} event={event} />

                        {access_token ? (
                          <>
                            <Link href={`/events/${event_id}/checkout`}>
                              <Button className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-serif">
                                Buy a ticket
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/signin">
                              <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-serif">
                                Sign In To Buy A Ticket
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EventContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default EventPage;

// {/* <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
//   <Image
//     width={1000}
//     height={1000}
//     src={banner}
//     alt="Event banner"
//     className="object-cover aspect-video w-full rounded-md"
//   />

//   <div className="mt-12">
//     <h1 className="text-3xl font-medium font-gelasio">{title}</h1>

//     <div className="flex max-sm:flex-col justify-between my-8">
//       <div className="flex gap-5 items-start">
//         <img
//           src={profile_img}
//           alt="profile user"
//           className="w-12 h-12 rounded-full"
//         />

//         <p className="capitalize">
//           {fullname}
//           <br />@
//           <Link
//             href={`/user/${author_username}`}
//             className="text-gray-500 underline"
//           >
//             {author_username}
//           </Link>
//         </p>
//       </div>

//       <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
//         Published on {getDay({ timestamp: publishedAt })}
//       </p>
//     </div>
//   </div>

//   {/* interactions */}
//   <EventInteraction />

//   <div className="my-12 font-gelasio blog-page-content">
//     {content[0].blocks.map((block: any, index: any) => {
//       return (
//         <div key={index} className="my-4 md:my-8">
//           <EventContent block={block} />
//         </div>
//       );
//     })}
//   </div>

//   {/* <EventInteraction /> */}
//   {/* Similar */}
//   {similarEvents != null && similarEvents.length ? (
//     <>
//       <h1 className="text-2xl mt-14 mb-10 font-medium">
//         Similar Events
//       </h1>

//       {similarEvents.map((event: any, index: any) => {
//         let {
//           author: { personal_info },
//         } = event;

//         return (
//           <AnimationWrapper
//             keyValue={`similar-event-${index}`}
//             key={index}
//             transition={{ duration: 1, delay: 0.08 * index }}
//           >
//             <EventPostCard event={event} author={personal_info} />
//           </AnimationWrapper>
//         );
//       })}
//     </>
//   ) : (
//     ""
//   )}
// </div> */}
