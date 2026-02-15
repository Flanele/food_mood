"use client";

import Lottie from "lottie-react";
import animationData from "../assets-json/404_error.json";
import React from "react";

interface Props {
  className?: string;
}

export const ErrorAnimation: React.FC<Props> = ({ className }) => {
  return (
    <Lottie animationData={animationData} loop autoplay className={className} />
  );
};
