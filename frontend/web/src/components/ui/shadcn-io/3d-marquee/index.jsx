import React from "react";

export default function SocialProofMarquee({ testimonials }) {
  const sample = [
    {
      name: "Félix B.",
      handle: "@felixbs",
      avatar: "https://i.pravatar.cc/150?img=12",
      text: "Digging into @launchui. Those shadows are giving me serious design envy."
    },
    {
      name: "Fabrizio Fernandez",
      handle: "@fab3304",
      avatar: "https://i.pravatar.cc/150?img=32",
      text: "Playing around with @launchui suddenly made me feeling inspired to launch that side project."
    },
    {
      name: "Darius Flynn",
      handle: "@dflynnn",
      avatar: "https://i.pravatar.cc/150?img=24",
      text: "Exploring @launchui's slick UI. It's like a dark-mode enthusiast's playground."
    },
    {
      name: "Esme Rothschild",
      handle: "@EsmeRothArt",
      avatar: "https://i.pravatar.cc/150?img=18",
      text: "@launchui is slick. That globe graphic though. Making me feel like I'm building websites for a sci-fi movie."
    },
    {
      name: "Kai Nakamura",
      handle: "@KainKawWaves",
      avatar: "https://i.pravatar.cc/150?img=8",
      text: "Just made my first website with @launchui. Its flexibility is speaking my language. No drama, just seamless integration."
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
          <h2 className="text-3xl font-semibold text-white">Histórias de quem já confia na AgroTech</h2>
          <p className="mt-2 text-sm text-gray-300">Da fazenda à prateleira, veja como nossa solução está transformando o agronegócio.</p>
        </div>

        <div className="mx-auto max-w-6xl space-y-6">
          {/* Row 1: move left */}
          <div className="marquee">
            <div
              className="marquee__track marquee-animate-left"
              style={{ animationDuration: "28s" }}
              aria-hidden="true"
            >
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
