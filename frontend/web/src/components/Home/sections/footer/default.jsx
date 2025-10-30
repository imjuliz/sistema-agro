import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import LaunchUI from "@/components/Home/logos/launch-ui";
import { Footer, FooterBottom, FooterColumn, FooterContent } from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function FooterSection(props) {
  const {
    logo = <LaunchUI />,
    name = "RuralTech",
    columns = [
      {
        title: "Outros conteúdos relevantes",
        links: [
          { text: "Sobre Nós", href: '/sobreNos' },
          { text: "Blog", href: '/blog' },
        ],
      },
      {
        title: "Contatos",
        links: [
          { text: "Email", href: 'mailto:ruraltech91@gmail.com' },
          { text: "Telefone", href: siteConfig.url },
          { text: "Instagram", href: 'https://www.instagram.com/' },
        ],
      },
    ],
    copyright = "© 2025 RuralTech. Todos os direitos reservados",
    policies = [
      { text: "Politica de Privacidade", href: '/politicaPrivacidade' },
      { text: "Termos de Uso", href: '/termosDeUso' },
    ],
    showModeToggle = true,
    className,
  } = props;

  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
            </FooterColumn>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href} className="text-muted-foreground text-sm">
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy, index) => (
                <a key={index} href={policy.href}>
                  {policy.text}
                </a>
              ))}
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
