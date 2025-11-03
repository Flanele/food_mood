import * as React from "react";
import { preventDrag, extractFileFromDragEvent, isMimeAccepted } from "../lib/dnd";

type Params = {
  onFile?: (f: File) => void;
  acceptPrefix?: string; // например "image/"
};

export const useFileDrop = ({ onFile, acceptPrefix }: Params) => {
  const handleDrag = React.useCallback((e: React.DragEvent) => {
    preventDrag(e);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    preventDrag(e);
    const f = extractFileFromDragEvent(e);
    if (f && isMimeAccepted(f, acceptPrefix)) onFile?.(f);
  }, [acceptPrefix, onFile]);

  return {
    onDragEnter: handleDrag,
    onDragOver: handleDrag,
    onDragLeave: handleDrag,
    onDrop: handleDrop,
  };
};
