"use client";
import SocialProofMarquee from "@/components/ui/shadcn-io/3d-marquee/index";
import { Section } from "@/components/ui/section";

export default function ThreeDMarqueeDemo() {
  return (
    <Section>
      <div className="mx-auto my-10 max-w-7xl rounded-3xl p-2">
      {/* container relativo que serve de referência para os overlays */}
      <div className="relative overflow-hidden">
        {/* marquee "abaixo" das overlays */}
        <div className="relative z-10">
          <SocialProofMarquee />
        </div>

        {/* overlays laterais — com suporte ao modo claro/escuro */}
        <div className="rounded-l-3xl pointer-events-none absolute inset-y-0 left-0 w-32 z-50 transition-colors" style={{background:"linear-gradient(90deg, var(--overlay-start) 0%, var(--overlay-mid) 40%, rgba(0,0,0,0) 100%)",}}/>
        <div className="rounded-r-3xl pointer-events-none absolute inset-y-0 right-0 w-32 z-50 transition-colors" style={{background:"linear-gradient(270deg, var(--overlay-start) 0%, var(--overlay-mid) 40%, rgba(0,0,0,0) 100%)",}}/>

        {/* definindo variáveis CSS dinâmicas para modo claro/escuro */}
        <style jsx>{`
          :root {
            --overlay-start: rgba(255, 255, 255, 0.95);
            --overlay-mid: rgba(255, 255, 255, 0.65);
          }
          .dark {
            --overlay-start: rgba(0, 0, 0, 0.95);
            --overlay-mid: rgba(0, 0, 0, 0.65);
          }
        `}</style>
      </div>
    </div>
    </Section>
  );
}
