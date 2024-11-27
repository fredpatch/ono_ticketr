"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type SearchParamProps = {
  params: { event_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

import { eventStructureOno } from "../../(ono)/page";
import { get_event } from "@/services/dataServices";
import { useParams } from "next/navigation";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import Loader from "@/components/shared/Loader";
import getDay from "@/common/date";
import Link from "next/link";
import EventInteraction from "@/components/shared/EventInteraction";
import EventContent from "@/components/shared/EventContent";
import EventPostCard from "@/components/shared/EventPostCard";
import { useAuth } from "@/context/AuthContext";

interface EventContextProps {
  event: any;
  setEvent: any;
  isLikedByUser: any;
  setIsLikedByUser: any;
}

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

export const EventContext = createContext<EventContextProps | null>(null);

const EventPage = () => {
  const hasFetchedData = useRef(false);
  const [event, setEvent] = useState<EventStructure>(eventStructureOno);
  const [similarEvents, setSimilarEvents] = useState<EventStructure[] | null>(
    null
  );
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const { userAuth } = useAuth();
  const access_token = userAuth?.access_token;

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
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img
              src={banner}
              alt="Event banner"
              className="object-cover aspect-video w-full rounded-md"
            />

            <div className="mt-12">
              <h1 className="text-3xl font-medium font-gelasio">{title}</h1>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    alt="profile user"
                    className="w-12 h-12 rounded-full"
                  />

                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link
                      href={`/user/${author_username}`}
                      className="text-gray-500 underline"
                    >
                      {author_username}
                    </Link>
                  </p>
                </div>

                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay({ timestamp: publishedAt })}
                </p>
              </div>
            </div>

            {/* interactions */}
            <EventInteraction />

            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block: any, index: any) => {
                return (
                  <div key={index} className="my-4 md:my-8">
                    <EventContent block={block} />
                  </div>
                );
              })}
            </div>

            {/* <EventInteraction /> */}
            {/* Similar */}
            {similarEvents != null && similarEvents.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Events
                </h1>

                {similarEvents.map((event: any, index: any) => {
                  let {
                    author: { personal_info },
                  } = event;

                  return (
                    <AnimationWrapper
                      keyValue={`similar-event-${index}`}
                      key={index}
                      transition={{ duration: 1, delay: 0.08 * index }}
                    >
                      <EventPostCard event={event} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </EventContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export const useEventContext = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export default EventPage;
