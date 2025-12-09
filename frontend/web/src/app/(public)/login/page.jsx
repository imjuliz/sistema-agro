// import { GalleryVerticalEnd } from "lucide-react"
// import { LoginForm } from "@/components/login-form"

// export default function LoginPage() {
//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex flex-col gap-4 p-6 md:p-10 relative">
//           <div className="flex items-center relative z-10">
//             <a href="/" className="flex items-center gap-2 font-medium">
//               <div className="flex items-center justify-center rounded-md">
//                 <img src="/img/ruraltech-logo.svg" className='w-80 h-20 dark:brightness-[0.9]' alt="RuralTech Logo" />
//               </div>
//             </a>
//             </div>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs"><LoginForm /></div>
//         </div>
//       </div>
//       {/* <div className="bg-muted relative hidden lg:block"><StarsBackground /></div> */}
//     </div>
//   );
// }

import { LoginForm } from "@/components/login-form"
import { Particles } from "@/components/ui/particles"

export default function LoginPage() {
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
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <img src="/img/ruraltech-logo.svg" className='h-6 dark:brightness-[0.9]' alt="RuralTech Logo" />
          </div>
          RuralTech
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
