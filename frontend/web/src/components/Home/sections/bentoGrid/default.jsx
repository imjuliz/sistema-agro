"use client";
import React from "react";

import { Section } from "@/components/ui/section";
import { SectionHeader } from "./section-header";
// import { motion } from "motion/react";
import { FirstBentoAnimation } from "./first-bento-animation";
import { FourthBentoAnimation } from "./fourth-bento-animation";
import { SecondBentoAnimation } from "./second-bento-animation";
import { ThirdBentoAnimation } from "./third-bento-animation";

export function BentoSection() {

  const items = [
    {
      id: 1,
      content: <FirstBentoAnimation />,
      title: "Atendimento ao Cliente",
      description:
        "Na RuralTech, nosso foco é oferecer suporte rápido, personalizado e eficiente, garantindo que cada cliente tenha a melhor experiência possível.",
    },
    {
      id: 2,
      content: <SecondBentoAnimation />,
      title: "Rastreabilidade e Segurança",
      description:
        "Cada produto é rastreado desde a fazenda até a prateleira, utilizando tecnologia avançada para assegurar qualidade, transparência e confiança aos clientes.",
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
      title: "Crescimento RuralTech",
      description:
        "A RuralTech impulsiona o agronegócio com soluções inovadoras, aumentando a eficiência e promovendo resultados consistentes em toda a cadeia produtiva.",
    },
    {
      id: 4,
      content: <FourthBentoAnimation once={false} />,
      title: "Planejamento e Excelência",
      description:
        "Nossa equipe planeja e executa estratégias que garantem qualidade, segurança e inovação, consolidando a RuralTech como referência no setor agroindustrial.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl rounded-3xl">
      <Section id="bento">
      <div className="relative">
        <SectionHeader>
          <h2 className="text-3xl font-semibold sm:text-5xl tracking-tighter text-center text-balance pb-1">
             Transformando o Agronegócio com Inovação
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
             Uma empresa comprometida em transformar o agronegócio com tecnologia, inovação e soluções inteligentes.
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-default max-h-[400px] group" >
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
// "use client";

// import React from "react";
// import { Section } from "@/components/ui/section";
// import { SectionHeader } from "./section-header";
// import { FirstBentoAnimation } from "./first-bento-animation";
// import { SecondBentoAnimation } from "./second-bento-animation";
// import { ThirdBentoAnimation } from "./third-bento-animation";
// import { FourthBentoAnimation } from "./fourth-bento-animation";

// export function BentoSection() {
//   return (
//     <div className="mx-auto max-w-7xl rounded-3xl">
//       <Section id="bento">
//         <div className="relative">
//           <SectionHeader>
//             <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance pb-1">
//               Empower Your Finances with AI
//             </h2>
//             <p className="text-muted-foreground text-center text-balance font-medium">
//               Experience AI-powered spending insights, predictive budgeting, and
//               real-time financial health monitoring to optimize your money
//               management.
//             </p>
//           </SectionHeader>

//           {/* GRID PRINCIPAL */}
//           <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
//             {/* Linha 1 */}
//             <div className="flex flex-col border-r border-l">
//               <div className="flex-1 flex items-center justify-center h-[400px] rounded-2xl overflow-hidden">
//                 <FirstBentoAnimation />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold">
//                   Real-time Spending Analysis
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Track every transaction instantly. Get immediate insights into
//                   spending patterns, unusual purchases, and budget performance.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col border-r">
//               <div className="flex-1 flex items-center justify-center h-[400px] rounded-2xl overflow-hidden">
//                 <SecondBentoAnimation />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold">
//                   Rastreabilidade Completa
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Rastreie cada lote desde o talhão até a prateleira: vinculação
//                   de lotes, origem dos insumos e histórico de transporte.
//                   Garanta transparência e conformidade para recall e
//                   certificações.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Segunda linha */}
//           <div className="grid grid-cols-1 md:grid-cols-[60%_40%] ">
//             <div className="flex flex-col border-r border-t border-l">
//               <div className="flex-1 flex items-center justify-center h-[600px] rounded-2xl overflow-hidden ">
//                 <ThirdBentoAnimation
//                   data={[1200, 1800, 1500, 2200, 2800, 3100, 3500]}
//                   toolTipValues={[
//                     1200, 1800, 1500, 2200, 2800, 3100, 3500, 4000, 4500, 5000,
//                   ]}
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold">
//                   Sua empresa sobe de nível
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Aumente receita e eficiência com análises que identificam
//                   oportunidades de lucro por lote, produto e canal. Painel com
//                   indicadores práticos para escalar operações.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col border-t border-r">
//               <div className="flex-1 flex items-center justify-center h-[600px] rounded-2xl overflow-hidden">
//                 <FourthBentoAnimation once={false} />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold">
//                   Planejamento & Monitoramento
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Planeje safras, estoque e vendas com previsões inteligentes.
//                   Monitore desempenho em tempo real, receba alertas e tome
//                   decisões informadas para reduzir perdas e maximizar
//                   produtividade.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Section>
//     </div>
//   );
// }