"use client";

import { createContext, useContext } from "react";

interface EventContextProps {
  event: any;
  setEvent: any;
  isLikedByUser: any;
  setIsLikedByUser: any;
}

const EventContext = createContext<EventContextProps | null>(null);

export const useEventContext = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export default EventContext;