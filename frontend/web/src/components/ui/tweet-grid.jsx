"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"; // usa seu componente customizado

const tweets = [
  { id: "1", content: "🚜 Comunicado: A partir de segunda-feira, o horário de colheita será antecipado para 6h devido às altas temperaturas previstas." },
  { id: "2", content: "🌱 A matriz parabeniza toda a equipe da Fazenda Boa Vista pela meta de produtividade atingida neste trimestre!" },
  { id: "3", content: "⚙️ Manutenção preventiva dos tratores John Deere marcada para sexta-feira. Evitem agendar uso nesse período." },
  { id: "4", content: "☀️ Reforçamos a importância da hidratação e uso de EPIs durante o trabalho em campo. Cuidem-se!" },
  { id: "5", content: "📦 Novo lote de insumos chega amanhã pela manhã. Organizem o almoxarifado para recebimento." },
  { id: "6", content: "🌾 Treinamento de manejo sustentável será realizado online na quarta-feira, às 14h. Link será enviado por e-mail." },
  { id: "7", content: "🐄 Setor de pecuária: iniciem o levantamento de dados de peso dos animais até sexta-feira." },
  { id: "8", content: "🧾 Lembrando que o fechamento mensal de relatórios deve ser concluído até o dia 28." },
  { id: "9", content: "📈 Parabéns à equipe da Fazenda São Pedro pelo destaque em eficiência no uso de fertilizantes!" },
  { id: "10", content: "🚨 Aviso: inspeção de segurança agendada para a próxima terça-feira. Todos os setores devem estar em conformidade." }
];

const tweetItemVariants = cva("break-inside-avoid", {
  variants: { spacing: { sm: "mb-2", md: "mb-4", lg: "mb-6" } },
  defaultVariants: { spacing: "md" },
});

const MockTweet = ({ tweet }) => {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">MZ</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Matriz Agrícola</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">@matriz_fazenda</div>
        </div>
      </div>
      <div className="text-gray-900 dark:text-white mb-3">{tweet.content}</div>
    </div>
  );
};

export const TweetGrid = ({ spacing = "md", className }) => {
  return (
    <div className={cn("max-w-4xl md:max-w-6xl mx-auto flex flex-col p-10", className)}>
      <ScrollArea className="h-[600px] w-full rounded-md border overflow-y-auto">
        <div className="flex flex-col w-full p-2">
          {tweets.map((tweet) => (
            <div key={tweet.id} className={cn("w-full", tweetItemVariants({ spacing }))}>
              <MockTweet tweet={tweet} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
