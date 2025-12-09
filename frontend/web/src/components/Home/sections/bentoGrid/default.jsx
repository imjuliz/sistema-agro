"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { Section } from "@/components/ui/section";
import { SectionHeader } from "./section-header";
// import { motion } from "motion/react";
import { FirstBentoAnimation } from "./first-bento-animation";
import { FourthBentoAnimation } from "./fourth-bento-animation";
import { SecondBentoAnimation } from "./second-bento-animation";
import { ThirdBentoAnimation } from "./third-bento-animation";

export function BentoSection() {
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

  const items = [
    {
      id: 1,
      content: <FirstBentoAnimation />,
      title: "Atendimento ao Cliente",
      description: "Na RuralTech, nosso foco é oferecer suporte rápido, personalizado e eficiente, garantindo que cada cliente tenha a melhor experiência possível.",
    },
    {
      id: 2,
      content: <SecondBentoAnimation />,
      title: "Rastreabilidade e Segurança",
      description: "Cada produto é rastreado desde a fazenda até a prateleira, utilizando tecnologia avançada para assegurar qualidade, transparência e confiança aos clientes.",
    },
    {
      id: 3,
      content: (
        <ThirdBentoAnimation data={[1200, 1800, 1500, 2200, 2800, 3100, 3500]} toolTipValues={[1200, 1800, 1500, 2200, 2800, 3100, 3500, 4000, 4500, 5000]} />
      ),
      title: "Crescimento RuralTech",
      description: "A RuralTech impulsiona o agronegócio com soluções inovadoras, aumentando a eficiência e promovendo resultados consistentes em toda a cadeia produtiva.",
    },
    {
      id: 4,
      content: <FourthBentoAnimation once={false} />,
      title: "Planejamento e Excelência",
      description: "Nossa equipe planeja e executa estratégias que garantem qualidade, segurança e inovação, consolidando a RuralTech como referência no setor agroindustrial.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl rounded-3xl">
      <Section id="bento">
        <div className="relative">
          <SectionHeader>
            <Transl className="text-3xl font-semibold sm:text-5xl tracking-tighter text-center text-balance pb-1">
              Transformando o Agronegócio com Inovação
            </Transl>
            <Transl className="text-muted-foreground text-center text-balance font-medium">
              Uma empresa comprometida em transformar o agronegócio com tecnologia, inovação e soluções inteligentes.
            </Transl>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-default max-h-[400px] group" >
                <div className="relative flex size-full items-center justify-center h-full overflow-hidden">{item.content}</div>
                <div className="flex-1 flex-col gap-2 p-6">
                  <Transl className="text-lg tracking-tighter font-semibold">{item.title}</Transl>
                  <Transl className="text-muted-foreground">{item.description}</Transl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>

  );
}
