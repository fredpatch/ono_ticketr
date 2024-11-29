"use client";

import { logo } from "@/public/imgs";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import AnimationWrapper from "./AnimationWrapper";
import { FileUploader } from "./FileUploader";
import EditorJS from "@editorjs/editorjs";
import tools from "@/components/shared/Tools";
import { useToast } from "@/hooks/use-toast";
import { removeFromLocal, StoreInLocal } from "@/common/localeStore";
import { useAuth } from "@/context/AuthContext";
import { publish_event } from "@/services/dataServices";
import { useParams, useRouter } from "next/navigation";
import NotFound from "@/app/not-found";
import { useEditor } from "@/context/EditorContext";

const EventEditor = () => {
  // const context = useContext(EditorContext);
  // // console.log("@@@ context", context);
  // if (!context) {
  //   throw new Error("EventEditor must be used within an EditorProvider");
  // }

  let { event, setEvent, setEditorState, setTextEditor } = useEditor();

  let {
    title,
    banner,
    content,
    description,
    location,
    tags,
    price,
    isFree,
    url,
    category,
    author,
  } = event;

  const { toast } = useToast();
  const { userAuth } = useAuth();
  const router = useRouter();
  const access_token = userAuth?.access_token;
  const isAdmin = userAuth?.isAdmin;
  const { event_id } = useParams();
  const [files, setFiles] = useState<File[]>([]);

  // Type the ref to accept an EditorJS instance or null
  const textEditorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!textEditorRef.current) {
      const editor = new EditorJS({
        holder: "textEditor",
        data: Array.isArray(content) ? content[0] : [],
        tools: tools,
        placeholder: "Start your description here...",
        onReady: () => {
          setTextEditor({
            isReady: true,
          });
        },
      });
      textEditorRef.current = editor;
    }
  }, [event.content, setTextEditor]);

  //TODO!: Prevent enter key
  const handleTitleKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let title = e.target;
    title.style.height = "auto";
    title.style.height = `${title.scrollHeight}px`;

    setEvent({ ...event, title: title.value });
  };

  //TODO: Handle banner upload
  const handleFileChange = (url: any, file?: File) => {
    setFiles((prevFiles) => [...prevFiles, file!]);
    setEvent({ ...event, banner: url });

    // console.log("@@@ BANNER url", banner);
    try {
      toast({
        description: "Banner loaded successfully !",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Failed to load the banner !",
        description: `An error occurred while uploading your banner: ${error}.`,
        variant: "destructive",
      });
    }
  };

  // TODO: Add publish logic
  const handlePublish = async () => {
    if (!banner.length) {
      return toast({
        description: "Please upload a banner before publishing the event.",
        variant: "destructive",
      });
    }
    if (!title.length) {
      return toast({
        description: "Please enter a title before publishing the event.",
        variant: "destructive",
      });
    }

    if (textEditorRef.current) {
      textEditorRef.current
        .save()
        .then((data: any) => {
          if (data.blocks.length) {
            setEvent({ ...event, content: data });
            setEditorState("publish");
          } else {
            return toast({
              description:
                "Please enter some content before publishing the event.",
              variant: "destructive",
            });
          }
        })
        .catch((err: any) => {
          console.log("@@@ ERROR SAVING TEXT EDITOR DATA ==>", err);
          return toast({
            title: "Error saving content !",
            description: "Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  const handleSaveDraftEvent = async (e: any) => {
    e.preventDefault();

    // TODO: Add publish logic
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast({
        description: "Please enter a title before saving draft.",
      });
    }

    // Show initial toast indicating upload process
    toast({
      title: "Saving draft!",
      description: "Please wait...",
      duration: 5000, // Adjust duration as needed
    });

    e.target.classList.add("disable");

    let eventObj = {
      title,
      banner,
      tags,
      description,
      location,
      content,
      price,
      isFree,
      url,
      category,
      author,
      startDateTime: "",
      endDateTime: "",
      draft: true,
    };

    event = eventObj;
    try {
      await publish_event(eventObj, access_token, event_id);

      e.target.classList.remove("disable");
      // Update toast on success
      toast({
        title: "Draft Saved!",
        description: "Your draft has been successfully saved.",
        duration: 3000,
      });

      removeFromLocal("fileKey");

      setTimeout(() => {
        router.push("/dashboard/events?tab=draft");
        // router.push("/dashboard/events");
      }, 500);
    } catch (error) {
      toast({
        title: "Error!",
        description: "An error occurred while saving your draft.",
        variant: "destructive",
        duration: 3000,
      });
      e.target.classList.remove("disable");
      console.log(error);
    }
  };

  return (
    <>
      {isAdmin && (
        <>
          <nav className="navbar">
            <Link href={"/"} className="flex-none w-15">
              <Image src={logo} className="w-12" alt="logo" />
            </Link>
            <p className="max-md::hidden text-black line-clamp-1 w-full">
              {title.length ? title : "New Event"}
            </p>

            <div className="flex gap-4 ml-auto">
              <button className="btn-dark py-2" onClick={handlePublish}>
                Publish
              </button>
              <button className="btn-light py-2" onClick={handleSaveDraftEvent}>
                Save Draft
              </button>
            </div>
          </nav>

          <AnimationWrapper keyValue="text">
            <section>
              <div className="mx-auto max-w-[900px] w-full">
                {/* TODO: Add banner upload */}
                <div className="relative aspect-video hover:opacity-80 bg-white border-4 rounded-xl border-gray-200">
                  <label htmlFor="uploadBanner">
                    {/* <Image src={event.banner} className="z-20" alt="event_banner" /> */}
                    <FileUploader
                      endPoint="imageUploader"
                      onFieldChange={handleFileChange}
                      imageUrl={event.banner}
                      setFiles={setFiles}
                    />
                  </label>
                </div>

                <textarea
                  placeholder="Enter Event Title"
                  onKeyDown={handleTitleKeyDown}
                  onChange={handleTitleChange}
                  className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
                ></textarea>

                <hr className="w-full opacity-10 my-5 text-gray-500" />

                <div id="textEditor" className="font-gelasio" />
              </div>
            </section>
          </AnimationWrapper>
        </>
      )}

      {!isAdmin && <NotFound />}
    </>
  );
};

export default EventEditor;
