'use client';
import React, { useMemo } from "react";
import Link from "next/link";
import '@/app/globals.css'
import { AppSidebar } from "@/components/NavBar/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/NavBar/sidebar"
import { usePathname } from "next/navigation";

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";

const titleMap = {
    "": "Início",
    dashboard: "Painel",
    perfil: "Perfil",
    empresa: "Empresa",
    aparencia: "Aparência",
    notificacoes: "Notificações",
    fazendas: "Fazendas",
    lojas: "Lojas",
    settings: "Configurações",
    producao: "Produção",
    vendas: "Vendas",
    financeiro: "Financeiro",
};

function humanizeSegment(seg) {
    if (!seg) return "";
    if (titleMap[seg]) return titleMap[seg];
    const cleaned = seg.replace(/^\[|\]$/g, "");
    return cleaned
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
export default function PrivateLayout({ children, hideHome }) {
    const pathname = usePathname() ?? "/";
    const path = pathname.split("?")[0].split("#")[0];

    const segments = useMemo(() => {
        if (path === "/") return [""];
        const segs = path.split("/").filter(Boolean);
        return segs.length ? segs : [""];
    }, [path]);

    const hrefs = useMemo(() => {
        const out = [];
        let acc = "";
        if (segments[0] === "") {
            out.push("/");
            return out;
        }
        out.push("/");
        for (const s of segments) {
            acc += (acc === "/" || acc === "" ? "" : "/") + s;
            out.push(acc === "" ? "/" : acc);
        }
        return out;
    }, [segments]);

    return (
        <>
            <AuthProvider>
                {/* RequireAuth garante que children NÃO sejam mostradas enquanto a sessão está sendo verificada */}
                <RequireAuth>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header
                                className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            {segments.slice(1).map((seg, i) => {
                                                const realIndex = i + 1; // índice real dentro de segments
                                                const isLast = realIndex === segments.length - 1;
                                                const label = humanizeSegment(seg);
                                                const href = hrefs[realIndex] ?? "/";

                                                return (
                                                    <React.Fragment key={`${seg}-${realIndex}`}>
                                                        <BreadcrumbItem className={isLast ? "aria-current" : ""}>
                                                            {isLast ? (
                                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                                            ) : (
                                                                <BreadcrumbLink asChild>
                                                                    <Link href={href}>{label}</Link>
                                                                </BreadcrumbLink>
                                                            )}
                                                        </BreadcrumbItem>

                                                        {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                            </header>

                            <Transl>
                                {children}
                            </Transl>

                        </SidebarInset>
                    </SidebarProvider>
                </RequireAuth>
            </AuthProvider>
        </>
    );
}


