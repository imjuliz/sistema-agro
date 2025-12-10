"use client";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Footer, FooterBottom, FooterColumn, FooterContent } from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { useAppearance } from "@/contexts/AppearanceContext"; // Importar useAppearance
import { useEffect, useState } from "react";

export default function FooterSection(props) {
  const { lang, changeLang } = useTranslation();
    const languageOptions = [
        { value: 'pt-BR', label: 'Português (BR)' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' }
    ];

    const { theme: globalTheme, selectedFontSize: globalSelectedFontSize, applyPreferences } = useAppearance(); // Obter do contexto
        // Estados locais para edição temporária antes de salvar
        const [localTheme, setLocalTheme] = useState(globalTheme); 
        const [localSelectedFontSize, setLocalSelectedFontSize] = useState(globalSelectedFontSize); 
        const [localLang, setLocalLang] = useState(lang);

 const isPreferencesDirty = localTheme !== globalTheme || localSelectedFontSize !== globalSelectedFontSize || localLang !== lang;

 useEffect(() => {
        setLocalTheme(globalTheme);
        setLocalSelectedFontSize(globalSelectedFontSize);
        setLocalLang(lang);
    }, [globalTheme, globalSelectedFontSize, lang]);

  const {
    logo = <img src={'/img/ruraltech-logo.svg'} className="h-6"/>,
    name = "RuralTech",
    columns = [
      {
        title: "Outros conteúdos relevantes",
        links: [
          { text: <Transl>"Sobre Nós"</Transl>, href: '/sobreNos' },
          { text: "Blog", href: '/blog' },
        ],
      },
      {
        title: "Contatos",
        links: [
          { text: "Email", href: 'mailto:ruraltech052@gmail.com' },
          { text: <Transl>"Telefone"</Transl>, href: siteConfig.url },
          { text: "Instagram", href: 'https://www.instagram.com/' },
        ],
      },
    ],
    copyright = <Transl>"© 2025 RuralTech. Todos os direitos reservados"</Transl>,
    policies = [
      { text: <Transl>"Política de Privacidade"</Transl>, href: '/politicaPrivacidade' },
      { text: <Transl>"Termos de Uso"</Transl>, href: '/termosDeUso' },
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
                <Transl className="text-xl font-bold">{name}</Transl>
              </div>
            </FooterColumn>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <Transl className="text-md pt-1 font-semibold">{column.title}</Transl>
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
