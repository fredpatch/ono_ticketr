/* Zustand logic */

import { FilterPaginationData } from "@/common/filter-pagination-data";
import { lookInLocal } from "@/common/localeStore";
import useEventStore from "@/store/store";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const fetchLatestEvents = async ({ page = 1 }) => {
  const { events, setEvents } = useEventStore.getState();

  try {
    const { data } = await axios.post(`${API_URL}/events/latest-events`, {
      page,
    });
    const formattedData = await FilterPaginationData({
      state: events,
      data: data.events,
      page: page,
      countRoute: "/events/all-latest-events-count",
    });
    setEvents(formattedData);
  } catch (error) {
    console.log(error);
  }
};

export const publishEvent = async (event: any, event_id: string) => {
  const banner_public_id = lookInLocal("fileKey");

  try {
    const response = await axios.post(
      `${API_URL}/events/publish-event`,
      { ...event, id: event_id, banner_public_id },
      {
        headers: {
          Authorization: `Bearer ${event.access_token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(`Error publishing event: ${error}`);
  }
};

export const fetchTrendingEvents = async () => {
  const { setTrendingEvents } = useEventStore.getState();

  try {
    const { data } = await axios.get(`${API_URL}/events/trending-events`);
    setTrendingEvents(data.events);
  } catch (error) {
    console.log("Error fetching trending events:", error);
  }
};

export const fetchEventsByCategory = async (pageState: any, { page = 1 }) => {
  const { events, setEvents } = useEventStore.getState();

  try {
    const { data } = await axios.post(`${API_URL}/events/search-posts`, {
      tag: pageState,
      page,
    });

    const formattedData = await FilterPaginationData({
      state: events,
      data: data.events,
      page: page,
      countRoute: "/events/search-posts-count",
      data_to_send: { tag: pageState },
    });

    setEvents(formattedData);
  } catch (error) {
    console.log(`Error fetching events by category: ${error}`);
  }
};

/* Zustand logic */
