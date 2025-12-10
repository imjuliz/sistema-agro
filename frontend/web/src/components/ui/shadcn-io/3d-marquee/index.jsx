import React from "react";

export default function SocialProofMarquee({ testimonials }) {
  const sample = [
  {
    name: "João da Silva",
    handle: "Produtor Rural",
    avatar: "https://i.pravatar.cc/150?img=15",
    text: "A RuralTech garante produtos frescos e de qualidade. Sempre confiável do campo até a loja."
  },
  {
    name: "Maria Oliveira",
    handle: "Loja RuralTech",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "Nossas vendas aumentaram com a variedade de produtos e o suporte da RuralTech. Clientes satisfeitos!"
  },
  {
    name: "Fazenda Vale Verde",
    handle: "Parceiro RuralTech",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "Trabalhar com a RuralTech nos ajuda a manter rastreabilidade e qualidade em todos os nossos produtos."
  },
  {
    name: "Carlos Pereira",
    handle: "Cliente RuralTech",
    avatar: "https://i.pravatar.cc/150?img=21",
    text: "Sempre encontro produtos frescos e confiáveis nas lojas da RuralTech. Recomendo para todos!"
  },
  {
    name: "Ana Souza",
    handle: "Consumidora RuralTech",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "A transparência e qualidade dos produtos da RuralTech me deixam segura na hora da compra."
  }
];

  const items = testimonials && testimonials.length ? testimonials : sample;

  // Duplicate arrays to create seamless loop
  const doubled = [...items, ...items];

  // A simple card renderer
  const Card = ({ t }) => (
    <div className="sp-card" role="article" aria-label={`${t.name} testimonial`}>
      <div className="meta">
        <img src={t.avatar} alt={`${t.name} avatar`} />
        <div>
          <div className="name">{t.name}</div>
          <div className="handle">{t.handle}</div>
        </div>
      </div>
      <div className="text">{t.text}</div>
    </div>
  );

  return (
    <>
      <section aria-label="Social proof" className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h2 className="text-3xl sm:text-5xl font-semibold text-black dark:text-white">Histórias de quem <br />já confia na RuralTech</h2>
          <p className="mt-2 text-sm text-gray-300"> Clientes e parceiros compartilham como a RuralTech entrega produtos de qualidade e confiança.</p>
        </div>

        <div className="mx-auto max-w-6xl space-y-6">
          {/* Row 1: move left */}
          <div className="marquee">
            <div className="marquee__track marquee-animate-left" style={{ animationDuration: "28s" }} aria-hidden="true" >
              {doubled.map((t, i) => (
                <Card key={`r1-${i}`} t={t} />
              ))}
            </div>
          </div>

          {/* Row 2: move right, slower */}
          <div className="marquee">
            <div
              className="marquee__track marquee-animate-right"
              style={{ animationDuration: "36s" }}
              aria-hidden="true"
            >
              {doubled.map((t, i) => (
                <Card key={`r2-${i}`} t={t} />
              ))}
            </div>
          </div>
        </div>

      </section>
    </>



  );
}