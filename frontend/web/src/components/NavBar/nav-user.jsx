"use client"
import { useRouter } from "next/navigation";
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/NavBar/sidebar"
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // console.log('NavUser - user:', user, 'loading:', loading);

  const handleLogout = async () => {
    try {
      await logout();         // chama o logout do AuthContext (POST /auth/logout + limpa estado)
      router.push("/login");  // redireciona para login 
    } catch (err) {
      console.error("Erro no logout:", err);
      router.push("/login");
    }
  };

  const currentUser = user ?? null;

  // useEffect sempre no topo (ordem de hooks preservada)
  useEffect(() => {
    // quando carregou (não loading) e não há usuário, redireciona
    if (!loading && !currentUser) {
      // replace evita empilhar várias entradas no histórico
      router.replace("/login");
    }
  }, [loading, currentUser, router]);

  // Skeleton enquanto refresh/carregamento acontece
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden">
              <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Se não há usuário: o effect já chamou replace(); aqui retornamos null para evitar renderar árvore diferente
  if (!currentUser) {
    // retornamos um placeholder vazio — o efeito já fará a navegação
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.nome?.[0]?.toUpperCase() ?? "N/I"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.nome?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.nome}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left">
                <LogOut />
                Sair
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
