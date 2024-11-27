"use client";

import UpdateEvent from "@/components/shared/UpdateEvent";
import EditorContext from "@/context/EditorContext";
import { useParams } from "next/navigation";
import React from "react";

const UpdateEventPage = () => {
  let { event_id } = useParams<{ event_id: string }>();
  return (
    <EditorContext>
      <UpdateEvent event={event_id}  />
    </EditorContext>
  );
};

export default UpdateEventPage;
