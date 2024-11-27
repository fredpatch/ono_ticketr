"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BlockInTextCardProps {
  examples: any;
}

export const BlockInTextCard = ({ examples }: BlockInTextCardProps) => {
  return (
    <div className="w-full flex justify-center items-center border border-transparent">
      <Typewriter examples={examples} />
    </div>
  );
};

interface TypewriterProps {
  examples: any;
}

const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;

const SWAP_DELAY_IN_MS = 5500;

export const Typewriter = ({ examples }: TypewriterProps) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => (pv + 1) % examples.length);
    }, SWAP_DELAY_IN_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="mb-2.5 font-semibold uppercase">
      {/* <span className="inline-block size-2 bg-neutral-950" /> */}
      <span className="ml-3">
        {examples[exampleIndex].split("").map((l: any, i: any) => {
          return (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                delay: FADE_DELAY,
                duration: MAIN_FADE_DURATION,
                ease: "easeInOut",
              }}
              className="relative"
              key={`${exampleIndex}-${i}`}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * LETTER_DELAY,
                  duration: 0,
                }}
                className="text-4xl text-neutral-600"
              >
                {l}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  delay: i * LETTER_DELAY,
                  times: [0, 0.1, 1],
                  duration: BOX_FADE_DURATION,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-neutral-950"
              />
            </motion.span>
          );
        })}
      </span>
    </p>
  );
};
