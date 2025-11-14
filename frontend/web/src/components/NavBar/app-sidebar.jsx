"use client"
import * as React from "react"
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal, } from "lucide-react"
import { NavMain } from "@/components/NavBar/nav-main"
import { NavProjects } from "@/components/NavBar/nav-projects"
import { NavUser } from "@/components/NavBar/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/NavBar/sidebar"
import { ThemeToggle } from "@/components/toggleSwitchTema";
import { useAuth } from '@/contexts/AuthContext'

// This is sample data.
// const data = {
//   user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg", },
//   teams: [
//     { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise", },
//     { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup", },
//     { name: "Evil Corp.", logo: Command, plan: "Free", },
//   ],
//   navMain: [
//     {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         { title: "History", url: "#", },
//         { title: "Starred", url: "#", },
//         { title: "Settings", url: "#", },
//       ],
//     },
//     {
//       title: "Models",
//       url: "#",
//       icon: Bot,
//       items: [
//         { title: "Genesis", url: "#", },
//         { title: "Explorer", url: "#", },
//         { title: "Quantum", url: "#", },
//       ],
//     },
//     {
//       title: "Documentation",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         { title: "Introduction", url: "#", },
//         { title: "Get Started", url: "#", },
//         { title: "Tutorials", url: "#", },
//         { title: "Changelog", url: "#", },
//       ],
//     },
//     {
//       title: "Configurações",
//       url: "#",
//       icon: Settings2,
//       items: [
//         { title: "Meu perfil", url: "#", },
//         { title: "Minha empresa", url: "#", },
//         // {
//         //   title: "Billing",
//         //   url: "#",
//         // },
//         // {
//         //   title: "Limits",
//         //   url: "#",
//         // },
//       ],
//     },
//   ],
//   projects: [
//     { name: "Fazendas", url: "#", icon: Frame, },
//     { name: "Lojas", url: "#", icon: PieChart, },
//     // {
//     //   name: "Travel",
//     //   url: "#",
//     //   icon: Map,
//     // },
//   ],
// }

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
            icon: PieChart,
          },
          {
            title: "Configurações",
            url: "/matriz/configuracoes",
            icon: Settings2,
            // items: [],
          },
        ],
        projects: [
          { name: "Fazendas", url: "/matriz/unidades/fazendas", icon: Frame },
          { name: "Lojas", url: "/matriz/unidades/lojas", icon: PieChart },
        ],
      }

    case "GERENTE_LOJA":
      return {
        navMain: [
          {
            title: "Vendas",
            url: "/vendas",
            icon: SquareTerminal,
          },
        ],
        projects: [
          { name: "Estoque", url: "/estoque", icon: Frame },
        ],
      }

    case "GERENTE_FAZENDA":
      return {
        navMain: [
          {
            title: "Safras",
            url: "/safras",
            icon: Map,
          },
        ],
        projects: [
          { name: "Fazenda", url: "/fazenda", icon: Frame },
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
  console.log("USER NA SIDEBAR →", user);

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
