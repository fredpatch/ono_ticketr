"use client";

import React from "react";
import AnimationWrapper from "./AnimationWrapper";
import { IconX } from "@tabler/icons-react";
import { useEditor } from "@/context/EditorContext";
import { toast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Toggle } from "../ui/toggle";
import Tag from "./Tag";

interface UpdateEventProps {
  event: string;
}

const UpdateEvent = ({ event: id }: UpdateEventProps) => {
  let characterLimit = 300;
  let tagLimit = 5;
  let titleLimit = 50;
  let locationLimit = 75;

  let {
    setEditorState,
    setEvent,
    event,
    event: {
      title,
      tags,
      isFree,
      price,
      description,
      location,
      startDate,
      banner,
    },
  } = useEditor();

  const formatDate = (date: Date) => format(date, "dd/MMM/yy 'at' HH:mm");

  console.log("EVENT", event);
  const handleCloseEvent = () => {
    // Takes the user back to the editor, and remove the already set banner image.
    setEditorState("editor");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      let target = e.target as HTMLInputElement;

      let tag = target.value.trim(); // trim to avoid spaces
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setEvent({ ...event, tags: [...tags, tag] });
        }
      } else {
        toast({
          title: "Tag limit reached",
          description: `You can only add up to ${tagLimit} tags`,
        });
      }
      target.value = "";
    }
  };

  const handleEventTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target;
    setEvent({ ...event, title: input.value });
  };

  const handleEventPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target;
    setEvent({ ...event, price: input.value });
  };

  const handleEventIsFreeChange = () => {
    setEvent({ ...event, isFree: !isFree, price: !isFree ? 0 : price });
  };

  const handleEventLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let input = e.target;
    setEvent({ ...event, location: input.value });
  };

  const handleEventDesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let input = e.target;
    setEvent({ ...event, description: input.value });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <AnimationWrapper keyValue="publishForm">
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <button
          onClick={handleCloseEvent}
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
        >
          <IconX />
        </button>

        <div className="max-w-[550px] center">
          <p className="text-gray-500">PREVIEW</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 mt-4">
            <img
              src={banner}
              width={200}
              height={200}
              className="w-full h-full object-cover"
              alt="banner"
            />
          </div>

          <div className="flex gap-4">
            <Badge color="green" className="text-md mt-2 p-1 px-4 bg-slate-700">
              {isFree ? "Free" : `${price} xaf`}
            </Badge>

            <p className="text-gray-900 mt-4">{location}</p>
            <p className="text-gray-500 mt-4">
              {startDate ? (
                <>
                  {/* {startDate?.toLocaleDateString()} at{" "}
                  {startDate?.toLocaleTimeString().slice(0, 5)} */}
                  {formatDate(startDate)}
                </>
              ) : (
                "Date and time of the event"
              )}
            </p>
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="line-clamp-2 font-gelasio text-gray-400 text-xl leading-7 mt-4">
            {description}
          </p>
        </div>

        <div className="border-gray-200 lg:border-1 lg:pl-8">
          {/* EVENT TITLE AND PRICE */}
          <div className="flex gap-4 justify-between">
            <div className="w-full">
              <p className="text-gray-500 mb-2">Event Title</p>
              <input
                maxLength={titleLimit}
                type="text"
                placeholder="Event Title ..."
                defaultValue={title}
                className="input-box"
                onChange={handleEventTitleChange}
              />
              <p className="mt-1 text-gray-300 text-right">
                {titleLimit - title.length} characters left
              </p>
            </div>

            <div className="w-full">
              <p className="text-gray-500 mb-2">Event Price</p>
              <input
                type="number"
                placeholder="Event price"
                defaultValue={price}
                className="input-box"
                onChange={handleEventPriceChange}
                disabled={isFree}
              />
              <p className=" text-gray-300 text-right mt-1">
                <Toggle
                  defaultChecked={isFree}
                  onClick={handleEventIsFreeChange}
                  className="bg-gray-700 border uppercase border-none shadow-xl"
                >
                  Free
                </Toggle>
              </p>
            </div>
          </div>

          <p className="text-gray-500 mb-2">Event Location</p>
          <input
            maxLength={locationLimit}
            type="text"
            placeholder="Event Location ..."
            defaultValue={location}
            className="input-box"
            onChange={handleEventLocationChange}
          />
          <p className="mt-1 text-gray-300 text-right">
            {locationLimit - location.length} characters left
          </p>

          {/* EVENT DESCRIPTION AND TOPICS */}
          <div className="flex gap-4 justify-between mt-2">
            <div className="w-full">
              <p className="text-gray-500 mb-2">
                Short description about your event
              </p>
              <textarea
                maxLength={characterLimit}
                defaultValue={description}
                className="h-40 resize-none leading-7 input-box pl-4"
                onChange={handleEventDesChange}
                onKeyDown={handleTitleKeyDown}
              ></textarea>
              <p className="mt-1 text-gray-300 text-right">
                {characterLimit - description.length} characters left
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-2">Tags</p>

              <div className="relative input-box pl-2 py-2 pb-4">
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Categories"
                  className="sticky text-dark-grey input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                />
                {tags.map((tag: any, index: any) => {
                  return <Tag tag={tag} key={index} tagIndex={index} />;
                })}
              </div>
              <p className="mt-1 mb-4 text-gray-300 text-right">
                {tagLimit - tags.length} tags left
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default UpdateEvent;
