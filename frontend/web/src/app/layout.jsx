'use client';
import "./globals.css";

import { siteConfig } from "../config/site";
import { metadata, getMetadataFromPath } from './utils/metadata.js'
import { ThemeProvider } from "@/contexts/theme-provider";
// export const metadata = {
//     title: {
//       default: siteConfig.name,
//       template: `%s - ${siteConfig.name}`,
//     },
//     metadataBase: new URL(siteConfig.getStartedUrl),
//     description: siteConfig.description,
//     keywords: [
//       "Landing page template",
//       "Components",
//       "Shadcn",
//       "Next.js",
//       "React",
//       "Tailwind CSS",
//       "Radix UI",
//     ],
//     authors: [
//       {
//         name: "Mikolaj Dobrucki",
//         url: "https://mikolajdobrucki.com",
//       },
//     ],
//     creator: "mikolajdobrucki",
//     openGraph: {
//       type: "website",
//       locale: "en_US",
//       url: siteConfig.getStartedUrl,
//       title: siteConfig.name,
//       description: siteConfig.description,
//       siteName: siteConfig.name,
//       images: [
//         {
//           url: siteConfig.ogImage,
//           width: 1200,
//           height: 630,
//           alt: siteConfig.name,
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: siteConfig.name,
//       description: siteConfig.description,
//       images: [siteConfig.ogImage],
//       creator: "@mikolajdobrucki",
//     },
//     icons: {
//       icon: "/favicon.svg",
//       apple: "/apple-touch-icon.png",
//     },
//   };

// export default function RootLayout({ children }) {

//     return (
//         <html lang="pt-br" style={{ colorScheme: "dark" }} className="dark">
//             {/* <body className={`${inter.className} bg-background antialiased`}> */}
//             <body className={` bg-background antialiased`}>
//             <ThemeProvider>
//                 {children}
//                 </ThemeProvider>
//             </body>
//         </html>
//     );
// }
export default function RootLayout({ children }) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <head>
                <title>{siteConfig.name}</title>
                <meta name="description" content={siteConfig.description} />
            </head>
            <body className="bg-background antialiased">
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}