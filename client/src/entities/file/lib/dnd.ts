export const preventDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  
  export const extractFileFromDragEvent = (e: React.DragEvent): File | null => {
    const dt = e.dataTransfer;
    if (!dt) return null;
  
    if (dt.files?.length) return dt.files[0];
  
    if (dt.items?.length) {
      for (const it of Array.from(dt.items)) {
        if (it.kind === "file") {
          const f = it.getAsFile();
          if (f) return f;
        }
      }
    }
    return null;
  };
  
  export const isMimeAccepted = (file: File, prefix?: string) =>
    !prefix || file.type.startsWith(prefix);
  