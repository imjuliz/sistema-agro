"use client";

import { motion } from "framer-motion";
import { Icon } from "lucide-react"; // opcional se quiser ícones
import React from "react";

// export default function BentoGrid() {
//   return (
//    <></>
//   );
// }

// function BentoCard({ }) {
//   return (
//     <></>
//   );
// }

import { Section } from "@/components/ui/section";
import { SectionHeader } from "./section-header";
// import { motion } from "motion/react";
import { FirstBentoAnimation } from "./first-bento-animation";
import { FourthBentoAnimation } from "./fourth-bento-animation";
import { SecondBentoAnimation } from "./second-bento-animation";
import { ThirdBentoAnimation } from "./third-bento-animation";
import { cn } from "@/lib/utils";

export function BentoSection() {

  const items = [
    {
      id: 1,
      content: <FirstBentoAnimation />,
      title: "Real-time Spending Analysis",
      description:
        "Track every transaction instantly. Get immediate insights into spending patterns, unusual purchases, and budget performance.",
    },
    {
      id: 2,
      content: <SecondBentoAnimation />,
      title: "Rastreabilidade Completa",
      description:
        "Rastreie cada lote desde o talhão até a prateleira: vinculação de lotes, origem dos insumos e histórico de transporte. Garanta transparência e conformidade para recall e certificações.",
    },
    {
      id: 3,
      content: (
        <ThirdBentoAnimation
          data={[1200, 1800, 1500, 2200, 2800, 3100, 3500]}
          toolTipValues={[
            1200, 1800, 1500, 2200, 2800, 3100, 3500, 4000, 4500, 5000,
          ]}
        />
      ),
      title: "Sua empresa sobe de nível",
      description:
        "Aumente receita e eficiência com análises que identificam oportunidades de lucro por lote, produto e canal. Painel com indicadores práticos para escalar operações.",
    },
    {
      id: 4,
      content: <FourthBentoAnimation once={false} />,
      title: "Planejamento & Monitoramento",
      description:
        "Planeje safras, estoque e vendas com previsões inteligentes. Monitore desempenho em tempo real, receba alertas e tome decisões informadas para reduzir perdas e maximizar produtividade.",
    },
  ];

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl">
      <Section
      id="bento"
    >
      <div className="border-x relative">
        <SectionHeader>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance pb-1">
            Empower Your Finances with AI
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Experience AI-powered spending insights, predictive budgeting, and real-time financial health monitoring to optimize your money management.
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-default max-h-[400px] group"
            >
              <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
                {item.content}
              </div>
              <div className="flex-1 flex-col gap-2 p-6">
                <h3 className="text-lg tracking-tighter font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
    </div>
    
  );
}





