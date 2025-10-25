import Image from "next/image";
import React from "react";

interface Props {
  width: number;
  height: number;
  className?: string;
}

export const Logo: React.FC<Props> = ({ width, height, className }) => {
  return (
    <Image
      src="/assets/logo.png"
      width={width}
      height={height}
      alt="logo"
      className={className}
    />
  );
};
