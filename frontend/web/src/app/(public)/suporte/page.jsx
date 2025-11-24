//uma página de termos de uso com indice para rapida navegação
"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";

export default function Suporte() {
    const [mensagem, setMensagem] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [ok, setOk] = useState(false);

    async function enviar() {
        setEnviando(true);

        const req = await fetch("/api/enviar-duvida", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem }),
        });

        const res = await req.json();
        setEnviando(false);

        if (res.sucesso) {
            setOk(true);
            setMensagem("");
        }
    }
    return (
        <>
            <main className=' open-sans text-lg flex  justify-center pt-[150px] pb-[150px] bg-stone-250 dark:bg-stone-950 '>
                <div className="flex flex-col gap-5 lg:w-240 md:w-150 sm:w-100 w-100">
                    <h1 className='archivo-black-regular text-5xl'>Suporte</h1>
                    <div className="  flex flex-col">
                        <h2 className="text-2xl font-bold ">Perguntas Frequentes</h2>
                        <Accordion type="single" collapsible className="w-full " defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg">Como faço para cadastrar minha fazenda no sistema?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                                    <p>Você pode cadastrar sua fazenda na seção de cadastro, preenchendo os dados solicitados sobre a propriedade e o tipo de atividade agropecuária.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg">Como acessar os relatórios de monitoramento?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                                    <p>Os relatórios ficam disponíveis na área de “Relatórios” do painel, onde você pode filtrar por data, local e tipo de dado.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg">O que fazer em caso de perda de senha?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                                    <p>Clique no link “Esqueci minha senha” na tela de login para receber um email com instruções para redefinição.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg">É possível acessar o sistema via celular?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                                    <p>Sim, nosso sistema é responsivo e pode ser acessado por navegadores móveis ou aplicativos dedicados.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-lg">É possível acompanhar as vendas e o estoque das unidades comerciais?</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance text-lg">
                                    <p>Sim, o sistema registra entradas, saídas, preços, despesas e gera relatórios detalhados para ajudar na gestão financeira das unidades de venda.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    {/* envie sua duvida */}
                    <div>
                        <h2 className="text-2xl font-bold pb-5">Envie sua dúvida</h2>
                        <div className="grid w-full gap-5">
                            <Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Escreva sua dúvida aqui" className="h-100 !text-lg"/>
                            <Button disabled={enviando} onClick={enviar} className="!text-lg">
                                {enviando ? "Enviando..." : "Enviar"}
                            </Button>
                            {ok && <p className="text-green-600">Sua dúvida foi enviada!</p>}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}