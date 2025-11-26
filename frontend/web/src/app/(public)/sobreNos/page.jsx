"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Home/sections/footer/default";
import Navbar from "@/components/Home/sections/navbar/default";
import * as React from 'react';
//icons-----
import { Mail, Phone, Wrench, ArrowDownRight, Rocket, Lightbulb, Users, User, Send } from "lucide-react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

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
    },
    {
        icon: Users,
        title: "Inovação com IoT",
        description: "Integramos sensores e dispositivos físicos para monitorar colheitas e insumos, transformando dados agrícolas em decisões inteligentes.",
    },
];

export default function sobreNos({
    // Hero section - inline defaults for simple strings
    badgeText = "Conheça a RuralTech",
    title = "Revolucionando o",
    titleHighlight = "Futuro do Agronegócio",
    description = "A RuralTech nasceu com o propósito de conectar tecnologia e campo. Nosso sistema de gestão e rastreabilidade transforma dados em decisões estratégicas, garantindo transparência, qualidade e eficiência em toda a cadeia produtiva.",

    // Vision section
    visionImageSrc = "/img/campoComTecnologia.jpg",
    visionImageAlt = "Campo com tecnologia agrícola moderna",
    visionBadge = "NOSSA VISÃO",
    visionText = "Ser referência nacional em soluções tecnológicas para o agronegócio, promovendo uma cadeia produtiva 100% rastreável, sustentável e integrada — do campo à mesa do consumidor.",

    // Mission section
    missionImageSrc = "/img/equipeGestaoAgricola.jpg",
    missionImageAlt = "Equipe de gestão agrícola analisando dados de produção",
    missionBadge = "NOSSA MISSÃO",
    missionText = "Desenvolver tecnologias que unam fazendas, lojas e matriz em uma gestão inteligente, garantindo rastreabilidade completa, qualidade alimentar e o fortalecimento da confiança entre produtor e consumidor.",

    // Approach section
    approachBadge = "Nossa abordagem",
    approachTitle = "Conectando o Campo à Tecnologia",
    approachDescription = "A RuralTech entende que o futuro do agronegócio depende de informação, rastreabilidade e eficiência. Por isso, criamos um sistema que centraliza dados da produção e da venda, oferecendo à matriz uma visão global do negócio e às unidades ferramentas práticas para otimizar o trabalho no campo e nas lojas.",
    features = defaultFeatures,

    // CTA section
    ctaBadge = "INOVAÇÃO NO CAMPO",
    ctaTitle = "Unindo Sustentabilidade e Tecnologia",
    ctaDescription = "A RuralTech acredita que o agronegócio do futuro é digital, sustentável e transparente. Nosso sistema foi projetado para conectar todas as pontas da cadeia produtiva, promovendo um novo padrão de excelência e confiança no setor agrícola.",
    ctaButton1Text = "Conheça o Sistema",
    ctaButton2Text = "Ver Demonstração",
    ctaImageSrc = "/img/mulher-tablet.jpg",
    ctaImageAlt = "Agricultor utilizando tablet no campo",
    ctaImageOverlayText = "Sistema RuralTech",
    ctaImageOverlaySubtext = "Gestão, rastreabilidade e eficiência para o agronegócio",

    // Stats section
    // stats = defaultStats,
}) {
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert(`Copiado: ${text}`))
            .catch(() => alert("Falha ao copiar. Tente novamente."));
    };

    const cards = [
        {
            icon: <Mail className="w-4 h-4 text-neutral-500" />,
            title: "ruraltech91@gmail.com",
            description: "Estamos aqui para ajudar com qualquer dúvida ou código.",
            linkText: "Contatar suporte",
            linkHref: "mailto:ruraltech91@gmail.com",
            highlight: false,
        },
        {
            icon: <WhatsAppIcon className="w-4 h-4 text-neutral-500" />,
            title: "(11) 98765-4321",
            description: "Pesquise em nosso FAQ respostas para qualquer dúvida que você possa ter.",
            linkText: "Visitar FAQ",
            linkHref: "#",
            highlight: false,
        },
        {
            icon: <Wrench className="w-4 h-4 text-neutral-500" />,
            title: "Email",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Reset form
        setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            message: "",
            agreedToPrivacy: false
        });
    };

    const handleChange = (field, value) => {
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
                    <h1 className="text-pretty text-4xl font-bold tracking-tight lg:text-6xl">
                        {title}{" "}
                        <span className="relative text-primary">{titleHighlight}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{description}</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="group flex flex-col justify-between gap-6 rounded-lg bg-muted p-6 shadow-sm transition-all duration-300 hover:shadow-md md:p-8">
                        <div className="overflow-hidden rounded-md">
                            <img src={visionImageSrc} alt={visionImageAlt} width={500} height={300} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="space-y-3">
                            <Badge variant="outline" className="font-medium">{visionBadge}</Badge>
                            <p className="text-xl font-medium">{visionText}</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg shadow-sm">
                        <img src={missionImageSrc} alt={missionImageAlt} width={500} height={300} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                            <div className="p-6 text-white md:p-8">
                                <Badge variant="outline" className="mb-3 border-white/20 bg-white/10 text-white">
                                    {missionBadge}
                                </Badge>
                                <p className="text-xl font-medium">{missionText}</p>
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
                        <h2 className="mb-3 mt-6 text-3xl font-bold md:text-4xl">
                            {approachTitle}
                        </h2>
                        <p className="text-muted-foreground">{approachDescription}</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
                        {features.map((item, index) => (
                            <div key={index} className="group flex flex-col rounded-lg border border-border p-6 transition-all duration-300 hover:border-[#99BF0F] hover:shadow-sm">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 group-hover:bg-[#99BF0F]/10 dark:group-hover:bg-[#99BF0F]/30 transition-all group-hover:border-[#99BF0F]">
                                    <item.icon className="size-5 text-primary md:size-6 group-hover:stroke-[#99BF0F]" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                                <p className="mb-4 text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 p-6 md:p-10">
                    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
                        <div>
                            <Badge className="mb-6">{ctaBadge}</Badge>
                            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                                {ctaTitle}
                            </h2>
                            <p className="mb-6 text-muted-foreground">{ctaDescription}</p>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" className="w-full sm:w-max">
                                    {ctaButton1Text}
                                </Button>
                                <Button size="lg" className="w-full sm:w-max" variant="outline">
                                    {ctaButton2Text}
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative">
                                <img src={ctaImageSrc} alt={ctaImageAlt} width={500} height={300} className="aspect-video w-full rounded-lg object-cover shadow-lg" />
                                <div className="absolute bottom-4 left-4 rounded-lg bg-background p-4 shadow-md backdrop-blur-sm">
                                    <p className="font-semibold">{ctaImageOverlayText}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {ctaImageOverlaySubtext}
                                    </p>
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
                                    <h1 className="text-foreground text-3xl leading-tight font-bold lg:text-4xl">Vamos conversar sobre<br />Seu agronegócio</h1>
                                    <p className="text-muted-foreground leading-relaxed">Se você está curioso sobre agronegócios ou apenas precisa de uma orientação sincera — nossos especialistas estão aqui para ajudar.</p>
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

                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="privacy" checked={formData.agreedToPrivacy} onCheckedChange={(checked) => handleChange("agreedToPrivacy", checked)} />
                                        <label htmlFor="privacy" className="text-muted-foreground text-sm leading-relaxed">
                                            Eu li e concordo com a{" "}
                                            <Link href="#" className="underline">
                                                política de privacidade
                                            </Link>
                                        </label>
                                    </div>
                                    <Button type="submit" size="lg">
                                        Enviar<Send />
                                    </Button>
                                </form>
                            </div>
                            {/* Right Column - Hero Image */}
                            <div className="relative h-full">
                                <div className="overflow-hidden h-full rounded-2xl shadow-lg">
                                    <iframe title="Localização" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086302231854!2d-122.40107092459283!3d37.77665667198132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858088d35df8e9%3A0xc8b2b3c0b48a0b49!2s123%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103!5e0!3m2!1spt-BR!2sbr!4v1680293848340!5m2!1spt-BR!2sbr"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <section className="w-full py-12">
                            <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {cards.map((card, index) => (
                                    <div key={index} className={`flex flex-row gap-4 items-center text-center p-4 rounded-xl border transition-colors ${card.highlight ? "bg-neutral-50 dark:bg-neutral-800" : "bg-white dark:bg-neutral-900"} hover:bg-neutral-100 dark:hover:bg-neutral-800`}>
                                        {card.icon}
                                        <a href={card.linkHref} className="text-sm font-semibold text-neutral-900 dark:text-white hover:underline">{card.title}</a>
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