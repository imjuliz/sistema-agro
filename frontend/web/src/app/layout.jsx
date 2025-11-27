import "./globals.css";
import { siteConfig } from "../config/site";
import { ClientProviders } from "./providers";

export default function RootLayout({ children }) {
  // console.log("🔥 RootLayout MONTADO (server)");

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
