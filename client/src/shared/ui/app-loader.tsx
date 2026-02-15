"use client";

import Lottie from "lottie-react";
import animationData from "../assets-json/bouncing_fruits.json";

export const AppLoader = () => {
  return (
    <div className="flex flex-col g-5 h-screen w-screen items-center justify-center bg-background">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-80 h-80"
      />

      <p className="font-quantico text-[20px]">Please wait a bit...</p>
    </div>
  );
};
