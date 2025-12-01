// src/app/providers.jsx
"use client";

import React from "react";
import { ThemeProvider } from "@/contexts/theme-provider";
import { TranslationProvider } from "@/hooks/useTranslation";
import { AuthProvider } from "@/contexts/AuthContext";
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";
import { AppearanceProvider } from "@/contexts/AppearanceContext";
import { Toaster } from 'sonner';


export function ClientProviders({ children }) {
  return (
    <TranslationProvider> 
      <AppearanceProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
      </AppearanceProvider>
    </TranslationProvider>
  );
}
