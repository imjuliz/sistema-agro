// import "./globals.css";

// import { siteConfig } from "../config/site";
// import { metadata, getMetadataFromPath } from './utils/metadata.js'
// import { ThemeProvider } from "@/contexts/theme-provider";
// import { TranslationProvider } from "@/hooks/useTranslation";
// import { AuthProvider } from "@/contexts/AuthContext"; // Importação adicionada

// // para tradução
// import { useTranslation } from "@/hooks/useTranslation";
// import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

// export default function RootLayout({ children }) {
//     console.log("🔥 RootLayout MONTADO")

//     return (
        
//         <html lang="pt-br" suppressHydrationWarning>
//             <head>
//                 <link rel="icon" href={siteConfig.ogImage} />
//                 <title>{siteConfig.name}</title>
//                 <meta name="description" content={siteConfig.description} />
//             </head>
//             <body className="bg-background antialiased">
//                     <TranslationProvider>
//                         <ThemeProvider>
//                             <AuthProvider> {/* AuthProvider adicionado aqui */}
//                                 <Transl>
                                    
//                                     {children}
//                                 </Transl>
//                             </AuthProvider> {/* Fechamento do AuthProvider */}
//                         </ThemeProvider>
//                     </TranslationProvider>
//             </body>
//         </html>
//     );
// }
// src/app/layout.jsx
import "./globals.css";
import { siteConfig } from "../config/site";
import { ClientProviders } from "./providers";

export default function RootLayout({ children }) {
  // console.log pode ficar aqui (fora do JSX) para debug
  console.log("🔥 RootLayout MONTADO (server)");

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="icon" href={siteConfig.ogImage} />
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
      </head>

      <body className="bg-background antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
