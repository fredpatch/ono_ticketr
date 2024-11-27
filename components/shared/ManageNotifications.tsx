"use client";

import { useAuth } from "@/context/AuthContext";
import { fetchNotifications } from "@/services/notificationServices";
import { access } from "fs";
import React, { useEffect, useState } from "react";
import { activeTabRef } from "./InpageNavigation";
import Loader from "./Loader";
import AnimationWrapper from "./AnimationWrapper";
import NoDataMessage from "./NoDataMessage";
import { LoadMoreDataBtn } from "./LoadMoreDataBtn";
import NotificationCard from "./NotificationCard";

interface NotificationItem {
  event_id: string;
  title: string;
  banner: string;
  description: string;
}

interface Notifications {
  results: [];
  page: number;
  totalDocs?: number;
  deletedDocCount?: any;
}

const ManageNotifications = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notifications | null>(
    null
  );

  let { userAuth, setUserAuth } = useAuth();
  let access_token = userAuth?.access_token;
  let new_notification_available = userAuth?.new_notification_available;

  // let filters = ["all", "like", "comment", "reply"];
  let filters = ["all", "like"];

  useEffect(() => {
    // activeTabRef.current?.click();
    if (userAuth && access_token) {
      fetchNotifications({
        filter,
        page: 1,
        access_token,
        new_notification_available,
        userAuth,
        setUserAuth,
        notifications,
        setNotifications,
      });
    }
  }, [filter, userAuth]);

  const handleFilter = (e: any) => {
    let btn = e.target;

    setFilter(btn.innerHTML);
    setNotifications(null);
  };

  return (
    <div>
      <h1 className="max-md:hidden text-lg">Recent Notifications</h1>

      <div className="flex gap-6 my-8">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter === filterName ? "btn-dark" : "btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification: any, i: number) => {
              // console.log("@@@ notification", notification);
              return (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.08 }}
                >
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message="No notifications available" />
          )}

          <LoadMoreDataBtn
            state={notifications}
            fetchDataFun={fetchNotifications}
            additionalParams={{
              deletedDocCount: notifications.deletedDocCount,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ManageNotifications;
