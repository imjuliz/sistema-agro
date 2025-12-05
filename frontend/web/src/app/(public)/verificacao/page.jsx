import { Suspense } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import Verific from "@/components/otp-input";

function VerificWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="w-full h-full rounded-2xl border p-8 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Verificar código</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <Verific />
    </Suspense>
  );
}

export default function verificacao() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white dark:bg-black">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-col gap-4 p-6 md:p-10 relative">
      <div className="flex items-center relative z-10">
        <a href="/" className="flex items-center gap-2 font-medium">
          <div className="flex items-center justify-center rounded-md">
            <img src="/img/ruraltech-logo.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo" />
          </div>
        </a>
        <div className="flex-1"></div>
      </div>
    </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="w-full max-w-xs">
              <VerificWrapper />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img src="/placeholder.svg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
