"use client";

import Lottie from "lottie-react";
import animationData from "@/../../client/public/assets/walking_orange.json";
import React from "react";

interface Props {
  className?: string;
}

export const SimpleLoader: React.FC<Props> = ({ className }) => {
  return (
    <Lottie animationData={animationData} loop autoplay className={className} />
  );
};
