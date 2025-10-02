"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function Screenshot({
  srcLight,
  srcDark,
  alt,
  width,
  height,
  className,
}) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (resolvedTheme) {
      setSrc(resolvedTheme === "light" ? srcLight : srcDark || srcLight);
    }
  }, [resolvedTheme, srcLight, srcDark]);

  if (!src) {
    return (
      <div
        style={{ width, height }}
        className={cn("bg-muted", className)}
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
