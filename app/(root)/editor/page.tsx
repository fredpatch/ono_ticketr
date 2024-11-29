"use client";

import EventEditor from "@/components/shared/EventEditor";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import EditorProvider from "@/context/EditorContext";

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

const EditorEvent = () => {
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
        // console.log("event", event);
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
    <EditorProvider>
      <EventEditor />
    </EditorProvider>
  );
};

export default EditorEvent;
