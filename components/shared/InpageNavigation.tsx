"use client";

import React, { useEffect, useRef, useState } from "react";

interface TabsProps {
  children: React.ReactNode;
  defaultActiveIndex?: number;
  defaultHidden?: string[];
  routes?: any[];
}

export let activeTabLineRef: React.RefObject<HTMLHRElement>;
export let activeTabRef: React.RefObject<HTMLButtonElement>;
export let sideBarIconTab: React.RefObject<HTMLButtonElement>;
export let pageStateTab: React.RefObject<HTMLButtonElement>;

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}: TabsProps) => {
  // set inPageNavIndex
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
  activeTabLineRef = useRef<HTMLHRElement>(null);
  activeTabRef = useRef<HTMLButtonElement>(null);

  let [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  let [width, setWidth] = useState(0); // Initial width set to 0

  const changePageState = (btn: any, i: number) => {
    let { offsetWidth, offsetLeft } = btn;

    setInPageNavIndex(i);
    if (activeTabLineRef.current) {
      activeTabLineRef.current.style.width = `${offsetWidth}px`;
      activeTabLineRef.current.style.left = `${offsetLeft}px`;
    }
  };

  useEffect(() => {
    // Ensure window access only happens on the client
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      if (width > 766 && inPageNavIndex !== defaultActiveIndex) {
        changePageState(activeTabRef.current, defaultActiveIndex);
      }

      if (!isResizeEventAdded) {
        window.addEventListener("resize", () => {
          if (!isResizeEventAdded) {
            setIsResizeEventAdded(true);
          }
          setWidth(window.innerWidth);
        });
      }
    }
  }, [width]);
  return (
    <>
      <div className="relative bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes?.map((route, i) => {
          return (
            <button
              ref={i == defaultActiveIndex ? activeTabRef : null}
              key={i}
              onClick={(e) => {
                changePageState(e.target, i);
              }}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex === i ? "text-black" : "text-zinc-400 ") +
                (defaultHidden.includes(route) ? " md:hidden" : "")
              }
            >
              {route}
            </button>
          );
        })}

        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 duration-300 border border-zinc-500"
        />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
