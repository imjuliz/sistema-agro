import { Suspense } from "react";
import { GalleryVerticalEnd } from "lucide-react"
import { RedefinirForm } from "@/components/esqueci-form";
import { Particles } from "@/components/ui/particles"

function RedefinirFormWrapper() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-5">Redefinição de senha</h1>
          <p className="text-muted-foreground text-1sm text-balance mb-15">Carregando...</p>
        </div>
      </div>
    }>
      <RedefinirForm />
    </Suspense>
  );
}

export default function RedefinicaoSenhaPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden bg-background/75 dark:bg-background/70">
      {/* Particles ocupando toda a tela atrás */}
      <div className="fixed inset-0 z-0">
        <Particles 
          className="w-full h-full" 
          color="#4a5568"
          quantity={100}
        />
      </div>
      
      {/* Conteúdo na frente */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center text-xl font-bold">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <img src="/img/ruraltech-logo.svg" className='h-6 dark:brightness-[0.9]' alt="RuralTech Logo" />
          </div>
          RuralTech
        </a>
        <RedefinirFormWrapper />
      </div>
    </div>
  );
}