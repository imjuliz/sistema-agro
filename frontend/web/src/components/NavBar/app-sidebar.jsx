"use client"
import * as React from "react"
import { AudioWaveform, Vegan, Rabbit, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, ShoppingCart, WalletCards, Tractor, Store, Building2, SquarePen, Container, Boxes, UserCog, SquarePlus, Dog, SquareChartGantt, Folder } from "lucide-react"
import { NavMain } from "@/components/NavBar/nav-main"
import { NavProjects } from "@/components/NavBar/nav-projects"
import { NavUser } from "@/components/NavBar/nav-user"
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/NavBar/sidebar"
import { ThemeToggle } from "@/components/toggleSwitchTema";
import { useAuth } from '@/contexts/AuthContext'


const teamsExample = [
  { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
  { name: "Evil Corp.", logo: Command, plan: "Free" },
]

// ------------------------------
// SWITCH CASE DO PERFIL
// ------------------------------
function normalizePerfil(perfil) {
  if (!perfil) return "";
  if (typeof perfil === "string") return perfil.toUpperCase();
  if (typeof perfil === "object") return String(perfil.funcao ?? perfil.nome ?? "").toUpperCase();
  return "";
}

function getMenuByPerfil(perfil) {
  const perfilKey = normalizePerfil(perfil);
  switch (perfilKey) {
    case "GERENTE_MATRIZ":
      return {
        navMain: [
          {
            title: <Transl>Dashboard</Transl>,
            url: "/matriz/dashboard",
            icon: PieChart,
          },
          {
            title: <Transl>Financeiro</Transl>,
            url: "/matriz/financeiro",
            icon: WalletCards,
          },
          {
            title: <Transl>Configurações</Transl>,
            url: "/matriz/configuracoes",
            icon: Settings2,
          },
        ],
        navMainLabel: <Transl>Geral</Transl>,
        projectsLabel: <Transl>Unidades</Transl>,
        projects: [
          { name: <Transl>Fazendas</Transl>, url: "/matriz/unidades/fazendas", icon: Tractor },
          { name: <Transl>Lojas</Transl>, url: "/matriz/unidades/lojas", icon: Store },
          { name: <Transl>Matriz</Transl>, url: "/matriz/unidades/matriz", icon: Building2 },
        ],
      }

    case "GERENTE_LOJA":
      return {
        navMain: [
          { title: <Transl>Dashboard</Transl>, url: "/loja/dashboard", icon: PieChart, },
          { title: <Transl>Financeiro</Transl>, url: "/loja/vendasDespesas", icon: WalletCards },
          { title: <Transl>Funcionários</Transl>, url: "/loja/funcionarios", icon: UserCog, },
          { title: <Transl>Fornecedores</Transl>, url: "/loja/fornecedores", icon: Container },
          { title: <Transl>Configurações</Transl>, url: "/loja/configuracoes", icon: Settings2, },
        ],
        navMainLabel: <Transl>Geral</Transl>,
        projectsLabel: <Transl>Links rápidos</Transl>,
        projects: [
          { name: <Transl>Frente de Caixa</Transl>, url: "/loja/frenteCaixa", icon: ShoppingCart, },
          { name: <Transl>Estoque</Transl>, url: "/loja/estoque", icon: Boxes },
        ],
      }

    case "GERENTE_FAZENDA":
      return {
        navMain: [
          {
            title: <Transl>Animalia</Transl>,
            url: "/fazenda/animalia",
            icon: Dog,
          },
          {
            title: <Transl>Plantações</Transl>,
            url: "/fazenda/plantio",
            icon: Vegan,
          },
          {
            title: <Transl>Registro de Animais</Transl>,
            url: "/fazenda/animais",
            icon: Folder,
          },
          {
            title: <Transl>Lotes</Transl>,
            url: "/fazenda/lotes",
            icon: SquarePen,
          },
          {
            title: <Transl>Novo</Transl>,
            url: "/fazenda/novaAtividade",
            icon: SquarePlus,
          },
          {
            title: <Transl>Consultar Lote</Transl>,
            url: "/fazenda/consultarLote",
            icon: SquareChartGantt,
          },
          {
            title: <Transl>Configurações</Transl>,
            url: "/fazenda/configuracoes",
            icon: Settings2,
          },
        ],
        navMainLabel: <Transl>Geral</Transl>,
        projectsLabel: <Transl>Fazendas</Transl>,
        projects: [
          { name: <Transl>Estoque</Transl>, url: "/fazenda/estoque", icon: Boxes },
          { name: <Transl>Fornecedores</Transl>, url: "/fazenda/fornecedores", icon: Container, },
          { name: <Transl>Financeiro</Transl>, url: "/fazenda/vendasDespesas", icon: Frame },
        ],
      }

    default:
      return {
        navMain: [
          {
            title: <Transl>Configurações</Transl>,
            url: "/configuracoes",
            icon: Settings2,
            items: [{ title: <Transl>Meu perfil</Transl>, url: "/perfil" }],
          },
        ],
        navMainLabel: <Transl>Geral</Transl>,
        projectsLabel: <Transl>Unidades</Transl>,
        projects: [],
      }
  }
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  console.log("USER NA SIDEBAR →", user);

  const perfil = user?.perfil
  const { navMain, projects, projectsLabel, navMainLabel } = getMenuByPerfil(perfil)

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader className="flex flex-row items-center justify-start p-4 gap-4">
        <img
          src="/img/ruraltech-logo.svg"
          alt="RuralTech Logo"
          className="h-8 w-auto"
        />
        <span className="text-lg  text-gray-900 dark:text-white">
          RuralTech
        </span>
      </SidebarHeader> */}
      <SidebarHeader>
        <TeamSwitcher teams={teamsExample} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} label={navMainLabel} />
        <NavProjects projects={projects} label={projectsLabel} />
        {/* <ThemeToggle /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
