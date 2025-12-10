"use client"
import * as React from "react"
import { AudioWaveform, Vegan, Rabbit, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, ShoppingCart, WalletCards, Tractor, Store, Building2, SquarePen, Container, Boxes, UserCog, SquarePlus, Dog, SquareChartGantt, Folder } from "lucide-react"
import { NavMain } from "@/components/NavBar/nav-main"
import { NavProjects } from "@/components/NavBar/nav-projects"
import { NavUser } from "@/components/NavBar/nav-user"
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
            title: "Dashboard",
            url: "/matriz/dashboard",
            icon: PieChart,
          },
          {
            title: "Financeiro",
            url: "/matriz/financeiro",
            icon: WalletCards,
          },
          {
            title: "Configurações",
            url: "/matriz/configuracoes",
            icon: Settings2,
            // items: [],
          },
        ],
        navMainLabel: 'Geral',
        projectsLabel: 'Unidades',
        projects: [
          { name: "Fazendas", url: "/matriz/unidades/fazendas", icon: Tractor },
          { name: "Lojas", url: "/matriz/unidades/lojas", icon: Store },
          { name: "Matriz", url: "/matriz/unidades/matriz", icon: Building2 },
        ],
      }

    case "GERENTE_LOJA":
      return {
        navMain: [
          { title: "Dashboard", url: "/loja/dashboard", icon: PieChart, },
          { title: "Financeiro", url: "/loja/vendasDespesas", icon: WalletCards },
          { title: "Funcionários", url: "/loja/funcionarios", icon: UserCog, },
          { title: "Fornecedores", url: "/loja/fornecedores", icon: Container },
          { title: "Configurações", url: "/loja/configuracoes", icon: Settings2, },
        ],
        navMainLabel: 'Geral',
        projectsLabel: 'Links rápidos',
        projects: [
          { name: "Frente de Caixa", url: "/loja/frenteCaixa", icon: ShoppingCart, },
          { name: "Estoque", url: "/loja/estoque", icon: Boxes },
        ],
      }

    case "GERENTE_FAZENDA":
      return {
        navMain: [
          {
            title: "Animalia",
            url: "/fazenda/animalia",
            icon: Dog,
          },
          {
            title: "Plantações",
            url: "/fazenda/plantio",
            icon: Vegan,
          },
          {
            title: "Registro de Animais",
            url: "/fazenda/animais",
            icon: Folder,
          },
          {
            title: "Lotes",
            url: "/fazenda/lotes",
            icon: SquarePen,
          },
          {
            title: "Novo",
            url: "/fazenda/novaAtividade",
            icon: SquarePlus,
          },
          {
            title: "Consultar Lote",
            url: "/fazenda/consultarLote",
            icon: SquareChartGantt,
          },
          {
            title: "Configurações",
            url: "/fazenda/configuracoes",
            icon: Settings2,
            // items: [],
          },
        ],
        navMainLabel: 'Geral',
        projectsLabel: 'Fazendas',
        projects: [
          { name: "Estoque", url: "/fazenda/estoque", icon: Boxes },
          // { name: "Configurações", url: "/fazenda/configuracoes", icon: Frame },
          { name: "Fornecedores", url: "/fazenda/fornecedores", icon: Container, },
          { name: "Financeiro", url: "/fazenda/vendasDespesas", icon: Frame },
        ],
      }

    default:
      return {
        navMain: [
          {
            title: "Configurações",
            url: "/configuracoes",
            icon: Settings2,
            items: [{ title: "Meu perfil", url: "/perfil" }],
          },
        ],
        navMainLabel: 'Geral',
        projectsLabel: 'Unidades',
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
