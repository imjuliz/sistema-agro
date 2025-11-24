// src/app/providers.jsx
"use client";

import React from "react";
import { ThemeProvider } from "@/contexts/theme-provider";
import { TranslationProvider } from "@/hooks/useTranslation";
import { AuthProvider } from "@/contexts/AuthContext";
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";

export function ClientProviders({ children }) {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <AuthProvider>
          <Transl>{children}</Transl>
        </AuthProvider>
      </ThemeProvider>
    </TranslationProvider>
  );
}
