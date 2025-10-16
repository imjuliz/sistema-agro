// "use client"
// import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { AuthPage } from './components/auth/AuthPage';
// import { PublicBlogView } from '@/components/blog/PublicBlogView';
// import { CreateBlog } from '@/components/blog/CreateBlog'; // pode mover para /components/public se quiser

// const AppContent = () => {
//   const { isAuthenticated, user } = useAuth();
//   const [page, setPage] = useState('home');
//   const [showAuth, setShowAuth] = useState(false);

//   // Se quiser mostrar a AuthPage como modal/página separada:
//   if (showAuth) {
//     return <AuthPage />;
//   }

//   const renderMain = () => {
//     switch (page) {
//       case 'home':
//       case 'posts':
//         // PublicBlogView já contém a listagem e a visualização do post por state interno
//         return <PublicBlogView onShowAuth={() => setShowAuth(true)} />;
//       case 'create':
//         return <CreateBlog />;
//       default:
//         return <PublicBlogView onShowAuth={() => setShowAuth(true)} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <h1 className="text-xl font-semibold cursor-pointer" onClick={() => setPage('home')}>Technical Blog</h1>
//             <nav className="flex items-center gap-3">
//               <button
//                 onClick={() => setPage('home')}
//                 className={`text-sm py-1 px-2 rounded ${page === 'home' ? 'bg-muted/20' : 'hover:bg-muted/10'}`}
//               >
//                 Home
//               </button>
//               <button
//                 onClick={() => setPage('posts')}
//                 className={`text-sm py-1 px-2 rounded ${page === 'posts' ? 'bg-muted/20' : 'hover:bg-muted/10'}`}
//               >
//                 Blog Posts
//               </button>
//               <button
//                 onClick={() => setPage('create')}
//                 className={`text-sm py-1 px-2 rounded ${page === 'create' ? 'bg-muted/20' : 'hover:bg-muted/10'}`}
//               >
//                 Create Post
//               </button>
//             </nav>
//           </div>

//           <div>
//             {isAuthenticated ? (
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-muted-foreground">Olá, {user?.name ?? 'User'}</span>
//                 <button
//                   onClick={() => setShowAuth(true)}
//                   className="text-sm text-muted-foreground hover:text-foreground"
//                 >
//                   Conta
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <button
//                   onClick={() => setShowAuth(true)}
//                   className="text-sm text-muted-foreground hover:text-foreground"
//                 >
//                   Sign In
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-8">
//         {renderMain()}
//       </main>
//     </div>
//   );
// };

// export default function blog() {
//   return (
//     <AuthProvider>
//       <div className="size-full">
//         <AppContent />
//       </div>
//     </AuthProvider>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { PublicBlogView } from "@/components/blog/PublicBlogView";
import CreateBlog from "@/components/blog/CreateBlog";
import LoginPage from "@/app/(public)/login/page";

export default function Blog() {
    const [page, setPage] = useState("home");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [perfil, setPerfil] = useState(null);

    // Verifica se o usuário está logado ao carregar
    useEffect(() => {
        const token = localStorage.getItem("token");
        const perfilSalvo = localStorage.getItem("perfil");
        if (token && perfilSalvo) {
            setIsAuthenticated(true);
            setPerfil(perfilSalvo);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Se não estiver autenticado → mostra tela de login
    if (!isAuthenticated) {
        return (

            <LoginPage />
        );
    }

    // Se estiver autenticado → mostra o app normal
    const renderMain = () => {
        switch (page) {
            case "home":
            case "posts":
                return <PublicBlogView />;
            case "create":
                return <CreateBlog />;
            default:
                return <PublicBlogView />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1
                            className="text-xl font-semibold cursor-pointer"
                            onClick={() => setPage("home")}
                        >
                            Technical Blog
                        </h1>
                        <nav className="flex items-center gap-3">
                            <button
                                onClick={() => setPage("home")}
                                className={`text-sm py-1 px-2 rounded ${page === "home" ? "bg-muted/20" : "hover:bg-muted/10"
                                    }`}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setPage("posts")}
                                className={`text-sm py-1 px-2 rounded ${page === "posts" ? "bg-muted/20" : "hover:bg-muted/10"
                                    }`}
                            >
                                Blog Posts
                            </button>
                            <button
                                onClick={() => setPage("create")}
                                className={`text-sm py-1 px-2 rounded ${page === "create" ? "bg-muted/20" : "hover:bg-muted/10"
                                    }`}
                            >
                                Create Post
                            </button>
                        </nav>
                    </div>

                    <div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground capitalize">
                                Perfil: {perfil ?? "usuário"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">{renderMain()}</main>
        </div>
    );
}
