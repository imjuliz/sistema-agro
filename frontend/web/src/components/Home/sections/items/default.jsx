import {
  Tractor,
  EclipseIcon,
  FastForwardIcon,
  LanguagesIcon,
  MonitorSmartphoneIcon,
  RocketIcon,
  ScanFaceIcon,
  SquarePenIcon,
} from "lucide-react";

import { Item, ItemDescription, ItemIcon, ItemTitle } from "@/components/ui/item";
import { Section } from "@/components/ui/section";

export default function Items({
  title = "Conheça a RuralTech",
  items = [
    {
      title: "Nossa Matriz",
      description: "Na RuralTech, nossa matriz centraliza toda a operação da empresa, garantindo decisões estratégicas, gestão de equipes e inovação constante. É aqui que planejamos a produção, definimos padrões de qualidade e coordenamos nossas lojas e fazendas com excelência.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
      ),
      // icon: <ScanFaceIcon className="size-5 stroke-1" />,
    },
    {
      title: "Produção RuralTech",
      description: "Nossa produção própria de alimentos e produtos pecuários garante qualidade e rastreabilidade total. Cada etapa — do plantio e criação ao manejo animal — é cuidadosamente monitorada para entregar produtos confiáveis, frescos e seguros aos nossos clientes.",
      icon: <Tractor />,
    },
    {
      title: "Nossas Lojas",
      description:
        "As lojas RuralTech oferecem uma experiência completa ao cliente, com atendimento especializado, variedade de produtos agrícolas e pecuários e transparência em toda a cadeia de produção. Garantimos qualidade do campo à sua mesa.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
      ),
    },
  ],
  className,
}) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <h2 className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
        {/* <h2 className="max-w-[224px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight"> */}
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          // <div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <div className="w-full px-8 grid auto-rows-fr gap-0 sm:grid-cols-1 sm:gap-4 lg:grid-cols-3">
            {items.map((item, index) => (
              <Item key={index}>
                <ItemTitle className="flex items-center gap-2">
                  <ItemIcon>{item.icon}</ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription className={'text-justify w-full'}>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}