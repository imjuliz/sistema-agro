'use client';

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

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

import { AuthProvider } from "@/contexts/AuthContext";

export default function PrivateLayout({ children }) {
    return (
        <>
        <AuthProvider>
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
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <Transl>
                        {children}
                    </Transl>

                </SidebarInset>
            </SidebarProvider>
            </AuthProvider>
        </>
    );
}


