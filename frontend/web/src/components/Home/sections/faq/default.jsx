"use client";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';

export default function FAQ(props) {
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

  const {
    title = "Perguntas frequentes",
    items = [
      {
        question: "O que é a RuralTech?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            A RuralTech é uma empresa de tecnologia para o agronegócio, especializada em soluções de rastreabilidade, gestão e inovação. Atuamos em toda a cadeia produtiva, conectando fazendas, lojas e matriz para garantir qualidade, segurança e eficiência.
          </Transl>
        ),
      },
      {
        question: "Qual é o objetivo da RuralTech?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[600px]">
            Nosso objetivo é fornecer tecnologia e processos que permitam aos produtores e varejistas do agronegócio centralizar informações, monitorar a produção e garantir rastreabilidade completa, desde a fazenda até o consumidor final.
          </Transl>
        ),
      },
      {
        question: "Quem se beneficia dos serviços da RuralTech?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[580px]">
            Produtores rurais, cooperativas, distribuidores e varejistas podem se beneficiar das soluções da RuralTech. Garantimos transparência, segurança e qualidade em todos os produtos que passam por nossas tecnologias.
          </Transl>
        ),
      },
      {
        question: "Como a RuralTech garante rastreabilidade e segurança?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[580px]">
            Cada lote de produção é registrado com informações detalhadas sobre
            sua origem, insumos utilizados e data de colheita ou produção. Esses
            dados são vinculados até a venda final, garantindo que a matriz e o
            consumidor tenham segurança e transparência sobre a qualidade dos
            produtos.
          </Transl>
        ),
      },
      {
        question:
          "Quais tipos de produção a RuralTech atende?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[580px]">
            Atuamos com diversas culturas agrícolas e criações, como verduras, legumes, laticínios e produtos pecuários. Nossas soluções se adaptam às particularidades de cada produção, garantindo eficiência e segurança.
          </Transl>
        ),
      },
      {
        question: "Como a RuralTech agrega valor aos negócios do agronegócio?",
        answer: (
          <Transl className="text-muted-foreground mb-4 max-w-[580px]">
            A RuralTech agrega valor ao integrar tecnologia, gestão e rastreabilidade, ajudando empresas a otimizar processos, aumentar a produtividade e garantir qualidade em toda a cadeia produtiva. Nossas soluções fortalecem a confiança de consumidores, parceiros e investidores.
          </Transl>
        ),
      },
    ],
    className,
  } = props;

  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <Transl className="text-center text-3xl font-semibold sm:text-5xl">{title}</Transl>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem key={index} value={item.value || `item-${index + 1}`}>
                <AccordionTrigger><Transl>{item.question}</Transl></AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
