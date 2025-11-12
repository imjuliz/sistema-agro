import { GalleryVerticalEnd } from "lucide-react"
import { ThemeToggle } from "@/components/toggleSwitchTema";
import { CadastrarForm } from "@/components/cadastrar-form"
import {BackgroundBeams} from '@/components/ui/background-beams'

export default function CadastrarPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 dark:bg-black">
      <div className="bg-muted relative hidden lg:block">
             <BackgroundBeams/>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <div className="flex items-center relative z-10"> 
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center rounded-md">
              <img src="/img/ruraltech-logo.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo"/>
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