import {
    SquareTerminal,
    Settings2,
    Bot,
    BookOpen,
    Bus,
    Map,
    Users,
} from "lucide-react";

export const navConfig = {
    adm: {
        navMain: [
            {
                title: "Painel",
                icon: SquareTerminal,
                items: [
                    { title: "Dashboard", url: "/dashboard" },
                    { title: "Financeiro", url: "/financeiro" },
                    { title: "Usuários", url: "/usuarios" },
                ],
            },
            {
                title: "Configurações",
                icon: Settings2,
                items: [{ title: "Sistema", url: "/configuracoes" }],
            },
        ],
        projects: [],
    },
}