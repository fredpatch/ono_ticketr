import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Events {
  results: EventItem[];
  page: number;
  totalDocs?: number;
}

interface EventItem {
  event_id: string;
  title: string;
  banner: string;
  description: string;
}

interface EventState {
  events: any;
  trendingEvents: any;
  drafts: any;
  similarEvents: any;
  currentEvent: any;
  loading: boolean;
  setEvents: (events: any) => void;
  setTrendingEvents: (events: any) => void;
  setDrafts: (drafts: any) => void;
  setCurrentEvent: (event: any) => void;
  setSimilarEvents: (events: any) => void;
  setLoading: (loading: boolean) => void;
}

const useEventStore = create<EventState>()(
  devtools((set) => ({
    events: null,
    trendingEvents: null,
    drafts: null,
    similarEvents: null,
    currentEvent: null,
    loading: false,
    setEvents: (events) => set({ events }),
    setTrendingEvents: (events) => set({ trendingEvents: events }),
    setDrafts: (drafts) => set({ drafts }),
    setCurrentEvent: (event) => set({ currentEvent: event }),
    setSimilarEvents: (events) => set({ similarEvents: events }),
    setLoading: (loading) => set({ loading }),
  }))
);

export default useEventStore;
