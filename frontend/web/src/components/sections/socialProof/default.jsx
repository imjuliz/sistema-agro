"use client";
import SocialProofMarquee from "@/components/ui/shadcn-io/3d-marquee/index";

export default function ThreeDMarqueeDemo() {

  return (
    <>
       <div className="mx-auto my-10 max-w-7xl rounded-3xl p-2 ring-1 ring-neutral-700/10">
      {/* container relativo que vai servir de referência para overlays */}
      <div className="relative overflow-hidden">
        {/* garante que o marquee fique "abaixo" das overlays */}
        <div className="relative z-10">
          <SocialProofMarquee />
        </div>

        {/* overlays LATERAIS — depois do conteúdo no DOM para ficarem sobre ele */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-50"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-50"
          style={{
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
    </div>
    </>

  );
}
