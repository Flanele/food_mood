"use client";
import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useFileDrop } from "../model/use-file-drop";

type Props = {
  className?: string;
  onPick?: () => void;
  onFile?: (f: File) => void;
  acceptMimeStartsWith?: string;
};

export const FileDropzone: React.FC<Props> = ({
  className,
  onPick,
  onFile,
  acceptMimeStartsWith = "image/",
}) => {
  const dnd = useFileDrop({ onFile, acceptPrefix: acceptMimeStartsWith });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onPick?.();
      }}
      {...dnd}
      className={cn(
        "group relative flex h-32 items-center justify-center rounded-md border-border! border-2 border-dashed transition-colors cursor-pointer select-none",
        "border-secondary bg-muted/40 hover:border-primary! hover:bg-primary/10",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none flex flex-col items-center gap-2 text-sm transition-colors",
          "text-foreground/70 group-hover:text-primary"
        )}
      >
        <Upload className="h-5 w-5 opacity-70 group-hover:text-primary transition-colors" />
        <span>Drag & drop a file here</span>
        <span className="text-foreground/60 group-hover:text-primary/80">
          or click to select
        </span>
      </div>
    </div>
  );
};
