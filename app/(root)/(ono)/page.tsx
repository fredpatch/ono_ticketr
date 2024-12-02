"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

import AnimationWrapper from "@/components/shared/AnimationWrapper";
import InPageNavigation, {
  activeTabRef,
} from "@/components/shared/InpageNavigation";
import Loader from "@/components/shared/Loader";
import NoDataMessage from "@/components/shared/NoDataMessage";
import React, { useEffect, useState } from "react";
import MinimalEventPost from "@/components/shared/MinimalEventPost";
import {
  eventsByCategory,
  latest_events,
  trending_events,
} from "@/services/dataServices";
import { LoadMoreDataBtn } from "@/components/shared/LoadMoreDataBtn";
import EventCard from "@/components/shared/EventCard";
import useEventStore from "@/store/store";
import {
  fetchEventsByCategory,
  fetchLatestEvents,
  fetchTrendingEvents,
} from "@/hooks/zustand";

const HomePage = () => {
  const [pageState, setPageState] = useState("homepage");
  let categories = [
    "Showcase",
    "Enb",
    "Nightlife",
    "Gaming",
    "Football",
    "SpotLight",
  ];

  const { events, setEvents, trendingEvents, loading, setLoading } =
    useEventStore();

  useEffect(() => {
    // set inPageIndex
    activeTabRef.current?.click();

    setLoading(true);
    if (pageState == "homepage") {
      fetchLatestEvents({ page: 1 }).finally(() => setLoading(false));
    } else {
      fetchEventsByCategory(pageState, { page: 1 }).finally(() =>
        setLoading(false)
      );
    }

    if (!trendingEvents) {
      fetchTrendingEvents();
    }
  }, [pageState]);

  const loadEventByCategory = async (e: any) => {
    let category = e.target.innerText.toLowerCase();

    setEvents(null);
    setLoading(true);

    if (pageState == category) {
      setPageState("homepage");
      return;
    }

    setPageState(category);
    setLoading(false);
  };

  const upcomingEvents =
    events?.results.filter((event: any) => {
      return new Date(event.startDateTime) > new Date();
    }) || [];

  const pastEvents =
    events?.results.filter((event: any) => {
      return new Date(event.startDateTime) < new Date();
    }) || [];

  // console.log("@@@ Upcoming Events ==> ", upcomingEvents);
  // console.log("@@@ Past Events ==> ", pastEvents);

  return (
    <div className="">
      <AnimationWrapper>
        <section className="h-cover flex gap-5">
          {/* Latest Events */}
          <div className="w-full">
            <InPageNavigation
              routes={[pageState, "trending post"]}
              defaultHidden={["trending post"]}
            >
              {/* Loading State */}
              {loading ? (
                <Loader />
              ) : (
                <>
                  {/* Upcoming event section */}
                  {upcomingEvents != null && upcomingEvents?.length > 0 ? (
                    <>
                      <h1 className="text-3xl font-semibold mt-10">
                        Upcoming Events
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                        {upcomingEvents?.map((event: any, i: any) => {
                          return (
                            <AnimationWrapper
                              keyValue={"event" + i}
                              key={i}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="mt-5"
                            >
                              {/* <EventPostCard event={event} /> */}
                              <EventCard event={event} />
                            </AnimationWrapper>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <NoDataMessage
                      message={
                        pastEvents?.length > 0
                          ? "No upcoming events at the moment. Check out past events below!"
                          : "No events found yet. Please check back later!"
                      }
                    />
                  )}

                  {/* Past events section */}
                  {pastEvents != null && pastEvents?.length > 0 && (
                    <>
                      <h1 className="text-3xl font-semibold mt-10">
                        Past Events
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                        {pastEvents?.map((event: any, i: any) => {
                          return (
                            <AnimationWrapper
                              keyValue={"event" + i}
                              key={i}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="mt-5"
                            >
                              {/* <EventPostCard event={event} /> */}
                              <EventCard event={event} />
                            </AnimationWrapper>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <LoadMoreDataBtn
                    state={events}
                    fetchDataFun={
                      pageState === "homepage"
                        ? fetchLatestEvents
                        : fetchEventsByCategory
                    }
                  />
                </>
              )}

              {trendingEvents == null ? (
                <Loader />
              ) : trendingEvents.length ? (
                trendingEvents.map((event: any, i: any) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      keyValue={"event" + i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalEventPost event={event} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="Aucun Event tendance pour le moment" />
              )}
            </InPageNavigation>
          </div>

          {/* Trending Blog & filters*/}
          <div className=" min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="text-xl font-medium mb-8">Trending stories</h1>

                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, i) => {
                    return (
                      <button
                        className={
                          "tag" +
                          (pageState === category ? " bg-black text-white" : "")
                        }
                        key={i}
                        onClick={loadEventByCategory}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h1 className="text-xl font-medium mb-8">
                  Event Trending
                  <FontAwesomeIcon className="ml-2" icon={faArrowTrendUp} />
                </h1>

                {trendingEvents == null ? (
                  <Loader />
                ) : trendingEvents.length ? (
                  trendingEvents.map((event: any, i: any) => {
                    return (
                      <AnimationWrapper
                        keyValue={"event" + i}
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <MinimalEventPost event={event} index={i} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No trending events found yet!" />
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </div>
  );
};

export default HomePage;
