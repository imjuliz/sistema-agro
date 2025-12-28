"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/NavBar/sidebar";

const titleMap = {
  "": "Início",
  dashboard: "Dashboard",
  perfil: "Perfil",
  empresa: "Empresa",
  aparencia: "Aparência",
  notificacoes: "Notificações",
  fazendas: "Fazendas",
  lojas: "Lojas",
  configuracoes: "Configurações",
  producao: "Produção",
  vendas: "Vendas",
  financeiro: "Financeiro",
  consultarLote: "Consultar Lote"
};

function humanize(seg) {
  if (!seg) return "";
  if (titleMap[seg]) return titleMap[seg];

  const cleaned = seg.replace(/^\[|\]$/g, "");
  return cleaned
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BreadcrumbClient() {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);

  const hrefs = [];
  let acc = "";

  hrefs.push("/");
  for (const s of segments) {
    acc += (acc ? "/" : "") + s;
    hrefs.push("/" + acc);
  }

  return (
    <header className="flex h-16 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 mx-2" />

      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            const href = hrefs[i + 1];
            const label = humanize(seg);

            return (
              <span key={seg + i} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
