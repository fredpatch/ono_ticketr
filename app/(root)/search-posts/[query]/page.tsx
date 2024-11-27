"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { ServerDomain } from "../../(ono)/page";
import NoDataMessage from "@/components/shared/NoDataMessage";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { FilterPaginationData } from "@/common/filter-pagination-data";
import InPageNavigation from "@/components/shared/InpageNavigation";
import { LoadMoreDataBtn } from "@/components/shared/LoadMoreDataBtn";
import EventPostCard from "@/components/shared/EventPostCard";
import { IconUser } from "@tabler/icons-react";

interface UserCardProps {
  user: [{ fullname: string; username: string; profile_img: string }];
}

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
}

interface Users {
  results: EventItem[];
  page: number;
  totalDocs?: number;
}

const SearchEventPage = () => {
  let { query } = useParams();

  // console.log("query on search page", query);

  let [events, setEvents] = React.useState<Events | null>(null);
  let [users, setUsers] = React.useState<UserCardProps | null>(null);

  const searchEvents = ({ page = 1, create_new_array = false }) => {
    axios
      .post(ServerDomain + "/events/search-posts", { query, page })
      .then(async ({ data }) => {
        let formattedData = await FilterPaginationData({
          state: events,
          data: data.events,
          page,
          countRoute: "/events/search-posts-count",
          data_to_send: { query },
          create_new_array,
        });

        // console.log("@@@ FORMATTED DATA", formattedData);
        setEvents(formattedData);
      })
      .catch((error) => console.error("  Error Fetching Events =>", error));
  };

  const fetchUsers = async () => {
    await axios
      .post(ServerDomain + "/user/search-users", {
        query,
      })
      .then(({ data: user }) => {
        // console.log(user);
        setUsers(user);
      })
      .catch((error) => console.log("  Error Fetching Users =>", error));
  };

  useEffect(() => {
    resetState();
    searchEvents({ page: 1, create_new_array: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setEvents(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users?.user.length ? (
          users?.user.map((user: any, i: any) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="Aucun utilisateur correspondant n'a été trouvé" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Résultats de la recherche "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {events == null ? (
              <Loader />
            ) : events.results.length ? (
              events.results.map((event: any, i: any) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <EventPostCard
                      event={event}
                      author={event.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage
                message={`Aucun evenement correspondant n'a été trouvé pour : "${query}"`}
              />
            )}

            <LoadMoreDataBtn state={events} fetchDataFun={searchEvents} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className=" min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className=" font-medium text-xl mb-8">
          Utilisateurs liés à la recherche
        </h1>

        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchEventPage;
