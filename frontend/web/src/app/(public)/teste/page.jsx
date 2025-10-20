// import OnboardingCompanyFarm from '@/components/UsageSelection/UsageSelection'

// export default function Teste() {

//     return (
//         <>
//             <OnboardingCompanyFarm />;
//         </>
//     )
// }

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/UsageSelection/SideBar";
import { Content } from "@/components/UsageSelection/UsageSelection";

const onboardingSteps = [
 {
    id: "role",
    title: "Função e Caso de Uso",
    completed: false,
    current: true
  },
  {
    id: "template",
    title: "Escolha um Modelo ou Comece do Zero",
    completed: false,
    current: false
  },
  {
    id: "data-source",
    title: "Configuração da Fonte de Dados",
    completed: false,
    current: false
  },
  {
    id: "first-flow",
    title: "Crie Seu Primeiro Fluxo",
    completed: false,
    current: false,
    optional: true
  },
  {
    id: "invite-team",
    title: "Convide Sua Equipe",
    completed: false,
    current: false,
    optional: true
  }
];

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(onboardingSteps);

  const handleContinue = (data) => {
    console.log("Onboarding data:", data);

    // Mark current step as completed and move to next
    const newSteps = steps.map((step, index) => {
      if (index === currentStep) {
        return { ...step, completed: true, current: false };
      }
      if (index === currentStep + 1) {
        return { ...step, current: true };
      }
      return step;
    });

    setSteps(newSteps);
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar steps={steps} />
      </div>

      <Content onContinue={handleContinue} />

      <div className="border-onboarding-option-border fixed right-0 bottom-0 left-0 border-t p-4 lg:hidden">
        <div className="flex items-center justify-center gap-2 ">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-2 w-2 rounded-full transition-colors ",
                step.completed
                  ? "bg-accent"
                  : step.current
                    ? "bg-primary"
                    : "bg-onboarding-option-border"
              )}
            />
          ))}
        </div>
        <div className="mt-2 text-center">
          <span className="text-onboarding-text-muted font-inter text-sm">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}