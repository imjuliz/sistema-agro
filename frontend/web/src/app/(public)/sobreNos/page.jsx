"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Home/sections/footer/default";
import Navbar from "@/components/Home/sections/navbar/default";
import * as React from 'react';
import { toast } from 'sonner';
//icons-----
import { Mail, Phone, ArrowDownRight, Rocket, Lightbulb, User, Send, Instagram } from "lucide-react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { API_URL } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';

const defaultFeatures = [
    {
        icon: Rocket,
        title: "Rastreabilidade Inteligente",
        description: "Cada lote de produção é monitorado desde o plantio até a venda, garantindo segurança alimentar e transparência total para o consumidor final.",
    },
    {
        icon: Lightbulb,
        title: "Gestão Integrada de Unidades",
        description: "A matriz acompanha em tempo real o desempenho de todas as fazendas e lojas, com relatórios consolidados de produção, estoque e finanças.",
    }
];

export default function sobreNos({
    badgeText = "Sobre a RuralTech",
    title = "Uma história construída ",
    titleHighlight = "no campo",
    description = "RuralTech é uma empresa brasileira de agronegócio dedicada à produção, processamento e distribuição de alimentos de alta qualidade, desde hortaliças e legumes até carnes e laticínios, sempre com foco em sustentabilidade e segurança alimentar.",

    // Vision section
    visionImageSrc = "/img/campoComTecnologia.jpg",
    visionImageAlt = "Campo com tecnologia agrícola moderna",
    visionBadge = "NOSSA VISÃO",
    visionText = "Ser referência nacional em alimentos de origem agrícola e pecuária, promovendo qualidade, responsabilidade socioambiental e inovação em toda a cadeia produtiva, do campo à mesa do consumidor.",

    // Mission section
    missionImageSrc = "/img/equipeGestaoAgricola.jpg",
    missionImageAlt = "Equipe de gestão agrícola analisando dados de produção",
    missionBadge = "NOSSA MISSÃO",
    missionText = "Produzir alimentos seguros e de alta qualidade, garantindo bem-estar animal, sustentabilidade, rastreabilidade completa e fortalecendo a confiança entre produtores e consumidores.",

    // Approach section
    approachBadge = "QUEM SOMOS",
    approachTitle = "Uma empresa que nasce e cresce no campo",
    approachDescription = "Fundada com a missão de transformar a produção agropecuária em referência de qualidade e confiança, a RuralTech atua em toda a cadeia: cultivo, criação, processamento e distribuição de produtos agrícolas e pecuários, garantindo alimento fresco e seguro para toda a população.",
    features = defaultFeatures,

    // CTA section
    ctaBadge = "NOSSA PRODUÇÃO",
    ctaTitle = "Alimentos que nascem no campo e chegam com qualidade à sua mesa",
    ctaDescription = "Na RuralTech, unimos tradição e inovação na produção de alimentos agrícolas e pecuários, garantindo frescor, qualidade e responsabilidade ambiental em toda a cadeia.",
    ctaButton1Text = "Conheça nossos produtos",
    // ctaButton2Text = "Fale com um representante",
    ctaImageSrc = "/img/mulher-tablet.jpg",
    ctaImageAlt = "Agricultor utilizando tablet no campo",
    ctaImageOverlayText = "RuralTech — Produção Agropecuária",
    ctaImageOverlaySubtext = "Qualidade, origem e responsabilidade"
}) {
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`Copiado: ${text}`))
            .catch(() => toast.error("Falha ao copiar. Tente novamente."));
    };

  

    const cards = [
        {
            icon: <Mail className="w-4 h-4 text-neutral-500" />,
            title: "ruraltech052@gmail.com",
            description: "Estamos aqui para ajudar com qualquer dúvida ou código.",
            linkText: "Contatar suporte",
            linkHref: "mailto:ruraltech052@gmail.com",
            highlight: false,
        },
        {
            icon: <WhatsAppIcon className="w-4 h-4 text-neutral-500" />,
            title: "(11) 98765-4321",
            description: "Pesquise em nosso FAQ respostas para qualquer dúvida que você possa ter.",
            linkText: "Visitar FAQ",
            linkHref: "https://wa.me/5511987654321",
            highlight: false,
        },
        {
            icon: <Instagram className="w-4 h-4 text-neutral-500" />,
            title: "@ruraltech.52",
            description: "Confira nosso guia de início rápido para desenvolvedores.",
            linkText: "Contatar vendas",
            linkHref: "#",
            highlight: false,
        },
    ];

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
        agreedToPrivacy: false
    });

    // Formatar telefone
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = `${API_URL}/contato`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.erro || "Erro ao enviar mensagem");
                return;
            }

            toast.success(data.mensagem || "Mensagem enviada com sucesso!");

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                message: "",
                agreedToPrivacy: false
            });
        } catch (error) {
            console.error("Erro ao enviar contato:", error);
            toast.error("Erro ao enviar mensagem. Tente novamente.");
        }
    };

    const handleChange = (field, value) => {
        // Aplicar formatação de telefone se for o campo phone
        if (field === "phone") { value = formatPhoneNumber(value); }
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <main className="container mx-auto bg-background ">
            <Navbar />
            <div className="flex flex-col py-16 gap-16 md:gap-24">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
                    <Badge variant="outline" className="w-max">
                        {badgeText}
                        <ArrowDownRight className="ml-2 size-4" />
                    </Badge>
                    <Transl className="text-pretty text-4xl font-bold tracking-tight lg:text-6xl">
                        {title}{" "}
                        <span className="relative text-primary">{titleHighlight}</span>
                    </Transl>
                    <Transl className="text-lg text-muted-foreground">{description}</Transl>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="group flex flex-col justify-between gap-6 rounded-lg bg-muted p-6 shadow-sm transition-all duration-300 hover:shadow-md md:p-8">
                        <div className="overflow-hidden rounded-md">
                            <img src={visionImageSrc} alt={visionImageAlt} width={500} height={300} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="space-y-3">
                            <Badge variant="outline" className="font-medium">{visionBadge}</Badge>
                            <Transl className="text-xl font-medium">{visionText}</Transl>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg shadow-sm">
                        <img src={missionImageSrc} alt={missionImageAlt} width={500} height={300} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                            <div className="p-6 text-white md:p-8">
                                <Badge variant="outline" className="mb-3 border-white/20 bg-white/10 text-white">
                                    {missionBadge}
                                </Badge>
                                <Transl className="text-xl font-medium">{missionText}</Transl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-10 md:gap-12">
                    <div className="max-w-2xl">
                        <Badge variant="outline">
                            {approachBadge}{" "}
                            <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Badge>
                        <Transl className="mb-3 mt-6 text-3xl font-bold md:text-4xl">
                            {approachTitle}
                        </Transl>
                        <p className="text-muted-foreground">{approachDescription}</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                        {features.map((item, index) => (
                            <div key={index} className="group flex flex-col rounded-lg border border-border p-6 transition-all duration-300 hover:border-[#99BF0F] hover:shadow-sm">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 group-hover:bg-[#99BF0F]/10 dark:group-hover:bg-[#99BF0F]/30 transition-all group-hover:border-[#99BF0F]">
                                    <item.icon className="size-5 text-primary md:size-6 group-hover:stroke-[#99BF0F]" />
                                </div>
                                <Transl className="mb-2 text-xl font-semibold">{item.title}</Transl>
                                <Transl className="mb-4 text-muted-foreground">{item.description}</Transl>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 p-6 md:p-10">
                    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
                        <div>
                            <Badge className="mb-6">{ctaBadge}</Badge>
                            <Transl className="mb-3 text-3xl font-bold md:text-4xl">{ctaTitle}</Transl>
                            <Transl className="mb-6 text-muted-foreground">{ctaDescription}</Transl>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" className="w-full sm:w-max">
                                    {ctaButton1Text}
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative">
                                <img src={ctaImageSrc} alt={ctaImageAlt} width={500} height={300} className="aspect-video w-full rounded-lg object-cover shadow-lg" />
                                <div className="absolute bottom-4 left-4 rounded-lg bg-background p-4 shadow-md backdrop-blur-sm">
                                    <Transl className="font-semibold">{ctaImageOverlayText}</Transl>
                                    <Transl className="text-sm text-muted-foreground">
                                        {ctaImageOverlaySubtext}
                                    </Transl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* cards */}
                {/* fale conosco */}
                <div className="bg-background min-h-screen">
                    <div className="mx-auto  px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid items-start gap-16 lg:grid-cols-2">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Transl className="text-foreground text-3xl leading-tight font-bold lg:text-4xl">Fale com a RuralTech</Transl>
                                    <Transl className="text-muted-foreground leading-relaxed">Entre em contato para saber mais sobre nossos produtos, nossas fazendas, criação de animais e unidades de distribuição. Nossa equipe está pronta para responder suas dúvidas e fornecer informações detalhadas sobre nossa produção.</Transl>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="relative">
                                            <User className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                                            <Input placeholder="Nome" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="border-border bg-card h-12 pl-10" required />
                                        </div>
                                        <div className="relative">
                                            <User className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                                            <Input placeholder="Sobrenome" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="border-border bg-card h-12 pl-10" required />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Phone className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                                        <Input placeholder="Telefone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border-border bg-card h-12 pl-10" required />
                                    </div>

                                    <div className="relative">
                                        <Mail className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                                        <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="border-border bg-card h-12 pl-10" required />
                                    </div>

                                    <div>
                                        <Textarea placeholder="Sua mensagem" value={formData.message} onChange={(e) => handleChange("message", e.target.value)} className="border-border bg-card min-h-32 resize-none" required />
                                    </div>

                                    <Button type="submit" size="lg">
                                        <Transl>Enviar</Transl><Send />
                                    </Button>
                                </form>
                            </div>
                            {/* Right Column - Hero Image */}
                            <div className="relative h-full">
                                <div className="overflow-hidden h-full rounded-2xl shadow-lg">
                                    <iframe title="Localização" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086302231854!2d-122.40107092459283!3d37.77665667198132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858088d35df8e9%3A0xc8b2b3c0b48a0b49!2s123%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103!5e0!3m2!1spt-BR!2sbr!4v1680293848340!5m2!1spt-BR!2sbr"></iframe>
                                </div>
                            </div>
                        </div>
                        <section className="w-full py-12">
                            <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {cards.map((card, index) => (
                                    <div key={index} className={`flex flex-row gap-4 items-center text-center p-4 rounded-xl border transition-colors ${card.highlight ? "bg-neutral-50 dark:bg-neutral-800" : "bg-white dark:bg-neutral-900"} hover:bg-neutral-100 dark:hover:bg-neutral-800`}>
                                        {card.icon}
                                        <a href={card.linkHref} className="text-sm font-semibold text-neutral-900 dark:text-white hover:underline"><Transl>{card.title}</Transl></a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}