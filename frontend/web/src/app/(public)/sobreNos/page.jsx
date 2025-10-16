"use client";
import { Rocket, Lightbulb, Users, ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";
import img from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import Footer from "@/components/Home/sections/footer/default";
import Navbar from "@/components/Home/sections/navbar/default";

// Keep complex objects separate for reusability
const defaultFeatures = [
    {
        icon: Rocket,
        title: "Rastreabilidade Inteligente",
        description:
            "Cada lote de produção é monitorado desde o plantio até a venda, garantindo segurança alimentar e transparência total para o consumidor final.",
        // link: "/test",
    },
    {
        icon: Lightbulb,
        title: "Gestão Integrada de Unidades",
        description:
            "A matriz acompanha em tempo real o desempenho de todas as fazendas e lojas, com relatórios consolidados de produção, estoque e finanças.",
        // link: "/test",
        // learnMoreText: "Learn more",
    },
    {
        icon: Users,
        title: "Inovação com IoT",
        description:
            "Integramos sensores e dispositivos físicos para monitorar colheitas e insumos, transformando dados agrícolas em decisões inteligentes.",
        // link: "/test",
        // learnMoreText: "Learn more",
    },
];

const defaultStats = [
    { number: "10M+", label: "Professionals Empowered" },
    { number: "150+", label: "Countries Reached" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Available" },
];

export default function sobreNos({
    // Hero section - inline defaults for simple strings
    badgeText = "Sobre nós",
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
    ctaImageSrc = "/img/agricultorUtilizandoTablet.jpg",
    ctaImageAlt = "Agricultor utilizando tablet no campo",
    ctaImageOverlayText = "Sistema RuralTech",
    ctaImageOverlaySubtext = "Gestão, rastreabilidade e eficiência para o agronegócio",

    // Stats section
    stats = defaultStats,
}) {
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
                            <img
                                src={visionImageSrc}
                                alt={visionImageAlt}
                                width={500}
                                height={300}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="space-y-3">
                            <Badge variant="outline" className="font-medium">
                                {visionBadge}
                            </Badge>
                            <p className="text-xl font-medium">{visionText}</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg shadow-sm">
                        <img
                            src={missionImageSrc}
                            alt={missionImageAlt}
                            width={500}
                            height={300}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                            <div className="p-6 text-white md:p-8">
                                <Badge
                                    variant="outline"
                                    className="mb-3 border-white/20 bg-white/10 text-white"
                                >
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
                            <div
                                key={index}
                                className="group flex flex-col rounded-lg border border-border p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                            >
                                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 transition-all group-hover:bg-primary/20">
                                    <item.icon className="size-5 text-primary md:size-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                                <p className="mb-4 text-muted-foreground">{item.description}</p>
                                {/* <Link href={item.link}>
                                    <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                        <span>{item.learnMoreText}</span>
                                        <ArrowRight className="ml-1 size-4" />
                                    </div>
                                </Link> */}
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
                                <img
                                    src={ctaImageSrc}
                                    alt={ctaImageAlt}
                                    width={500}
                                    height={300}
                                    className="aspect-video w-full rounded-lg object-cover shadow-lg"
                                />
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
                <div className="grid gap-8 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center rounded-lg border border-border p-6 text-center"
                        >
                            <p className="text-3xl font-bold md:text-4xl">{stat.number}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}