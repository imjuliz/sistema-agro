import { siteConfig } from "@/config/site";

import Plataforma from "@/components/Home/logos/plataforma";
import Acesso from "@/components/Home/logos/acesso";
import Seguranca from "@/components/Home/logos/seguranca";
import Tailwind from "@/components/Home/logos/tailwind";
import Iot from "@/components/Home/logos/iot";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";
import { Section } from "@/components/ui/section";

export default function Logos({
  title = "Por que escolher a RuralTech?",
  badge = (
    <Badge variant="outline" className="border-brand/30 text-brand">
 Compromisso RuralTech com qualidade e inovação    </Badge>
  ),
  logos = [
    <Logo key="plataforma" image={Plataforma} name="Produção própria de qualidade" />,
    <Logo key="acesso" image={Acesso} name="Atendimento em todas as nossas lojas" />,
    <Logo key="iot" image={Iot} name="Controle e rastreabilidade avançada" badge="Novo"
    />,
    <Logo key="seguranca" image={Seguranca} name="Transparência e confiança em toda a cadeia"/>,
    
  ],
  className,
}) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <h2 className="text-md font-semibold sm:text-2xl">{title}</h2>
        </div>
        {logos !== false && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {logos}
          </div>
        )}
      </div>
    </Section>
  );
}
