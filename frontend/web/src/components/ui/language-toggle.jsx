"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
const { lang, changeLang } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 px-2 py-0 text-xs">
          {/* <span className="capitalize">{theme}</span> */}
          <span className="inline">Idioma</span>
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("pt-BR")}>
        Português (BR)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("en")}>
        English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("es")}>
        Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("fr")}>
        Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
