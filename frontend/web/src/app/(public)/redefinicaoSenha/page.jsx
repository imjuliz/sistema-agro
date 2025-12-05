import { Suspense } from "react";
import { GalleryVerticalEnd } from "lucide-react"
import { RedefinirForm } from "@/components/esqueci-form";

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

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-col gap-4 p-6 md:p-10 relative">

          <div className="flex items-center relative z-10">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="flex items-center justify-center rounded-md">
                <img src="/img/ruraltech-logo.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo"/>
              </div>
            </a>
            <div className="flex-1"></div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RedefinirFormWrapper />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="img/img.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:greenscale" />
      </div>
    </div>
  );
}


