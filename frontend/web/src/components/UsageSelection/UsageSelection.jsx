// "use client";

// import { useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   User,
//   Briefcase,
//   MapPin,
//   Mail,
//   FileText,
//   Users,
//   ClipboardList
// } from "lucide-react";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";

// // Onboarding steps adapted for Empresa (Matriz) and Dono/Proprietário de Fazenda
// const steps = [
//   { id: 1, title: "Como pretende usar o sistema?", description: "Escolha seu perfil" },
//   { id: 2, title: "Dados iniciais", description: "Informações da sua organização ou fazenda" },
//   { id: 3, title: "Unidades & Mapas", description: "Adicione fazendas/lojas ou talhões" },
//   { id: 4, title: "Convidar equipe", description: "Adicione colaboradores essenciais" },
//   { id: 5, title: "Finalizar", description: "Revise e acesse o painel" }
// ];

// export default function OnboardingCompanyFarm() {
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     // escolha inicial
//     profile: "company", // 'company' | 'farm'

//     // company fields
//     orgName: "",
//     orgType: "Empresa",
//     cnpj: "",
//     plan: "trial",

//     // farm fields
//     farmName: "",
//     municipality: "",
//     areaHa: "",
//     mainCrop: "",

//     // import placeholders
//     unitsFileName: "",
//     plotsFileName: "",

//     // invites (comma-separated emails)
//     invites: "",

//     // flags
//     skipImports: false
//   });

//   const updateFormData = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNext = () => {
//     // Basic validation for key steps
//     if (currentStep === 1) {
//       // nothing required — user already has default
//       setCurrentStep(2);
//       return;
//     }

//     if (currentStep === 2) {
//       if (formData.profile === "company") {
//         if (!formData.orgName) {
//           alert("Por favor, informe o nome da organização.");
//           return;
//         }
//       } else {
//         if (!formData.farmName) {
//           alert("Por favor, informe o nome da fazenda.");
//           return;
//         }
//       }
//     }

//     if (currentStep < steps.length) setCurrentStep(currentStep + 1);
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const handleFileSelect = (e, fieldName) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       updateFormData(fieldName, file.name);
//     }
//   };

//   const handleFinish = () => {
//     // Assemble payload depending on profile. In a real app, call an API endpoint here.
//     const payload = {
//       profile: formData.profile,
//       ...(formData.profile === "company"
//         ? {
//             orgName: formData.orgName,
//             orgType: formData.orgType,
//             cnpj: formData.cnpj,
//             plan: formData.plan,
//             unitsFileName: formData.unitsFileName
//           }
//         : {
//             farmName: formData.farmName,
//             municipality: formData.municipality,
//             areaHa: formData.areaHa,
//             mainCrop: formData.mainCrop,
//             plotsFileName: formData.plotsFileName
//           }),
//       invites: formData.invites
//     };

//     console.log("Onboarding payload:", payload);
//     // simulate success
//     setCurrentStep(5);
//   };

//   const renderProfileSelection = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>Como você pretende usar o sistema?</CardTitle>
//         <CardDescription>Escolha a opção que melhor representa seu papel. Você pode editar isso depois.</CardDescription>
//       </CardHeader>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => updateFormData("profile", "company")}
//           className={cn(
//             "cursor-pointer transition-all",
//             formData.profile === "company"
//               ? "bg-muted border-purple-500 ring-2 ring-purple-500"
//               : "border-gray-200 hover:shadow-md"
//           )}>
//           <CardContent className="flex items-start space-x-4 p-6">
//             <div className="flex-shrink-0">
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
//                 <Briefcase className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-muted-foreground mb-1 font-semibold">Empresa / Matriz</h3>
//               <p className="text-muted-foreground text-sm">
//                 Gerencie múltiplas fazendas e filiais com consolidação de relatórios e regras
//                 centralizadas.
//               </p>
//             </div>
//           </CardContent>
//         </div>

//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => updateFormData("profile", "farm")}
//           className={cn(
//             "cursor-pointer transition-all",
//             formData.profile === "farm"
//               ? "bg-muted border-purple-500 ring-2 ring-purple-500"
//               : "border-gray-200 hover:shadow-md"
//           )}>
//           <CardContent className="flex items-start space-x-4 p-6">
//             <div className="flex-shrink-0">
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
//                 <MapPin className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-muted-foreground mb-1 font-semibold">Dono / Proprietário de fazenda</h3>
//               <p className="text-muted-foreground text-sm">
//                 Gerencie uma fazenda (ou poucas) com foco em produção, controle de custos e
//                 operações de campo.
//               </p>
//             </div>
//           </CardContent>
//         </div>
//       </div>
//     </div>
//   );

//   const renderCompanyForm = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>Dados da organização</CardTitle>
//         <CardDescription>Informações básicas da sua Empresa / Matriz.</CardDescription>
//       </CardHeader>

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="orgName">Nome da organização</Label>
//           <Input
//             id="orgName"
//             placeholder="Ex.: AgroX S/A"
//             className="mt-2"
//             value={formData.orgName}
//             onChange={(e) => updateFormData("orgName", e.target.value)}
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           {/* <div>
//             <Label htmlFor="orgType">Tipo</Label>
//             <Input
//               id="orgType"
//               placeholder="Empresa, Cooperativa, Integrador"
//               className="mt-2"
//               value={formData.orgType}
//               onChange={(e) => updateFormData("orgType", e.target.value)}
//             />
//           </div> */}
//           <div>
//             <Label htmlFor="cnpj">CNPJ (opcional)</Label>
//             <Input
//               id="cnpj"
//               className="mt-2"
//               value={formData.cnpj}
//               onChange={(e) => updateFormData("cnpj", e.target.value)}
//             />
//           </div>
//           {/* <div>
//             <Label htmlFor="plan">Plano</Label>
//             <select
//               id="plan"
//               value={formData.plan}
//               onChange={(e) => updateFormData("plan", e.target.value)}
//               className="mt-2 w-full rounded border p-2">
//               <option value="trial">Trial 30 dias</option>
//               <option value="basic">Básico</option>
//               <option value="pro">Profissional</option>
//             </select>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );

//   const renderFarmForm = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>Dados da fazenda</CardTitle>
//         <CardDescription>Vamos criar sua fazenda rapidamente.</CardDescription>
//       </CardHeader>

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="farmName">Nome da fazenda</Label>
//           <Input
//             id="farmName"
//             placeholder="Ex.: Fazenda Boa Vista"
//             className="mt-2"
//             value={formData.farmName}
//             onChange={(e) => updateFormData("farmName", e.target.value)}
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           <div>
//             <Label htmlFor="municipality">Município</Label>
//             <Input
//               id="municipality"
//               className="mt-2"
//               value={formData.municipality}
//               onChange={(e) => updateFormData("municipality", e.target.value)}
//             />
//           </div>
//           <div>
//             <Label htmlFor="areaHa">Área aproximada (ha)</Label>
//             <Input
//               id="areaHa"
//               className="mt-2"
//               value={formData.areaHa}
//               onChange={(e) => updateFormData("areaHa", e.target.value)}
//             />
//           </div>
//           <div>
//             <Label htmlFor="mainCrop">Cultura principal</Label>
//             <Input
//               id="mainCrop"
//               className="mt-2"
//               value={formData.mainCrop}
//               onChange={(e) => updateFormData("mainCrop", e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderUnitsImport = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>{formData.profile === "company" ? "Adicionar unidades" : "Talhões / Plots"}</CardTitle>
//         <CardDescription>
//           {formData.profile === "company"
//             ? "Importe fazendas/filiais em massa (CSV / KML) ou adicione manualmente."
//             : "Importe shapefiles/KML com seus talhões ou desenhe no mapa (se disponível)."}
//         </CardDescription>
//       </CardHeader>

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="fileImport">Upload (CSV / KML / GeoJSON)</Label>
//           <input
//             id="fileImport"
//             type="file"
//             accept=".csv,.kml,.geojson,.zip"
//             onChange={(e) => handleFileSelect(e, formData.profile === "company" ? "unitsFileName" : "plotsFileName")}
//             className="mt-2"
//           />
//           <p className="mt-2 text-sm text-gray-500">Arquivo atual: {formData.profile === "company" ? formData.unitsFileName || "nenhum" : formData.plotsFileName || "nenhum"}</p>
//         </div>

//         <div className="flex items-center space-x-3">
//           <input
//             id="skipImports"
//             type="checkbox"
//             checked={formData.skipImports}
//             onChange={(e) => updateFormData("skipImports", e.target.checked)}
//           />
//           <label htmlFor="skipImports" className="text-sm text-gray-600">Pular importação por enquanto</label>
//         </div>

//         <div className="text-sm text-gray-500">
//           Se você não tiver arquivos agora, tudo bem — poderá adicionar talhões e unidades depois pelo painel.
//         </div>
//       </div>
//     </div>
//   );

//   const renderInvites = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>Convidar equipe</CardTitle>
//         <CardDescription>Convide pessoas essenciais (gerente, operador, técnico). Separe e-mails por vírgula.</CardDescription>
//       </CardHeader>

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="invites">E-mails para convidar</Label>
//           <Input
//             id="invites"
//             placeholder="ex: joao@ex.com, maria@ex.com"
//             className="mt-2"
//             value={formData.invites}
//             onChange={(e) => updateFormData("invites", e.target.value)}
//           />
//           <p className="mt-2 text-sm text-gray-500">Você poderá atribuir papéis e escopos após o aceite dos convites.</p>
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           <div className="flex items-center space-x-2">
//             <Users className="h-5 w-5 text-gray-400" />
//             <div>
//               <div className="text-sm font-medium">Recomendado: 1 Org Admin</div>
//               <div className="text-xs text-gray-500">Pessoa responsável por aprovações e billing</div>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <ClipboardList className="h-5 w-5 text-gray-400" />
//             <div>
//               <div className="text-sm font-medium">Gerentes e Operadores</div>
//               <div className="text-xs text-gray-500">Gerenciar operações e registrar tarefas no campo</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderReview = () => (
//     <div className="space-y-6">
//       <CardHeader className="px-0 pt-0">
//         <CardTitle>Revise e finalize</CardTitle>
//         <CardDescription>Confira as informações antes de criar o espaço.</CardDescription>
//       </CardHeader>

//       <div className="space-y-4">
//         <div className="rounded border p-4">
//           <div className="text-sm text-gray-600">Perfil selecionado</div>
//           <div className="mt-1 font-medium">{formData.profile === "company" ? "Empresa / Matriz" : "Dono de fazenda"}</div>
//         </div>

//         {formData.profile === "company" ? (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div className="rounded border p-4">
//               <div className="text-sm text-gray-600">Organização</div>
//               <div className="mt-1 font-medium">{formData.orgName || "—"}</div>
//               <div className="text-xs text-gray-500 mt-1">Tipo: {formData.orgType || "—"} • Plano: {formData.plan}</div>
//             </div>
//             <div className="rounded border p-4">
//               <div className="text-sm text-gray-600">Importações</div>
//               <div className="mt-1 font-medium">Units: {formData.unitsFileName || "nenhum"}</div>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div className="rounded border p-4">
//               <div className="text-sm text-gray-600">Fazenda</div>
//               <div className="mt-1 font-medium">{formData.farmName || "—"}</div>
//               <div className="text-xs text-gray-500 mt-1">{formData.municipality || "—"} • {formData.areaHa || "—"} ha</div>
//             </div>
//             <div className="rounded border p-4">
//               <div className="text-sm text-gray-600">Importações</div>
//               <div className="mt-1 font-medium">Plots: {formData.plotsFileName || "nenhum"}</div>
//             </div>
//           </div>
//         )}

//         <div className="rounded border p-4">
//           <div className="text-sm text-gray-600">Convites</div>
//           <div className="mt-1 font-medium">{formData.invites || "nenhum"}</div>
//         </div>

//         <div className="text-sm text-gray-500">Ao finalizar, iremos criar sua organização/fazenda e enviar convites para os e-mails informados. Você poderá completar a configuração pelo painel.</div>

//         <div className="flex items-center space-x-3">
//           <Button onClick={handleFinish}>Finalizar e ir para o painel</Button>
//           <Button variant="outline" onClick={() => setCurrentStep(1)}>Voltar ao início</Button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return renderProfileSelection();
//       case 2:
//         return formData.profile === "company" ? renderCompanyForm() : renderFarmForm();
//       case 3:
//         return renderUnitsImport();
//       case 4:
//         return renderInvites();
//       case 5:
//         return (
//           <div className="space-y-6">
//             <CardHeader className="px-0 pt-0">
//               <CardTitle>Pronto — tudo configurado!</CardTitle>
//               <CardDescription>Seu espaço foi criado. Vamos ao painel.</CardDescription>
//             </CardHeader>

//             <div className="space-y-4">
//               <p className="text-gray-700">Parabéns — seu onboarding está completo. Use o painel para continuar a configuração.</p>

//               <div className="flex items-center space-x-3">
//                 <Button onClick={() => window.location.href = "/dashboard"}>Ir para o painel</Button>
//                 <Button variant="outline" onClick={() => {/* perhaps open tutorial */}}>Ver tour</Button>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex items-center justify-center p-4">
//       <Card className="w-full max-w-4xl shadow-lg">
//         <CardHeader className="pb-0">
//           <div className="mb-6 flex items-center justify-between">
//             {steps.map((step) => (
//               <div key={step.id} className="relative flex flex-1 flex-col items-center">
//                 <div
//                   className={cn(
//                     "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300",
//                     currentStep > step.id
//                       ? "bg-purple-600 text-white"
//                       : currentStep === step.id
//                         ? "bg-purple-500 text-white"
//                         : "bg-gray-200 text-gray-600"
//                   )}>
//                   {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
//                 </div>
//                 <div className={cn("mt-2 text-center text-sm font-medium", currentStep >= step.id ? "text-gray-800" : "text-gray-500")}>{step.title}</div>
//                 {step.id < steps.length && (
//                   <div className={cn("absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] -translate-y-1/2 bg-gray-200 transition-colors duration-300", currentStep > step.id && "bg-purple-400")} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardHeader>

//         <CardContent className="p-6 md:p-8">
//           {renderStepContent()}

//           <div className="mt-8 flex items-center justify-between border-t pt-6">
//             <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
//               <ChevronLeft className="h-4 w-4" />
//               <span>Anterior</span>
//             </Button>

//             {currentStep < steps.length ? (
//               <Button onClick={currentStep === steps.length - 1 ? handleFinish : handleNext}>
//                 <span>{currentStep === steps.length - 1 ? "Concluir" : "Próximo"}</span>
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             ) : null}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

const roles = [
  { id: "product-manager", label: "Product Manager" },
  { id: "developer", label: "Developer" },
  { id: "designer", label: "Designer" },
  { id: "ops", label: "Ops" },
  { id: "founder", label: "Founder" },
  { id: "other", label: "Other" }
];

const automationOptions = [
  { id: "data-collection", label: "Data collection & processing" },
  { id: "emails", label: "Sending emails or messages" },
  { id: "dashboard", label: "Dashboard updates" },
  { id: "repetitive-tasks", label: "Repetitive internal tasks" },
  { id: "ai-assistant", label: "Building your own AI assistant" },
  { id: "other", label: "Other" }
];

export const Content = ({ onContinue }) => {
  const [selectedRole, setSelectedRole] = useState("product-manager");
  const [selectedAutomation, setSelectedAutomation] = useState([
    "data-collection",
    "repetitive-tasks"
  ]);

  const toggleAutomation = (option) => {
    setSelectedAutomation((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleContinue = () => {
    onContinue({
      role: selectedRole,
      automation: selectedAutomation
    });
  };

  return (
    <div className="min-h-screen flex-1 p-8 lg:p-16">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-foreground mb-4 text-3xl leading-tight font-semibold lg:text-4xl">
            Vamos personalizar sua experiência
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Conte-nos um pouco sobre você para que possamos adaptar os modelos, sugestões e recursos às suas necessidades.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-12">
          <h4 className="text-foreground mb-8 text-xl">Qual das opções descreve melhor o seu cargo?</h4>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "font-inter rounded-lg border p-4 text-left font-medium transition-all duration-200 hover:shadow-sm",
                  selectedRole === role.id
                    ? "border-[#99BF0F]"
                    : "border-onboarding-option-border text-foreground hover:border-onboarding-option-border/60"
                )}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      selectedRole === role.id ? "bg-[#99BF0F]" : "bg-onboarding-option-border"
                    )}></div>
                  {role.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Automation Selection */}
        <div className="mb-16">
          <h4 className="text-foreground mb-8 text-xl">O que você gostaria de automatizar primeiro?</h4>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {automationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleAutomation(option.id)}
                className={cn(
                  "font-inter rounded-lg border p-4 text-left font-medium transition-all duration-200 hover:shadow-sm",
                  selectedAutomation.includes(option.id)
                    ? "border-[#99BF0F]"
                    : "border-onboarding-option-border text-foreground hover:border-onboarding-option-border/60"
                )}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      selectedAutomation.includes(option.id)
                        ? "bg-[#99BF0F]"
                        : "bg-onboarding-option-border"
                    )}></div>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center w-fit">
          <Button onClick={handleContinue} className="flex w-full justify-between" size="lg">
            Continuar
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};