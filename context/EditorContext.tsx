"use client";

import UpdateEventPage from "@/app/(root)/editor/[event_id]/page";
import EventEditor from "@/components/shared/EventEditor";
import Loader from "@/components/shared/Loader";
import PublishForm from "@/components/shared/PublishForm";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

const eventStructure = {
  title: "",
  banner: "",
  description: "", // Short description with a max length, similar to `des`
  content: [], // Content sections, an array for flexibility
  tags: [],
  author: "",
  location: "", // String for location details
  startDateTime: new Date().toISOString(), // Default to current date
  endDateTime: new Date().toISOString(), // Default to current date
  price: 0,
  isFree: false, // Boolean flag for free events
  url: "", // External URL related to the event
  category: "", // String or ID for category
  draft: false, // Boolean for draft or published status
};

// Define an interface for the context value
interface EditorContextType {
  event: any; // Replace with your event structure type
  setEvent: any;
  editorState: string;
  setEditorState: any;
  textEditor: any;
  setTextEditor: any;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const EditorProvider = () => {
  const { userAuth } = useAuth();
  const access_token = userAuth?.access_token;
  const isAdmin = userAuth?.isAdmin;

  // state variables
  const [event, setEvent] = React.useState<any>(eventStructure);
  const [textEditor, setTextEditor] = React.useState({ isReady: false });
  const [loading, setLoading] = React.useState(true);
  const [editorState, setEditorState] = React.useState("editor");
  const router = useRouter();
  const { event_id } = useParams();

  useEffect(() => {
    if (!event_id) {
      return setLoading(false);
    }

    axios
      .post(ServerDomain + "/events/get-event", {
        event_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { event } }) => {
        // console.log("event to edit", event);
        setEvent(event);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching event by id", err);
        setLoading(false);
        setEvent(null);
      });
    resetStates();
  }, []);

  const resetStates = () => {
    setEvent(eventStructure);
    setEditorState("editor");
    setTextEditor({ isReady: false });
  };

  return (
    <EditorContext.Provider
      value={{
        event,
        setEvent,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      <>
        {!isAdmin ? (
          router.push("/404")
        ) : access_token === null ? (
          router.push("/signin")
        ) : loading ? (
          <Loader />
        ) : editorState === "editor" ? (
          <EventEditor />
        ) : editorState === "edit" ? (
          <UpdateEventPage />
        ) : (
          <PublishForm />
        )}
      </>
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider !!");
  }
  return context;
};

export default EditorProvider;
