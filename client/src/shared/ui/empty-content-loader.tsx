"use client";

import Lottie from "lottie-react";
import animationData from "@/../../client/public/assets/fruit_plate.json";
import React from "react";

interface Props {
  className?: string;
}

export const EmptyContentLoader: React.FC<Props> = ({ className }) => {
  return (
    <Lottie animationData={animationData} loop autoplay className={className} />
  );
};
