import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/toggleSwitchTema";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { AuthProvider } from "@/contexts/AuthContext";

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-col gap-4 p-6 md:p-10 relative">
            <div className="flex items-center relative z-10">
              <a href="/" className="flex items-center gap-2 font-medium">
                <div className="flex items-center justify-center rounded-md">
                  <img src="/img/logo-ruraltech.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo" />
                </div>
              </a>
              <div className="flex-1"></div><ThemeToggle /></div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs"><LoginForm /></div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block"><StarsBackground /></div>
      </div>
    </AuthProvider>
  );
}


