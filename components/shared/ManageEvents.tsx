"use client";

import { useAuth } from "@/context/AuthContext";
import { get_events } from "@/services/dataServices";
import { IconSearch } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import InPageNavigation, { activeTabRef } from "./InpageNavigation";
import Loader from "./Loader";
import AnimationWrapper from "./AnimationWrapper";
import { LoadMoreDataBtn } from "./LoadMoreDataBtn";
import NoDataMessage from "./NoDataMessage";
import {
  ManageDraftEventCard,
  ManagePublishedEventsCard,
} from "./event-cards-management";

interface EventItem {
  event_id: string;
  title: string;
  banner: string;
  description: string;
}

interface Events {
  results: EventItem[];
  page: number;
  totalDocs?: number;
  deletedDocCount?: any;
}

interface EventsDraft {
  results: EventItem[];
  page: number;
  totalDocs?: number;
  deletedDocCount?: any;
}

const ManageEvents = () => {
  const [events, setEvents] = useState<Events | null>(null);
  const [drafts, setDrafts] = useState<EventsDraft | null>(null);
  const [query, setQuery] = useState("");
  const { userAuth } = useAuth();
  const access_token = userAuth?.access_token;
  const isAdmin = userAuth?.isAdmin;

  const searchParams = useSearchParams();
  const activeTab = searchParams ? searchParams.get("tab") : null;

  useEffect(() => {
    activeTabRef.current?.click();
    if (access_token) {
      if (events == null) {
        // get events logic
        get_events({
          page: 1,
          draft: false,
          drafts,
          access_token,
          events,
          setEvents,
          setDrafts,
          query,
        });
      }

      if (drafts == null) {
        // get drafts logic
        get_events({
          page: 1,
          draft: true,
          drafts,
          access_token,
          events,
          setEvents,
          setDrafts,
          query,
        });
      }
    }
  }, [query, drafts, events, access_token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.length) {
      setQuery("");
      setEvents(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e: any) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length) {
      setEvents(null);
      setDrafts(null);
    }
  };

  return (
    <div>
      <h1 className="max-md:hidden text-lg">
        {isAdmin ? "Manage Events" : "Manage Bookings"}
      </h1>

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-gray-100 p-4 pl-12 rounded-full placeholder:text-gray-400"
          placeholder="Search events"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <IconSearch className="absolute right-[10%] md:left-5 top-1/2 -translate-y-1/2 text-xl md:pointer-events-none text-gray-400" />
      </div>

      <InPageNavigation
        routes={[
          `${isAdmin ? "Published Events" : "Event Booked"}`,
          `${isAdmin ? "draft" : ""}`,
        ]}
        defaultActiveIndex={activeTab != "draft" ? 0 : 1}
      >
        {events == null ? (
          <Loader />
        ) : events.results.length ? (
          <>
            {events.results.map((event: EventItem, index) => {
              return (
                <AnimationWrapper
                  key={index}
                  transition={{ duration: 1, delay: index * 0.04 }}
                >
                  <ManagePublishedEventsCard
                    event={{
                      ...event,
                      index: index,
                      setStateFunc: setEvents,
                    }}
                    index={index}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={events}
              fetchDataFun={get_events}
              additionalParams={{
                draft: false,
                deletedDocCount: events.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoDataMessage
            message={`${
              isAdmin ? "No published events yet" : "No events booked yet"
            } `}
          />
        )}

        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((event: EventItem, index) => {
              return (
                <AnimationWrapper
                  key={index}
                  transition={{ duration: 1, delay: index * 0.04 }}
                >
                  <ManageDraftEventCard
                    event={{
                      ...event,
                      index: index,
                      setStateFunc: setDrafts,
                    }}
                    index={index}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={events}
              fetchDataFun={get_events}
              additionalParams={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoDataMessage message="No Draft yet" />
        )}
      </InPageNavigation>
    </div>
  );
};

export default ManageEvents;
