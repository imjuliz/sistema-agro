'use client';
import "./globals.css";

import { siteConfig } from "../config/site";
import { metadata, getMetadataFromPath } from './utils/metadata.js'
import { ThemeProvider } from "@/contexts/theme-provider";
import { TranslationProvider } from "@/hooks/useTranslation";

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <head>
                <title>{siteConfig.name}</title>
                <meta name="description" content={siteConfig.description} />
            </head>
            <body className="bg-background antialiased">
                <TranslationProvider>
                    <ThemeProvider>
                        <Transl>
                            {children}
                        </Transl>
                    </ThemeProvider>
                </TranslationProvider>
            </body>
        </html>
    );
}