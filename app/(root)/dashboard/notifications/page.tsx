import AnimationWrapper from "@/components/shared/AnimationWrapper";
import ManageNotifications from "@/components/shared/ManageNotifications";
import React from "react";

const Notifications = () => {
  return (
    <AnimationWrapper keyValue="notifications">
      <ManageNotifications />
    </AnimationWrapper>
  );
};

export default Notifications;
