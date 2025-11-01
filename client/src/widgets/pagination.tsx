import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  const pages = getPages();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-4"
      >
        ‹
      </Button>

      {pages[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "secondary"}
            onClick={() => onPageChange(1)}
            className="p-4"
          >
            1
          </Button>
          {pages[0] > 2 && <span className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={currentPage === p ? "default" : "secondary"}
          onClick={() => onPageChange(p)}
          className="p-4"
        >
          {p}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1">…</span>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "secondary"}
            onClick={() => onPageChange(totalPages)}
            className="p-4"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-4"
      >
        ›
      </Button>
    </div>
  );
};
