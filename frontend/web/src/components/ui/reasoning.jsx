"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Markdown } from "./markdown";
import { useTextStream, Mode } from "./response-stream";


const ReasoningContext = createContext(
  undefined
);

function useReasoningContext() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error(
      "useReasoningContext must be used within a Reasoning provider"
    );
  }
  return context;
}

function Reasoning({
  children,
  className,
  open,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <ReasoningContext.Provider
      value={{
        isOpen,
        onOpenChange: handleOpenChange,
      }}
    >
      <div className={className}>{children}</div>
    </ReasoningContext.Provider>
  );
}

function ReasoningTrigger({
  children,
  className,
  ...props
}) {
  const { isOpen, onOpenChange } = useReasoningContext();

  return (
    <button
      className={cn("flex cursor-pointer items-center gap-2", className)}
      onClick={() => onOpenChange(!isOpen)}
      {...props}
    >
      <span className="text-primary">{children}</span>
      <div
        className={cn(
          "transform transition-transform",
          isOpen ? "rotate-180" : ""
        )}
      >
        <ChevronDownIcon className="size-4" />
      </div>
    </button>
  );
}

function ReasoningContent({
  children,
  className,
  ...props
}) {
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const { isOpen } = useReasoningContext();

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (contentRef.current && innerRef.current && isOpen) {
        contentRef.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
      }
    });

    observer.observe(innerRef.current);

    if (isOpen) {
      contentRef.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
    }

    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden transition-[max-height] duration-300 ease-out",
        className
      )}
      style={{
        maxHeight: isOpen ? contentRef.current?.scrollHeight : "0px",
      }}
      {...props}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

function ReasoningResponse({
  text,
  className,
  speed = 20,
  mode = "typewriter",
  onComplete,
  fadeDuration,
  segmentDelay,
  characterChunkSize,
}) {
  const { isOpen } = useReasoningContext();
  const { displayedText } = useTextStream({
    textStream: text,
    speed,
    mode,
    onComplete,
    fadeDuration,
    segmentDelay,
    characterChunkSize,
  });

  return (
    <div
      className={cn(
        "text-muted-foreground prose prose-sm dark:prose-invert text-sm transition-opacity duration-300 ease-out",
        className
      )}
      style={{
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Markdown>{displayedText}</Markdown>
    </div>
  );
}

export { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse };