import { siteConfig } from "@/config/site";

import Plataforma from "@/components/logos/plataforma";
import Acesso from "@/components/logos/acesso";
import Seguranca from "@/components/logos/seguranca";
import Tailwind from "@/components/logos/tailwind";
import Iot from "@/components/logos/iot";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";
import { Section } from "@/components/ui/section";

export default function Logos({
  title = "Leve seu agronegócio para o próximo nível",
  badge = (
    <Badge variant="outline" className="border-brand/30 text-brand">
      Last updated: {siteConfig.stats.updated}
    </Badge>
  ),
  logos = [
    <Logo key="plataforma" image={Plataforma} name="Plataforma unificada" />,
    <Logo key="acesso" image={Acesso} name="Acesso em qualquer dispositivo" />,
    <Logo key="iot" image={Iot} name="Integração com IoT" badge="Novo"
    />,
    <Logo key="seguranca" image={Seguranca} name="Segurança e hierarquia de acessos"/>,
    // <Logo
    //   key="tailwind"
    //   image={Tailwind}
    //   name="Tailwind"
    //   version="4.1"
    //   badge="New"
    // />,
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
