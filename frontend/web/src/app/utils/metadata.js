import { siteConfig } from "../../config/site";

// Função para retornar título e descrição baseado na rota
export function getMetadataFromPath(path) {
  switch (path) {
    case "admin/dashboard":
      return { title: "Zelos - Dashboard", description: "Painel do administrador" };
    case "admin/chamados":
      return { title: "Zelos - Chamados", description: "Painel do administrador" };
    case "admin/perfil":
      return { title: "Zelos - Meu Perfil", description: "Painel do administrador" };
    case "admin/setores":
      return { title: "Zelos - Setores", description: "Painel do administrador" };
    case "usuario/chamados":
      return { title: "Zelos - Meus Chamados", description: "Área do usuário" };
    case "usuario/perfil":
      return { title: "Zelos - Meu Perfil", description: "Área do usuário" };
    case "tecnico/chamados":
      return { title: "Zelos - Chamados Técnicos", description: "Painel técnico" };
    case "tecnico/perfil":
      return { title: "Zelos - Meu Perfil", description: "Painel técnico" };
    default:
      return { title: "Zelos", description: "Sistema de chamados" };
  }
}

// Metadata genérica do site (para uso manual em <Head>)
export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: siteConfig.getStartedUrl,
  description: siteConfig.description,
  keywords: [
    "Landing page template",
    "Components",
    "Shadcn",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Radix UI",
  ],
  authors: [
    { name: "Mikolaj Dobrucki", url: "https://mikolajdobrucki.com" },
  ],
  creator: "mikolajdobrucki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.getStartedUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mikolajdobrucki",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};
