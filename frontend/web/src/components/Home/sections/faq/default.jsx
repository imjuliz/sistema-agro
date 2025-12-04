import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";

export default function FAQ(props) {
  const {
    title = "Perguntas frequentes",
    items = [
      {
        question: "O que é a RuralTech?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            A RuralTech é uma empresa de tecnologia para o agronegócio, especializada em soluções de rastreabilidade, gestão e inovação. Atuamos em toda a cadeia produtiva, conectando fazendas, lojas e matriz para garantir qualidade, segurança e eficiência.
          </p>
        ),
      },
      {
        question: "Qual é o objetivo da RuralTech?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            Nosso objetivo é fornecer tecnologia e processos que permitam aos produtores e varejistas do agronegócio centralizar informações, monitorar a produção e garantir rastreabilidade completa, desde a fazenda até o consumidor final.
          </p>
        ),
      },
      {
        question: "Quem se beneficia dos serviços da RuralTech?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Produtores rurais, cooperativas, distribuidores e varejistas podem se beneficiar das soluções da RuralTech. Garantimos transparência, segurança e qualidade em todos os produtos que passam por nossas tecnologias.
          </p>
        ),
      },
      {
        question: "Como a RuralTech garante rastreabilidade e segurança?",
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
          "Quais tipos de produção a RuralTech atende?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Atuamos com diversas culturas agrícolas e criações, como verduras, legumes, laticínios e produtos pecuários. Nossas soluções se adaptam às particularidades de cada produção, garantindo eficiência e segurança.
          </p>
        ),
      },
      {
        question: "Como a RuralTech agrega valor aos negócios do agronegócio?",
        answer: (
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            A RuralTech agrega valor ao integrar tecnologia, gestão e rastreabilidade, ajudando empresas a otimizar processos, aumentar a produtividade e garantir qualidade em toda a cadeia produtiva. Nossas soluções fortalecem a confiança de consumidores, parceiros e investidores.
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
