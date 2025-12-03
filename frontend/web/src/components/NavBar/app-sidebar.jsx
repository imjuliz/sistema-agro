"use client"
import * as React from "react"
import { AudioWaveform, Vegan, Rabbit, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, ShoppingCart, WalletCards, Tractor, Store, Building2, SquarePen, Container, Boxes, UserCog } from "lucide-react"
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
function getMenuByPerfil(perfil) {
  switch (perfil) {
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
        projects: [
          { name: "Fazendas", url: "/matriz/unidades/fazendas", icon: Tractor },
          { name: "Lojas", url: "/matriz/unidades/lojas", icon: Store },
          { name: "Matriz", url: "/matriz/unidades/matriz", icon: Building2 },
        ],
      }

    case "GERENTE_LOJA":
      return {
        navMain: [
          {
            title: "Dashboard",
            url: "/loja/dashboard",
            icon: PieChart,
          },
          {
            title: "Frente de Caixa",
            url: "/loja/frenteCaixa",
            icon: ShoppingCart,
          },
          {
            title: "Funcionários",
            url: "/loja/funcionarios",
            icon: UserCog,
          },
          {
            title: "Configurações",
            url: "/loja/configuracoes",
            icon: Settings2,
            // items: [],
          },
        ],
        projects: [
          { name: "Estoque", url: "/loja/estoque", icon: Boxes },
          { name: "Financeiro", url: "/loja/vendasDespesas", icon: WalletCards },
          { name: "Fornecedores", url: "/loja/fornecedores", icon: Container },
        ],
      }

    case "GERENTE_FAZENDA":
      return {
        navMain: [
          {
            title: "Dashboard",
            url: "/fazenda/dashboard",
            icon: PieChart,
          },
          {
            title: "Animais",
            url: "/fazenda/animalia",
            icon: Rabbit,
          },
          {
            title: "Plantação",
            url: "/fazenda/plantio",
            icon: Vegan,
          },
          {
            title: "Atividades",
            url: "/fazenda/atividades",
            icon: SquarePen,
          },
          {
            title: "Nova Atividade",
            url: "/fazenda/novaAtividade",
            icon: Container,
          },
          {
            title: "Configurações",
            url: "/fazenda/configuracoes",
            icon: Settings2,
            // items: [],
          },
        ],
        projects: [
          { name: "Estoque", url: "/fazenda/estoque", icon: Boxes },
          { name: "Configurações", url: "/fazenda/configuracoes", icon: Frame },
          { name: "Fornecedores", url: "/fazenda/fornecedores", icon: Container, },
          { name: "Financeiro", url: "/fazenda/vendasDespesas", icon: Frame },
          { name: "Suporte", url: "/fazenda/configuracoes", icon: Frame },
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
        projects: [],
      }
  }
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  // console.log("USER NA SIDEBAR →", user);

  const perfil = user?.perfil
  const { navMain, projects } = getMenuByPerfil(perfil)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsExample} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
        {/* <ThemeToggle /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
