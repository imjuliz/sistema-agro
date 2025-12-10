import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";

export default function FAQ(props) {
  const {
    title = "Perguntas frequentes",
    items = [
     {
        question: "O que é o sistema RuralTech?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            O RuralTech é um sistema de gestão e rastreabilidade que integra as
            operações de fazendas, lojas e matriz em uma única plataforma. Ele
            garante o controle da produção, das vendas e da qualidade dos
            produtos, oferecendo total transparência em toda a cadeia produtiva.
          </p>
        ),
      },
      {
        question: "Como garantir a qualidade dos produtos?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            Todos os lotes são rastreados desde a origem, com inspeções e controles em cada etapa da cadeia.
          </p>
        ),
      },
      {
        question: "Vocês vendem para varejo e atacado?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Sim. Atendemos lojas próprias, parceiros e clientes finais com as mesmas políticas de qualidade.
          </p>
        ),
      },
      {
        question: "Como falar com o time comercial?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Cada lote de produção é registrado com informações detalhadas sobre
            sua origem, insumos utilizados e data de colheita ou produção. Esses
            dados são vinculados até a venda final, garantindo que a matriz e o
            consumidor tenham segurança e transparência sobre a qualidade dos
            produtos.
          </p>
        ),
      },
      {
        question:
          "O sistema se adapta a diferentes culturas agrícolas e criações?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Sim. O sistema permite registrar atividades de agricultura e
            pecuária, com flexibilidade para diferentes tipos de culturas e
            rebanhos, respeitando as particularidades de cada produção.
          </p>
        ),
      },
      {
        question: "É possível acompanhar as finanças da empresa pelo sistema?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Sim. O RuralTech centraliza as informações financeiras de cada loja e
            unidade de produção, gerando relatórios de despesas, receitas e
            lucratividade. A matriz pode acompanhar os números consolidados em
            tempo real, apoiando decisões estratégicas.
          </p>
        ),
      },
      // {
      //   question: "É possível acompanhar as finanças da empresa pelo sistema?",
      //   answer: (
      //     <p className="text-muted-foreground mb-4 max-w-[580px]">
      //       Actually, yes! I'm always actively looking for beta testers of new features. If you are interested in exchanging feedback for a discount, please contact me via{" "}
      //       <a href={siteConfig.links.email} className="underline underline-offset-2">
      //         email
      //       </a>
      //       .
      //     </p>
      //   ),
      // },
    ],
    className,
  } = props;

  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">{title}</h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem key={index} value={item.value || `item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}