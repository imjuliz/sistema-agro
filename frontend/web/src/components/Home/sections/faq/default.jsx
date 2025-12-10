import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const defaultFaq = [
  {
    q: "Como garantir a qualidade dos produtos?",
    a: "Todos os lotes são rastreados desde a origem, com inspeções e controles em cada etapa da cadeia.",
  },
  {
    q: "Vocês vendem para varejo e atacado?",
    a: "Sim. Atendemos lojas próprias, parceiros e clientes finais com as mesmas políticas de qualidade.",
  },
  {
    q: "Como falar com o time comercial?",
    a: "Entre em contato pelo e-mail ruraltech052@gmail.com ou pelos canais listados no rodapé.",
  },
  {
    q: "Há integração com estoque e vendas?",
    a: "Temos sistemas integrados para produção, estoque e ponto de venda, permitindo rastreabilidade completa.",
  },
];

export default function FAQSection({
  title = "Perguntas frequentes",
  description = "Entenda como funcionam nossos processos, suporte e serviços.",
  items = defaultFaq,
  className,
}) {
  return (
    <Section className={cn("bg-background", className)}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        <div className="grid gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-border/70 p-4 bg-card/50">
              <div className="font-semibold text-lg">{item.q}</div>
              <p className="text-muted-foreground mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}