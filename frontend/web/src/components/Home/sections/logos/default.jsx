"use client";
import Plataforma from "@/components/Home/logos/plataforma";
import Acesso from "@/components/Home/logos/acesso";
import Seguranca from "@/components/Home/logos/seguranca";
import Iot from "@/components/Home/logos/iot";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { useEffect, useState } from "react";
import { useAppearance } from "@/contexts/AppearanceContext"; // Importar useAppearance

export default function Logos({
  title = "Por que escolher a RuralTech?",
  badge = (<Badge variant="outline" className="border-brand/30 text-brand">Compromisso RuralTech com qualidade e inovação    </Badge>),
  logos = [
    <Logo key="plataforma" image={Plataforma} name="Produção própria de qualidade" />,
    <Logo key="acesso" image={Acesso} name="Atendimento em todas as nossas lojas" />,
    <Logo key="iot" image={Iot} name="Controle e rastreabilidade avançada" badge="Novo"/>,
    <Logo key="seguranca" image={Seguranca} name="Transparência e confiança em toda a cadeia"/>,
  ],
  className,
}) {
  const { lang, changeLang } = useTranslation();
    const languageOptions = [
        { value: 'pt-BR', label: 'Português (BR)' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' }
    ];

    const { theme: globalTheme, selectedFontSize: globalSelectedFontSize } = useAppearance(); // Obter do contexto
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

  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <Transl className="text-md font-semibold sm:text-2xl">{title}</Transl>
        </div>
        {logos !== false && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">{logos}</div>
        )}
      </div>
    </Section>
  );
}
