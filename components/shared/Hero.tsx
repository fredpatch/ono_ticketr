"use client";

import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import { motion } from "framer-motion";
import { event1 } from "@/public/assets";

const images = [
  "assets/event1.jpg",
  "assets/event2.jpg",
  "assets/event3.jpg",
  "assets/event4.jpg",
  "assets/event5.jpg",
  "assets/event6.jpg",
];

const Hero = () => {
  return (
    <ImagesSlider images={images} className="flex-center mb-2">
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          ONO <br /> On Nack Ou ? <br /> The place you can't miss <br /> for
          your events
        </motion.p>
      </motion.div>
    </ImagesSlider>
  );
};

export default Hero;
