"use client";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { useAppearance } from "@/contexts/AppearanceContext"; // Importar useAppearance
import { useEffect, useState } from "react";

export default function SocialProofMarquee({ testimonials }) {
  const { lang, changeLang } = useTranslation();
  const languageOptions = [
    { value: 'pt-BR', label: 'Português (BR)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];

  const { theme: globalTheme, selectedFontSize: globalSelectedFontSize } = useAppearance(); // Obter do contexto
      // Estados locais para edição temporária antes de salvar
      const [localTheme, setLocalTheme] = useState(globalTheme); 
      const [localSelectedFontSize, setLocalSelectedFontSize] = useState(globalSelectedFontSize); 
      const [localLang, setLocalLang] = useState(lang);

  const isPreferencesDirty = localTheme !== globalTheme || localSelectedFontSize !== globalSelectedFontSize || localLang !== lang;
  
  useEffect(() => {
    setLocalTheme(globalTheme);
    setLocalSelectedFontSize(globalSelectedFontSize);
    setLocalLang(lang);
  }, [globalTheme, globalSelectedFontSize, lang]);


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

  const doubled = [...items, ...items];

  const Card = ({ t }) => (
    <div className="sp-card" role="article" aria-label={`${t.name} testimonial`}>
      <div className="meta">
        <img src={t.avatar} alt={`${t.name} avatar`} />
        <div>
          <div className="name">{t.name}</div>
          <div className="handle"><Transl>{t.handle}</Transl></div>
        </div>
      </div>
      <div className="text"><Transl>{t.text}</Transl></div>
    </div>
  );

  return (
    <>
      <section aria-label="Social proof" className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <Transl className="text-3xl sm:text-5xl font-semibold text-black dark:text-white">Histórias de quem <br />já confia na RuralTech</Transl>
          <Transl className="mt-2 text-sm text-gray-300"> Clientes e parceiros compartilham como a RuralTech entrega produtos de qualidade e confiança.</Transl>
        </div>

        <div className="mx-auto max-w-6xl space-y-6">
          <div className="marquee">
            <div className="marquee__track marquee-animate-left" style={{ animationDuration: "28s" }} aria-hidden="true" >
              {doubled.map((t, i) => (<Card key={`r1-${i}`} t={t} />))}
            </div>
          </div>

          {/* Row 2: move right, slower */}
          <div className="marquee">
            <div className="marquee__track marquee-animate-right" style={{ animationDuration: "36s" }} aria-hidden="true">
              {doubled.map((t, i) => (<Card key={`r2-${i}`} t={t} />))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
