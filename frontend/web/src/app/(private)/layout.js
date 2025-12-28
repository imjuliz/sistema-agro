import { AppSidebar } from "@/components/NavBar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/NavBar/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import BreadcrumbClient from "@/components/BreadcrumbClient";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <RequireAuth>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>

            <BreadcrumbClient />

            {children}
          </SidebarInset>
        </SidebarProvider>
      </RequireAuth>
    </AuthProvider>
  );
}
