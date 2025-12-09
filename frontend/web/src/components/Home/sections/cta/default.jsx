"use client";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Glow from "@/components/ui/glow";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';

export default function CTA(props) {
  const {
    title = "Transformando o Campo com Inovação",
    buttons = [
      {
        href: '/login',
        text: <Transl>"Veja nossas lojas"</Transl>,
        variant: "default",
      },
    ],
    className,
  } = props;
  const { lang, changeLang } = useTranslation();
  const languageOptions = [
    { value: 'pt-BR', label: 'Português (BR)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];
  const isPreferencesDirty = localTheme !== globalTheme || localSelectedFontSize !== globalSelectedFontSize || localLang !== lang;
  useEffect(() => {
    setLocalTheme(globalTheme);
    setLocalSelectedFontSize(globalSelectedFontSize);
    setLocalLang(lang);
  }, [globalTheme, globalSelectedFontSize, lang]);

  return (
    <Section className={cn("group relative overflow-hidden", className)}>
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <Transl className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </Transl>
        {buttons !== false && buttons.length > 0 && (
          <div className="flex justify-center gap-4">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant || "default"} size="lg" asChild>
                <a href={button.href}>
                  {button.icon}
                  {button.text}
                  {button.iconRight}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
