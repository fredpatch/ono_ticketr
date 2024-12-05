import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { signin, signout, signup } from "../services/authService";

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

export const useEventStore = create<EventState>()(
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

interface AuthState {
  user: {
    username: string;
    fullname: string;
    role: string;
    profile_img: string;
    new_notification_available: boolean;
  } | null;
  loading: boolean;
  access_token: any | null;
  setAuth: (user: any, access_token: string) => void;
  setAccessToken: (access_token: any) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  access_token: null,
  loading: false,
  setAuth: (user, access_token) => set({ user, access_token }),
  setAccessToken: (access_token) => set({ access_token }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, access_token: null }),
}));

export const getAuthStore = () => useAuthStore.getState();
export default useAuthStore;
