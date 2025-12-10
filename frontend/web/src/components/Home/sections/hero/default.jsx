import { ArrowRightIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import Github from "@/components/Home/logos/github";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Glow from "@/components/ui/glow";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import Screenshot from "@/components/ui/screenshot";
import { Section } from "@/components/ui/section";

export default function Hero(props) {
  const {
    title = "RuralTech: Qualidade do campo à sua mesa",
    description =
    "Somos uma empresa especializada em produtos agrícolas e pecuários, unindo produção própria, rastreabilidade e lojas modernas para entregar qualidade e confiança ao consumidor.",
    mockup = (
      <Screenshot
        srcLight="/img/rebanho.jpg"
        srcDark="/img/rebanho.jpg"
        alt="Launch UI app screenshot"
        width={1248}
        height={765}
        className="w-full"
      />
    ),
    badge = (
      <Badge variant="outline" className="animate-appear">
        <span className="text-muted-foreground">
          {/* New version of Launch UI is out! */}
        </span>
        <p className="flex items-center gap-1">
            Compromisso RuralTech com qualidade e rastreabilidade
          {/* <ArrowRightIcon className="size-3" /> */}
        </p>
      </Badge>
    ),
    buttons = [
      {
        href: '/login',
        text: "Entrar",
        variant: "default",
      },
      {
        href: '/sobreNos',
        text: "Conheça a RuralTech",
        variant: "glow",
        // icon: <img src='/img/ruraltech-logobranco.svg' width={20}/>,
        icon: <Screenshot srcLight="/img/ruraltech-logopreto.svg" srcDark="/img/ruraltech-logobranco.svg" alt="RuralTech Logo" width={20} height={20} />
      },
    ],
    className,
  } = props;

  return (
    <Section className={cn("fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0", className)}>
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight pb-5">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant || "default"} size="lg" asChild>
                  <a href={button.href}>
                    {button.icon}
                    {button.text}
                    {button.iconRight}
                  </a>
                </Button>
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <MockupFrame className="animate-appear opacity-0 delay-700" size="small">
                <Mockup type="responsive" className="bg-background/90 w-full rounded-xl border-0">
                  {mockup}
                </Mockup>
              </MockupFrame>
              <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}