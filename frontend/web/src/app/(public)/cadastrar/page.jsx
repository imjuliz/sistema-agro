import { GalleryVerticalEnd } from "lucide-react"
import { ThemeToggle } from "@/components/toggleSwitchTema";
import { CadastrarForm } from "@/components/cadastrar-form"
import { Component } from "@/components/etheral-shadow";
export default function CadastrarPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        {/* <img src="/placeholder.svg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" /> */}
       <Component/>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <img src="/img/seila.svg" className='absolute top-0 left-0 w-[800px] h-[600px] z-0 -ml-19.5 -mt-10  dark:brightness-[0.0]' alt="Background"/>

        <div className="flex items-center relative z-10"> 
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center rounded-md">
              <img src="/img/logoRuralTech.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo"/>
            </div>
          </a>
          <div className="flex-1"></div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <CadastrarForm />
          </div>
        </div>
      </div>
    </div>
  );
}