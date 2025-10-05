// // Página de Gestão Financeira: Consolidar finanças da empresa.
// // Layout: Dashboard financeiro (receitas, despesas, lucro líquido). Gráficos de evolução financeira.
// // Funcionalidades: Consultar relatórios por unidade. Comparar lucratividade entre fazendas e lojas. Exportar relatórios (PDF/Excel). Importar dados contábeis 
// "use client"
// import React, { useMemo, useState } from "react";
// import { Download, Eye, FileText, AlertCircle, CheckCircle2, Filter, RefreshCw, ClipboardList, ShieldCheck, Columns3, History, Send, UserCheck, CalendarDays, Lock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

// // ===== helpers =====
// const ROLES = ["Chefe Almox", "Gestor", "Contábil", "Financeiro", "Auditor"];
// const PERMISSIONS = {
//   "Chefe Almox":   { exportar:true, atualizarSIGGO:true, tratar:true, justificarSIGGO:false, notificarContabil:true, notificarFinanceiro:true, marcarResolvido:true, emitirOficial:false, calendário:true },
//   Gestor:           { exportar:true, atualizarSIGGO:true, tratar:true, justificarSIGGO:true,  notificarContabil:true, notificarFinanceiro:true, marcarResolvido:true, emitirOficial:true,  calendário:true },
//   Contábil:         { exportar:true, atualizarSIGGO:false,tratar:true, justificarSIGGO:true,  notificarContabil:true, notificarFinanceiro:false,marcarResolvido:true, emitirOficial:false, calendário:false },
//   Financeiro:       { exportar:true, atualizarSIGGO:false,tratar:true, justificarSIGGO:false, notificarContabil:false,notificarFinanceiro:true, marcarResolvido:true, emitirOficial:false, calendário:false },
//   Auditor:          { exportar:true, atualizarSIGGO:false,tratar:false,justificarSIGGO:false, notificarContabil:false,notificarFinanceiro:false,marcarResolvido:false,emitirOficial:false, calendário:false },
// };
// const can = (role, action) => !!PERMISSIONS[role]?.[action];

// const fmtBR = (iso) => new Date(iso + (iso.length===7?"-01":"")).toLocaleDateString("pt-BR");
// const brl = (v) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
// function simpleHash(input){ let h=0x811c9dc5>>>0; for(let i=0;i<input.length;i++){ h^=input.charCodeAt(i); h=(h+(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24))>>>0;} return ("00000000"+h.toString(16)).slice(-8).toUpperCase(); }

// function classifyDivergence(r){
//   const dif = r.saldoESUPRI - r.saldoSIGGO;
//   if (Math.abs(dif) < 0.009) return null;
//   const entradas = r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM;
//   const saidas   = r.saidaPIM + r.saidaBaixas;
//   if (dif > 0 && entradas > 0 && r.estornoEntrada === 0) return "Entrada a maior (e‑Supri)";
//   if (dif < 0 && saidas > 0 && r.estornoSaida === 0) return "Saída não baixada (SIGGO)";
//   const movimentou = (entradas + saidas + (r.transfEntrada||0) + (r.transfSaida||0) + (r.estornoEntrada||0) + (r.estornoSaida||0)) !== 0;
//   if (!movimentou) return "Saldo inicial divergente";
//   return dif > 0 ? "Valor a maior (e‑Supri)" : "Valor a menor (e‑Supri)";
// }

// // ===== Base model data (mock) =====
// const baseRows = [
//   { codigo: "3004", descricao: "Material de Expediente", saldoAnterior: 0.00, entradaOrcTesouro: 3160.00, entradaOrcFundo: 0.00, entradaExtraTesouro: 0.00, entradaExtraFundo: 0.00, dacaoPagamento: 0.00, fundoConstitucional: 0.00, doacao: 0.00, devolucaoTDM: 0.00, saidaPIM: 0.00, saidaBaixas: 0.00, transfEntrada: 0.00, transfSaida: 0.00, estornoEntrada: 0.00, estornoSaida: 0.00, saldoSIGGO: 18251.00, saldoESUPRI: 18251.00, tipoDivergencia: null },
//   { codigo: "3007", descricao: "Combustíveis e Lubrificantes", saldoAnterior: 28193.10, entradaOrcTesouro: 44746.05, entradaOrcFundo: 0.00, entradaExtraTesouro: 0.00, entradaExtraFundo: 0.00, dacaoPagamento: 0.00, fundoConstitucional: 0.00, doacao: 0.00, devolucaoTDM: 0.00, saidaPIM: 0.00, saidaBaixas: 0.00, transfEntrada: 0.00, transfSaida: 0.00, estornoEntrada: 0.00, estornoSaida: 0.00, saldoSIGGO: 309857.07, saldoESUPRI: 307947.74, tipoDivergencia: null },
//   { codigo: "3064", descricao: "Equipamentos de Proteção", saldoAnterior: 154242.67, entradaOrcTesouro: 3213.00, entradaOrcFundo: 0.00, entradaExtraTesouro: 0.00, entradaExtraFundo: 0.00, dacaoPagamento: 0.00, fundoConstitucional: 0.00, doacao: 0.00, devolucaoTDM: 0.00, saidaPIM: 0.00, saidaBaixas: 0.00, transfEntrada: 0.00, transfSaida: 0.00, estornoEntrada: 0.00, estornoSaida: 0.00, saldoSIGGO: 0.00, saldoESUPRI: 0.00, tipoDivergencia: null },
// ];

// // ===== Calendário Manager (Gestor) =====
// function CalendarioFechamento({calendar,setCalendar,role}){
//   const months = Object.keys(calendar).sort();
//   const canEdit = can(role,'calendário');
//   const update = (m, field, val)=>{
//     setCalendar((prev)=> ({...prev, [m]: {...prev[m], [field]: val}}));
//   };
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-3">
//         <h2>Calendário de Abertura e Fechamento Mensal</h2>
//         <Badge variant="secondary"><CalendarDays className="w-4 h-4"/> Gestão</Badge>
//       </div>
//       <Card>
//         <CardHeader>
//           <div className="grid grid-cols-3 gap-4">
//             <div>Mês</div><div>Data de Abertura</div><div>Data de Fechamento</div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {months.map((m)=> (
//             <div key={m} className="grid grid-cols-3 items-center gap-3 py-2 border-b last:border-0">
//               <div>{new Date(m+"-01").toLocaleDateString('pt-BR',{month:'long', year:'numeric'})}</div>
//               <div>
//                 <input type="date" value={calendar[m].abertura} onChange={e=>update(m,'abertura',e.target.value)} className="border rounded-lg px-3 py-2 w-full" disabled={!canEdit}/>
//               </div>
//               <div>
//                 <input type="date" value={calendar[m].fechamento} onChange={e=>update(m,'fechamento',e.target.value)} className="border rounded-lg px-3 py-2 w-full" disabled={!canEdit}/>
//               </div>
//             </div>
//           ))}
//           <div className="mt-4 flex justify-end">
//             <Button disabled={!canEdit}>Salvar Calendário</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// // ====== PREVIA (usa janela ABERTA do calendário) ======
// function PreviaDM({role,calendar}){
//   const [ug, setUg] = useState("230101 – SECEC");
//   const [almox, setAlmox] = useState("Almox Central");
//   const [competencia, setCompetencia] = useState("2025-08");
//   const [showDivergOnly, setShowDivergOnly] = useState(false);
//   const [watermark, setWatermark] = useState(true);

//   const periodo = calendar[competencia] ?? {abertura:competencia+"-01", fechamento:new Date(new Date(competencia+"-01").getFullYear(), new Date(competencia+"-01").getMonth()+1, 0).toISOString().slice(0,10)};
//   const hoje = new Date();
//   const hojeISO = hoje.toISOString().slice(0,10);
//   const emJanelaAberta = hojeISO >= periodo.abertura && hojeISO <= periodo.fechamento;
//   const diasParaFechar = Math.ceil((new Date(periodo.fechamento).getTime() - hoje.getTime()) / (1000*60*60*24));

//   const rows = useMemo(()=>baseRows.map(r=>({
//     ...r,
//     tipoDivergencia: r.tipoDivergencia ?? classifyDivergence(r),
//     entradasTotal: (r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM + (r.transfEntrada||0) + (r.estornoEntrada||0)),
//     saidasTotal:   (r.saidaPIM + r.saidaBaixas + (r.transfSaida||0) + (r.estornoSaida||0)),
//     saldoAtualPrevisto: r.saldoAnterior + (r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM + (r.transfEntrada||0) + (r.estornoEntrada||0)) - (r.saidaPIM + r.saidaBaixas + (r.transfSaida||0) - (r.estornoSaida||0)),
//     diferencaSIGGOxPrev: (r.saldoAnterior + r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM + (r.transfEntrada||0) + (r.estornoEntrada||0) - r.saidaPIM - r.saidaBaixas - (r.transfSaida||0) - (r.estornoSaida||0)) - r.saldoSIGGO,
//     acumuladoExercicio: r.saldoESUPRI
//   })),[]);

//   const filtered = useMemo(()=> showDivergOnly ? rows.filter(r=>Math.abs(r.diferencaSIGGOxPrev)>0.009) : rows,[rows,showDivergOnly]);
//   const assinaturaPayload = `${ug}|${almox}|${competencia}|PRÉVIA|${JSON.stringify(filtered)}`;
//   const hash = simpleHash(assinaturaPayload);

//   return (
//     <div className="relative">
//       {/* {watermark && (
//         <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-10 select-none">
//           <div className="text-[14vw] font-black tracking-widest rotate-[-20deg]">PRÉVIA</div>
//         </div>
//       )} */}

//       <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
//         <div>
//           <h2>Prévia do Demonstrativo Financeiro</h2>
//           <p className="text-muted-foreground">Layout idêntico ao Relatório Oficial, identificado como Prévia.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="secondary"><AlertCircle className="w-3.5 h-3.5"/> PRÉVIA</Badge>
//           <Badge>UG: {ug.split(" ")[0]}</Badge>
//           <Badge>{competencia}</Badge>
//         </div>
//       </div>

//       {/* Banner período aberto + alerta de prazo */}
//       <Card className="mb-4">
//         <CardContent className="pt-6">
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <div>Período de Apuração (Prévia)</div>
//             <div className="flex gap-2">
//               <Badge variant={emJanelaAberta? 'default' : 'secondary'}>{emJanelaAberta? 'ABERTO' : 'Fora do período de PRÉVIA'}</Badge>
//               <Badge variant="outline">{fmtBR(periodo.abertura)} – {fmtBR(periodo.fechamento)}</Badge>
//               {emJanelaAberta && diasParaFechar<=3 && diasParaFechar>=0 && (
//                 <Badge variant="secondary"><AlertCircle className="w-3.5 h-3.5"/> Fecha em {diasParaFechar} dia(s)</Badge>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Filtros */}
//       <Card className="mb-4">
//         <CardHeader>
//           <div className="flex items-center gap-2"><Filter className="w-4 h-4"/><span>Filtros</span></div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-4 gap-3">
//             <div className="flex flex-col gap-1"><label>Unidade Gestora (UG)</label>
//               <select value={ug} onChange={e=>setUg(e.target.value)} className="border rounded-lg px-3 py-2"><option>230101 – SECEC</option><option>130103 – SEEC</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Almoxarifado</label>
//               <select value={almox} onChange={e=>setAlmox(e.target.value)} className="border rounded-lg px-3 py-2"><option>Almox Central</option><option>Almox Saúde</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Competência</label>
//               <input type="month" value={competencia} onChange={e=>setCompetencia(e.target.value)} className="border rounded-lg px-3 py-2" />
//             </div>
//             <div className="flex items-end gap-2">
//               <Button variant="outline" onClick={()=>setShowDivergOnly(v=>!v)}>{showDivergOnly?"Mostrar tudo":"Somente divergências"}</Button>
//               <Button variant="outline" onClick={()=>setWatermark(v=>!v)}>{watermark?"Ocultar marca d'água":"Mostrar marca d'água"}</Button>
//               <Button variant="outline" title="Recalcular"><RefreshCw className="w-4 h-4"/></Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabela padronizada (com grupos e subtotais) */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between"><div>Demonstrativo Financeiro – {almox}</div>
//             <div className="flex gap-2">
//               <Button variant="outline" title="Visualizar"><Eye className="w-4 h-4"/> Visualizar</Button>
//               {can(role,'exportar') && <Button variant="outline" title="Exportar PDF"><Download className="w-4 h-4"/> PDF</Button>}
//               {can(role,'exportar') && <Button variant="outline" title="Exportar XLSX"><Download className="w-4 h-4"/> XLSX</Button>}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-auto">
//             <table className="min-w-[1500px] w-full">
//               <thead>
//                 <tr className="text-left bg-muted align-bottom">
//                   <th rowSpan={2} className="p-2">Subitem</th>
//                   <th rowSpan={2} className="p-2">Despesa</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Anterior</th>
//                   <th colSpan={8} className="p-2 text-center">Entradas</th>
//                   <th colSpan={2} className="p-2 text-center">Saídas</th>
//                   <th colSpan={2} className="p-2 text-center">Transferências</th>
//                   <th colSpan={2} className="p-2 text-center">Estorno</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Atual (Prévia)</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Atual (SIGGO)</th>
//                   <th rowSpan={2} className="p-2 text-right">Diferença (Prévia − SIGGO)</th>
//                   <th rowSpan={2} className="p-2 text-right">Acumulado no Exercício</th>
//                   <th rowSpan={2} className="p-2">Status</th>
//                 </tr>
//                 <tr className="text-left bg-muted/50">
//                   <th className="p-2 text-right">Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Dação Pag.</th>
//                   <th className="p-2 text-right">Fundo Const.</th>
//                   <th className="p-2 text-right">Doação</th>
//                   <th className="p-2 text-right">Devolução (TDM)</th>
//                   <th className="p-2 text-right">PIM</th>
//                   <th className="p-2 text-right">Baixas</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((r,i)=>{
//                   const ok = Math.abs(r.diferencaSIGGOxPrev) < 0.009;
//                   return (
//                     <tr key={i} className="border-b hover:bg-muted/25">
//                       <td className="p-2">{r.codigo}</td>
//                       <td className="p-2">{r.descricao}</td>
//                       <td className="p-2 text-right">{brl(r.saldoAnterior)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaOrcTesouro)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaOrcFundo)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaExtraTesouro)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaExtraFundo)}</td>
//                       <td className="p-2 text-right">{brl(r.dacaoPagamento)}</td>
//                       <td className="p-2 text-right">{brl(r.fundoConstitucional)}</td>
//                       <td className="p-2 text-right">{brl(r.doacao)}</td>
//                       <td className="p-2 text-right">{brl(r.devolucaoTDM)}</td>
//                       <td className="p-2 text-right">{brl(r.saidaPIM)}</td>
//                       <td className="p-2 text-right">{brl(r.saidaBaixas)}</td>
//                       <td className="p-2 text-right">{brl(r.transfEntrada)}</td>
//                       <td className="p-2 text-right">{brl(r.transfSaida)}</td>
//                       <td className="p-2 text-right">{brl(r.estornoEntrada)}</td>
//                       <td className="p-2 text-right">{brl(r.estornoSaida)}</td>
//                       <td className="p-2 text-right">{brl(r.saldoAtualPrevisto)}</td>
//                       <td className="p-2 text-right">{brl(r.saldoSIGGO)}</td>
//                       <td className={ok?"p-2 text-right text-green-700":"p-2 text-right text-red-700"}>{brl(r.diferencaSIGGOxPrev)}</td>
//                       <td className="p-2 text-right">{brl(r.acumuladoExercicio)}</td>
//                       <td className="p-2">{ok ? (
//                         <Badge><CheckCircle2 className="w-3.5 h-3.5"/> OK</Badge>
//                       ) : (
//                         <Badge variant="destructive"><AlertCircle className="w-3.5 h-3.5"/> Divergente</Badge>
//                       )}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//               <tfoot>
//                 <tr className="bg-muted">
//                   <td colSpan={3} className="p-2">Subtotais</td>
//                   <td colSpan={8} className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.entradasTotal,0))}</td>
//                   <td colSpan={2} className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.saidasTotal,0))}</td>
//                   <td colSpan={2}></td>
//                   <td colSpan={2}></td>
//                   <td className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.saldoAtualPrevisto,0))}</td>
//                   <td className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.saldoSIGGO,0))}</td>
//                   <td className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.diferencaSIGGOxPrev,0))}</td>
//                   <td className="p-2 text-right">{brl(rows.reduce((a,r)=>a+r.acumuladoExercicio,0))}</td>
//                   <td></td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* Rodapé de certificação e hash */}
//           <div className="mt-4 grid md:grid-cols-3 gap-3">
//             <Card className="border-dashed"><CardContent className="pt-6">
//               <div className="text-muted-foreground">Emitido por</div>
//               <div>Chefe/Substituto do Almoxarifado</div>
//               <div className="text-muted-foreground">Documento de PRÉVIA sem valor oficial.</div>
//             </CardContent></Card>
//             <Card className="border-dashed"><CardContent className="pt-6">
//               <div className="text-muted-foreground">Conferido por</div>
//               <div>Gestor da Unidade</div>
//             </CardContent></Card>
//             <Card className="border-dashed"><CardContent className="pt-6">
//               <div className="text-muted-foreground">Gerado em</div>
//               <div>{new Date().toLocaleString("pt-BR")}</div>
//               <div className="text-muted-foreground mt-2">Hash da Emissão</div>
//               <div className="font-mono">{hash}</div>
//             </CardContent></Card>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // ====== RELATÓRIO OFICIAL (usa janela FECHADA e valida emissão) ======
// function RelatorioOficialDM({role,calendar}){
//   const [ug,setUg] = useState("230101 – SECEC");
//   const [almox,setAlmox] = useState("Almox Central");
//   const [periodo,setPeriodo] = useState({ini:"2025-01", fim:"2025-03"});

//   const rows = useMemo(()=>baseRows.map(r=>({
//     ...r,
//     saldoAtualOficial: r.saldoAnterior + (r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM + (r.transfEntrada||0) + (r.estornoEntrada||0)) - (r.saidaPIM + r.saidaBaixas + (r.transfSaida||0) + (r.estornoSaida||0)),
//   })),[]);

//   const assinaturaPayload = `${ug}|${almox}|${periodo.ini}-${periodo.fim}|OFICIAL|${JSON.stringify(rows)}`;
//   const hash = simpleHash(assinaturaPayload);

//   // Determina intervalo fechado (do calendário)
//   const compIni = periodo.ini, compFim = periodo.fim;
//   const pIni = calendar[compIni] ?? {abertura:compIni+"-01", fechamento:new Date(new Date(compIni+"-01").getFullYear(), new Date(compIni+"-01").getMonth()+1, 0).toISOString().slice(0,10)};
//   const pFim = calendar[compFim] ?? {abertura:compFim+"-01", fechamento:new Date(new Date(compFim+"-01").getFullYear(), new Date(compFim+"-01").getMonth()+1, 0).toISOString().slice(0,10)};

//   // Validação: só permite "Emitir Oficial" se todas as competências do intervalo já estiverem FECHADAS (hoje > data de fechamento de cada mês)
//   const monthsBetween = (start, end)=>{
//     const res = []; const s=new Date(start+"-01"); const e=new Date(end+"-01");
//     const cur=new Date(s); while(cur<=e){ res.push(cur.toISOString().slice(0,7)); cur.setMonth(cur.getMonth()+1); }
//     return res;
//   };
//   const hoje = new Date();
//   const allClosed = monthsBetween(compIni,compFim).every(m=>{
//     const fecho = new Date((calendar[m]?.fechamento) || new Date(new Date(m+"-01").getFullYear(), new Date(m+"-01").getMonth()+1, 0).toISOString().slice(0,10));
//     return hoje > fecho; // fechado quando a data atual já passou do fechamento
//   });

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2>Demonstrativo Financeiro – Relatório Oficial</h2>
//           <p className="text-muted-foreground">Documento oficial emitido após o fechamento.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge>UG: {ug.split(" ")[0]}</Badge>
//           <Badge>{periodo.ini} a {periodo.fim}</Badge>
//         </div>
//       </div>

//       {/* Parâmetros + janela fechada */}
//       <Card className="mb-4">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2"><Columns3 className="w-4 h-4"/><span>Parâmetros</span></div>
//             <div className="flex items-center gap-2">
//               <Badge variant="secondary">Período FECHADO</Badge>
//               <Badge variant="outline">{fmtBR(pIni.abertura)} – {fmtBR(pFim.fechamento)}</Badge>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-4 gap-3">
//             <div className="flex flex-col gap-1"><label>Unidade Gestora (UG)</label>
//               <select value={ug} onChange={e=>setUg(e.target.value)} className="border rounded-lg px-3 py-2"><option>230101 – SECEC</option><option>130103 – SEEC</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Almoxarifado</label>
//               <select value={almox} onChange={e=>setAlmox(e.target.value)} className="border rounded-lg px-3 py-2"><option>Almox Central</option><option>Almox Saúde</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Período (Início)</label>
//               <input type="month" value={periodo.ini} onChange={e=>setPeriodo(p=>({...p,ini:e.target.value}))} className="border rounded-lg px-3 py-2" />
//             </div>
//             <div className="flex flex-col gap-1"><label>Período (Fim)</label>
//               <input type="month" value={periodo.fim} onChange={e=>setPeriodo(p=>({...p,fim:e.target.value}))} className="border rounded-lg px-3 py-2" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabela oficial + emissão com trava */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between"><div>Demonstrativo Financeiro – {almox}</div>
//             <div className="flex gap-2">
//               {can(role,'exportar') && <Button variant="outline" title="Exportar PDF"><Download className="w-4 h-4"/> PDF</Button>}
//               {can(role,'exportar') && <Button variant="outline" title="Exportar XLSX"><Download className="w-4 h-4"/> XLSX</Button>}
//               {can(role,'emitirOficial') && (
//                 <Button disabled={!allClosed} title={allClosed?"Emitir Oficial":"Aguardando fechamento do período"}>
//                   <Lock className="w-4 h-4"/> Emitir Oficial
//                 </Button>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-auto">
//             <table className="min-w-[1400px] w-full">
//               <thead>
//                 <tr className="text-left bg-muted align-bottom">
//                   <th rowSpan={2} className="p-2">Subitem</th>
//                   <th rowSpan={2} className="p-2">Despesa</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Anterior</th>
//                   <th colSpan={8} className="p-2 text-center">Entradas</th>
//                   <th colSpan={2} className="p-2 text-center">Saídas</th>
//                   <th colSpan={2} className="p-2 text-center">Transferências</th>
//                   <th colSpan={2} className="p-2 text-center">Estorno</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Atual</th>
//                 </tr>
//                 <tr className="text-left bg-muted/50">
//                   <th className="p-2 text-right">Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Dação Pag.</th>
//                   <th className="p-2 text-right">Fundo Const.</th>
//                   <th className="p-2 text-right">Doação</th>
//                   <th className="p-2 text-right">Devolução (TDM)</th>
//                   <th className="p-2 text-right">PIM</th>
//                   <th className="p-2 text-right">Baixas</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((r,i)=> (
//                   <tr key={i} className="border-b hover:bg-muted/25">
//                     <td className="p-2">{r.codigo}</td>
//                     <td className="p-2">{r.descricao}</td>
//                     <td className="p-2 text-right">{brl(r.saldoAnterior)}</td>
//                     <td className="p-2 text-right">{brl(r.entradaOrcTesouro)}</td>
//                     <td className="p-2 text-right">{brl(r.entradaOrcFundo)}</td>
//                     <td className="p-2 text-right">{brl(r.entradaExtraTesouro)}</td>
//                     <td className="p-2 text-right">{brl(r.entradaExtraFundo)}</td>
//                     <td className="p-2 text-right">{brl(r.dacaoPagamento)}</td>
//                     <td className="p-2 text-right">{brl(r.fundoConstitucional)}</td>
//                     <td className="p-2 text-right">{brl(r.doacao)}</td>
//                     <td className="p-2 text-right">{brl(r.devolucaoTDM)}</td>
//                     <td className="p-2 text-right">{brl(r.saidaPIM)}</td>
//                     <td className="p-2 text-right">{brl(r.saidaBaixas)}</td>
//                     <td className="p-2 text-right">{brl(r.transfEntrada)}</td>
//                     <td className="p-2 text-right">{brl(r.transfSaida)}</td>
//                     <td className="p-2 text-right">{brl(r.estornoEntrada)}</td>
//                     <td className="p-2 text-right">{brl(r.estornoSaida)}</td>
//                     <td className="p-2 text-right">{brl(r.saldoAtualOficial)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Bloco de assinaturas oficiais */}
//           <div className="mt-4 grid md:grid-cols-4 gap-3">
//             <Card className="border-dashed"><CardContent className="pt-6"><div className="text-muted-foreground">Emitido por</div><div>Chefe/Substituto do Almoxarifado</div></CardContent></Card>
//             <Card className="border-dashed"><CardContent className="pt-6"><div className="text-muted-foreground">Validado por</div><div>Gestor da Unidade</div></CardContent></Card>
//             <Card className="border-dashed"><CardContent className="pt-6"><div className="text-muted-foreground">Assinado Digitalmente</div><div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Certificado ICP-Brasil</div></CardContent></Card>
//             <Card className="border-dashed"><CardContent className="pt-6"><div className="text-muted-foreground">Hash do Documento</div><div className="font-mono">{hash}</div><div className="text-muted-foreground mt-2">Data/Hora</div><div>{new Date().toLocaleString("pt-BR")}</div></CardContent></Card>
//           </div>

//           {!allClosed && (
//             <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-2">
//               <AlertCircle className="w-4 h-4"/> Emissão bloqueada: existem competências ainda ABERTAS dentro do período selecionado.
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // ====== CONCILIAÇÃO (inalterada nas regras principais) ======
// function ConciliaFinanceira({role}){
//   const [ug,setUg] = useState("230101 – SECEC");
//   const [almox,setAlmox] = useState("Almox Central");
//   const [competencia,setCompetencia] = useState("2025-08");
//   const [somenteDiverg,setSomenteDiverg] = useState(true);
//   const [selected,setSelected] = useState(null);
//   const [historicoOpen,setHistoricoOpen] = useState(null);

//   const rows = useMemo(()=>baseRows.map(r=>({
//     ...r,
//     tipoDivergencia: r.tipoDivergencia ?? classifyDivergence(r),
//     entradasES: r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM,
//     saidasES:   r.saidaPIM + r.saidaBaixas,
//     saldoPrevisto: r.saldoAnterior + (r.entradaOrcTesouro + r.entradaOrcFundo + r.entradaExtraTesouro + r.entradaExtraFundo + r.dacaoPagamento + r.fundoConstitucional + r.doacao + r.devolucaoTDM + (r.transfEntrada||0) + (r.estornoEntrada||0)) - (r.saidaPIM + r.saidaBaixas + (r.transfSaida||0) + (r.estornoSaida||0)),
//     diferencaESUPRIxSIGGO: r.saldoESUPRI - r.saldoSIGGO,
//   })),[]);

//   const list = useMemo(()=> somenteDiverg ? rows.filter(r=>Math.abs(r.diferencaESUPRIxSIGGO)>0.009) : rows,[rows,somenteDiverg]);
//   const totalOk = rows.filter(r=>Math.abs(r.diferencaESUPRIxSIGGO)<0.009).length;
//   const totalDiv = rows.length - totalOk;
//   const valorDiv = rows.reduce((acc,r)=>acc+Math.abs(r.diferencaESUPRIxSIGGO),0);

//   // mock histórico
//   const historico = [
//     {dt: "2025-08-05 10:12", acao: "Capturados dados do SIGGO", por: "Sistema"},
//     {dt: "2025-08-05 10:13", acao: "Diferenças geradas", por: "Sistema"},
//     {dt: "2025-08-06 09:01", acao: "Notificado responsável contábil", por: "e‑Supri"},
//   ];

//   // modal action state
//   const [acao,setAcao] = useState("");
//   const [destino,setDestino] = useState("");
//   const [comentario,setComentario] = useState("");
//   const [prazo,setPrazo] = useState("");

//   return (
//     <div>
//       <div className="grid grid-cols-4 gap-4 mb-4">
//         <Card><CardContent className="pt-6"><p>Itens conciliados</p><p className="text-green-700">{totalOk}</p></CardContent></Card>
//         <Card><CardContent className="pt-6"><p>Divergências</p><p className="text-red-700">{totalDiv}</p></CardContent></Card>
//         <Card><CardContent className="pt-6"><p>Valor divergente</p><p>{brl(valorDiv)}</p></CardContent></Card>
//         <Card><CardContent className="pt-6"><p>% Acurácia</p><p>{((totalOk/rows.length)*100).toFixed(1)}%</p></CardContent></Card>
//       </div>

//       <Card className="mb-4">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2"><Filter className="w-4 h-4"/><span>Filtros</span></div>
//             <div className="flex gap-2">
//               {can(role,'atualizarSIGGO') && <Button variant="outline" title="Capturar Dados do SIGGO (Subproc. 01)"><RefreshCw className="w-4 h-4"/> Atualizar dados SIGGO</Button>}
//               {can(role,'exportar') && <Button variant="outline" title="Gerar Relatório de Diferença (Subproc. 03)"><Download className="w-4 h-4"/> Exportar divergências</Button>}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-5 gap-3">
//             <div className="flex flex-col gap-1"><label>Unidade Gestora (UG)</label>
//               <select value={ug} onChange={e=>setUg(e.target.value)} className="border rounded-lg px-3 py-2"><option>230101 – SECEC</option><option>130103 – SEEC</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Almoxarifado</label>
//               <select value={almox} onChange={e=>setAlmox(e.target.value)} className="border rounded-lg px-3 py-2"><option>Almox Central</option><option>Almox Saúde</option></select>
//             </div>
//             <div className="flex flex-col gap-1"><label>Competência</label>
//               <input type="month" value={competencia} onChange={e=>setCompetencia(e.target.value)} className="border rounded-lg px-3 py-2" />
//             </div>
//             <div className="flex items-end gap-2">
//               <Button variant="outline" onClick={()=>setSomenteDiverg(v=>!v)}>{somenteDiverg?"Mostrar tudo":"Somente divergências"}</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between"><div>Comparativo SIGGO × e‑Supri</div>
//             <div className="flex gap-2">
//               {can(role,'exportar') && <Button variant="outline" title="Exportar"><Download className="w-4 h-4"/> Exportar</Button>}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-auto">
//             <table className="min-w-[1500px] w-full">
//               <thead>
//                 <tr className="text-left bg-muted align-bottom">
//                   <th rowSpan={2} className="p-2">Subitem</th>
//                   <th rowSpan={2} className="p-2">Descrição</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Anterior</th>
//                   <th colSpan={8} className="p-2 text-center">Entradas (e‑Supri)</th>
//                   <th colSpan={2} className="p-2 text-center">Saídas (e‑Supri)</th>
//                   <th colSpan={2} className="p-2 text-center">Transferências</th>
//                   <th colSpan={2} className="p-2 text-center">Estorno</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Atual (e‑Supri)</th>
//                   <th rowSpan={2} className="p-2 text-right">Saldo Atual (SIGGO)</th>
//                   <th rowSpan={2} className="p-2 text-right">Diferença (e‑Supri − SIGGO)</th>
//                   <th rowSpan={2} className="p-2">Tipo Divergência</th>
//                   <th rowSpan={2} className="p-2">Status</th>
//                   <th rowSpan={2} className="p-2">Ações</th>
//                 </tr>
//                 <tr className="text-left bg-muted/50">
//                   <th className="p-2 text-right">Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Tesouro)</th>
//                   <th className="p-2 text-right">Extra‑Orçamentária (Fundo)</th>
//                   <th className="p-2 text-right">Dação Pag.</th>
//                   <th className="p-2 text-right">Fundo Const.</th>
//                   <th className="p-2 text-right">Doação</th>
//                   <th className="p-2 text-right">Devolução (TDM)</th>
//                   <th className="p-2 text-right">PIM</th>
//                   <th className="p-2 text-right">Baixas</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                   <th className="p-2 text-right">Entrada</th>
//                   <th className="p-2 text-right">Saída</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {list.map((r,i)=>{
//                   const dif=r.diferencaESUPRIxSIGGO; const ok=Math.abs(dif)<0.009;
//                   const badge = ok ? (<Badge><CheckCircle2 className="w-3.5 h-3.5"/> OK</Badge>) : (<Badge variant="destructive"><AlertCircle className="w-3.5 h-3.5"/> Divergente</Badge>);
//                   return (
//                     <tr key={i} className="border-b hover:bg-muted/25">
//                       <td className="p-2">{r.codigo}</td>
//                       <td className="p-2">{r.descricao}</td>
//                       <td className="p-2 text-right">{brl(r.saldoAnterior)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaOrcTesouro)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaOrcFundo)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaExtraTesouro)}</td>
//                       <td className="p-2 text-right">{brl(r.entradaExtraFundo)}</td>
//                       <td className="p-2 text-right">{brl(r.dacaoPagamento)}</td>
//                       <td className="p-2 text-right">{brl(r.fundoConstitucional)}</td>
//                       <td className="p-2 text-right">{brl(r.doacao)}</td>
//                       <td className="p-2 text-right">{brl(r.devolucaoTDM)}</td>
//                       <td className="p-2 text-right">{brl(r.saidaPIM)}</td>
//                       <td className="p-2 text-right">{brl(r.saidaBaixas)}</td>
//                       <td className="p-2 text-right">{brl(r.transfEntrada)}</td>
//                       <td className="p-2 text-right">{brl(r.transfSaida)}</td>
//                       <td className="p-2 text-right">{brl(r.estornoEntrada)}</td>
//                       <td className="p-2 text-right">{brl(r.estornoSaida)}</td>
//                       <td className="p-2 text-right">{brl(r.saldoESUPRI)}</td>
//                       <td className="p-2 text-right">{brl(r.saldoSIGGO)}</td>
//                       <td className={ok?"p-2 text-right text-green-700":"p-2 text-right text-red-700"}>{brl(dif)}</td>
//                       <td className="p-2">{r.tipoDivergencia || "-"}</td>
//                       <td className="p-2">{badge}</td>
//                       <td className="p-2 flex gap-2">
//                         {!ok && can(role,'tratar') && <Button variant="outline" title="Tratar Divergência" onClick={()=>{setSelected(r); setAcao(""); setDestino(""); setComentario(""); setPrazo("");}}><ClipboardList className="w-4 h-4"/> Tratar</Button>}
//                         <Button variant="outline" title="Histórico" onClick={()=>setHistoricoOpen(i)}><History className="w-4 h-4"/></Button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//               <tfoot>
//                 <tr className="bg-muted">
//                   <td colSpan={3} className="p-2">Totais</td>
//                   <td colSpan={8} className="p-2 text-right">{brl(rows.reduce((acc,r)=>acc+(r.entradaOrcTesouro+r.entradaOrcFundo+r.entradaExtraTesouro+r.entradaExtraFundo+r.dacaoPagamento+r.fundoConstitucional+r.doacao+r.devolucaoTDM),0))}</td>
//                   <td colSpan={2} className="p-2 text-right">{brl(rows.reduce((acc,r)=>acc+(r.saidaPIM+r.saidaBaixas),0))}</td>
//                   <td colSpan={2}></td>
//                   <td colSpan={2}></td>
//                   <td className="p-2 text-right">{brl(rows.reduce((acc,r)=>acc+r.saldoESUPRI,0))}</td>
//                   <td className="p-2 text-right">{brl(rows.reduce((acc,r)=>acc+r.saldoSIGGO,0))}</td>
//                   <td colSpan={3}></td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Modal lateral: Tratar Divergência */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
//           <div className="bg-background w-[420px] h-full p-4 shadow-xl overflow-auto">
//             <div className="flex items-center justify-between mb-3"><h2>Tratar Divergência</h2><Button variant="outline" onClick={()=>setSelected(null)}>Fechar</Button></div>
//             <div className="mb-2">Subitem: <strong>{selected.codigo}</strong> – {selected.descricao}</div>
//             <div className="mb-4">Diferença: <strong>{brl(selected.diferencaESUPRIxSIGGO)}</strong></div>

//             <div className="space-y-3">
//               <div>
//                 <div className="text-muted-foreground mb-1">Tipo de Ação</div>
//                 <select value={acao} onChange={e=>setAcao(e.target.value)} className="border rounded-lg px-3 py-2 w-full">
//                   <option value="">Selecione…</option>
//                   <option>Ajuste Interno</option>
//                   <option>Justificar ao SIGGO</option>
//                   <option>Encaminhar Responsável Contábil</option>
//                   <option>Encaminhar Responsável Financeiro</option>
//                   <option>Solicitar Complementação</option>
//                 </select>
//               </div>

//               {(acao==="Justificar ao SIGGO" || acao.startsWith("Encaminhar")) && (
//                 <div>
//                   <div className="text-muted-foreground mb-1">Destino</div>
//                   <select value={destino} onChange={e=>setDestino(e.target.value)} className="border rounded-lg px-3 py-2 w-full">
//                     <option value="">Selecione…</option>
//                     {acao==="Justificar ao SIGGO" && <option value="SIGGO">SIGGO</option>}
//                     {acao==="Encaminhar Responsável Contábil" && <option value="Contábil">Responsável Contábil</option>}
//                     {acao==="Encaminhar Responsável Financeiro" && <option value="Financeiro">Responsável Financeiro</option>}
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <div className="text-muted-foreground mb-1">Comentário / Justificativa</div>
//                 <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={4} className="border rounded-lg px-3 py-2 w-full" placeholder="Descreva a ação, motivo, documentos, etc." />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <div className="text-muted-foreground mb-1">Prazo (se aplicável)</div>
//                   <input type="date" value={prazo} onChange={e=>setPrazo(e.target.value)} className="border rounded-lg px-3 py-2 w-full"/>
//                 </div>
//                 <div>
//                   <div className="text-muted-foreground mb-1">Anexos</div>
//                   <Button variant="outline" className="w-full"><FileText className="w-4 h-4"/> Selecionar arquivo</Button>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 mt-2">
//                 {acao==="Ajuste Interno" && can(role,'tratar') && <Button variant="outline"><UserCheck className="w-4 h-4"/> Executar Ajuste Interno</Button>}
//                 {acao==="Justificar ao SIGGO" && can(role,'justificarSIGGO') && <Button variant="outline"><Send className="w-4 h-4"/> Enviar Justificativa ao SIGGO</Button>}
//                 {acao==="Encaminhar Responsável Contábil" && can(role,'notificarContabil') && <Button variant="outline"><Send className="w-4 h-4"/> Notificar Responsável Contábil</Button>}
//                 {acao==="Encaminhar Responsável Financeiro" && can(role,'notificarFinanceiro') && <Button variant="outline"><Send className="w-4 h-4"/> Notificar Responsável Financeiro</Button>}
//                 {can(role,'marcarResolvido') && <Button variant="outline" onClick={()=>setSelected(null)}><CheckCircle2 className="w-4 h-4"/> Marcar Como Resolvida</Button>}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {Number.isInteger(historicoOpen) && (
//         <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
//           <div className="bg-background w-[420px] h-full p-4 shadow-xl overflow-auto">
//             <div className="flex items-center justify-between mb-3"><h2>Histórico</h2><Button variant="outline" onClick={()=>setHistoricoOpen(null)}>Fechar</Button></div>
//             <div className="space-y-3">
//               {historico.map((h,i)=>(
//                 <Card key={i}><CardContent className="pt-6">
//                   <div>{h.acao}</div>
//                   <div className="text-muted-foreground">{h.dt} · {h.por}</div>
//                 </CardContent></Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ====== ROOT APP with tabs & role selector (Dashboard Principal) ======
// export default function App(){
//   const [tab, setTab] = useState("previa");
//   const [role, setRole] = useState("Chefe Almox");
//   // Calendário em estado (integra com tela do Gestor)
//   const [calendar,setCalendar] = useState({
//     "2025-01": { abertura: "2025-01-01", fechamento: "2025-01-31" },
//     "2025-02": { abertura: "2025-02-01", fechamento: "2025-02-28" },
//     "2025-03": { abertura: "2025-03-01", fechamento: "2025-03-31" },
//     "2025-08": { abertura: "2025-08-01", fechamento: "2025-08-31" },
//   });

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-wrap gap-2 mb-4">
//           <Button variant={tab==='previa'? 'default':'outline'} onClick={()=>setTab('previa')}>Prévia (DM)</Button>
//           <Button variant={tab==='oficial'? 'default':'outline'} onClick={()=>setTab('oficial')}>Relatório Oficial (DM)</Button>
//           <Button variant={tab==='concilia'? 'default':'outline'} onClick={()=>setTab('concilia')}>Conciliação (SIGGO × e‑Supri)</Button>
//           {can(role,'calendário') && <Button variant={tab==='calend'? 'default':'outline'} onClick={()=>setTab('calend')}>Calendário</Button>}
//         </div>

//         <div className="flex items-center gap-2 mb-3">
//           <label>Perfil:</label>
//           <select className="border rounded-lg px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
//             {ROLES.map(r=> <option key={r} value={r}>{r}</option>)}
//           </select>
//         </div>

//         {tab==='previa'   && <PreviaDM role={role} calendar={calendar}/>} 
//         {tab==='oficial'  && <RelatorioOficialDM role={role} calendar={calendar}/>} 
//         {tab==='concilia' && <ConciliaFinanceira role={role}/>} 
//         {tab==='calend'   && <CalendarioFechamento role={role} calendar={calendar} setCalendar={setCalendar}/>} 
//       </div>
//     </div>
//   );
// }

"use client"
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager, Category } from '@/components/Financeiro/CategoryManager';
import { AccountsPayable, AccountPayable } from '@/components/Financeiro/AccountsPayable';
import { AccountsReceivable, AccountReceivable } from '@/components/Financeiro/AccountsReceivable';
import { CashFlow } from '@/components/Financeiro/CashFlow';
import { IncomeStatement } from '@/components/Financeiro/IncomeStatement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useLocalStorage from '@/hooks/useLocalStorage';
import { 
  Calculator, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';

// para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido'

export default function App() {
  // Dados padrão para inicialização
  const defaultCategories = [
    {
      id: '1',
      name: 'Salário',
      type: 'entrada',
      subcategories: [
        { id: '1-1', name: 'Salário Principal', categoryId: '1' },
        { id: '1-2', name: 'Hora Extra', categoryId: '1' }
      ]
    },
    {
      id: '2',
      name: 'Freelance',
      type: 'entrada',
      subcategories: [
        { id: '2-1', name: 'Projetos Web', categoryId: '2' },
        { id: '2-2', name: 'Consultoria', categoryId: '2' }
      ]
    },
    {
      id: '3',
      name: 'Moradia',
      type: 'saida',
      subcategories: [
        { id: '3-1', name: 'Aluguel', categoryId: '3' },
        { id: '3-2', name: 'Condomínio', categoryId: '3' },
        { id: '3-3', name: 'IPTU', categoryId: '3' }
      ]
    },
    {
      id: '4',
      name: 'Alimentação',
      type: 'saida',
      subcategories: [
        { id: '4-1', name: 'Supermercado', categoryId: '4' },
        { id: '4-2', name: 'Restaurantes', categoryId: '4' },
        { id: '4-3', name: 'Delivery', categoryId: '4' }
      ]
    },
    {
      id: '5',
      name: 'Transporte',
      type: 'saida',
      subcategories: [
        { id: '5-1', name: 'Combustível', categoryId: '5' },
        { id: '5-2', name: 'Transporte Público', categoryId: '5' },
        { id: '5-3', name: 'Manutenção Veículo', categoryId: '5' }
      ]
    }
  ];

  const defaultAccountsPayable = [
    {
      id: '1',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-15',
      paymentDate: '2024-12-14',
      amount: 1200,
      subcategoryId: '3-1',
      description: 'Aluguel apartamento',
      status: 'paid'
    },
    {
      id: '2',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-20',
      amount: 450,
      subcategoryId: '4-1',
      description: 'Compras do mês',
      status: 'pending'
    }
  ];

  const defaultAccountsReceivable = [
    {
      id: '1',
      competencyDate: '2024-12-01',
      dueDate: '2024-12-05',
      paymentDate: '2024-12-05',
      amount: 5000,
      subcategoryId: '1-1',
      description: 'Salário dezembro',
      status: 'received'
    },
    {
      id: '2',
      competencyDate: '2024-12-15',
      dueDate: '2024-12-30',
      amount: 1500,
      subcategoryId: '2-1',
      description: 'Projeto website cliente',
      status: 'pending'
    }
  ];

  // Estados persistidos com localStorage
  const [categories, setCategories] = useLocalStorage('financial-app-categories', defaultCategories);
  const [accountsPayable, setAccountsPayable] = useLocalStorage('financial-app-accounts-payable', defaultAccountsPayable);
  const [accountsReceivable, setAccountsReceivable] = useLocalStorage('financial-app-accounts-receivable', defaultAccountsReceivable);

  // Estados para filtro do dashboard
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  // Opções para os selects
  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  const years = useMemo(() => {
    const allDates = [
      ...accountsPayable.map(acc => acc.competencyDate),
      ...accountsReceivable.map(acc => acc.competencyDate)
    ];
    
    const yearSet = new Set(allDates.map(date => new Date(date).getFullYear()));
    yearSet.add(currentDate.getFullYear());
    
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountsPayable, accountsReceivable, currentDate]);

  // Filtrar dados baseado no período selecionado
  const filteredData = useMemo(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const filteredPayable = accountsPayable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });

    const filteredReceivable = accountsReceivable.filter(acc => {
      const competencyDate = new Date(acc.competencyDate);
      return competencyDate >= monthStart && competencyDate <= monthEnd;
    });

    return { filteredPayable, filteredReceivable };
  }, [accountsPayable, accountsReceivable, selectedMonth, selectedYear]);

  // Cálculos para dashboard baseados nos dados filtrados
  const dashboardStats = useMemo(() => {
    const { filteredPayable, filteredReceivable } = filteredData;

    const totalReceivable = filteredReceivable
      .filter(acc => acc.status === 'pending')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalPayable = filteredPayable
      .filter(acc => acc.status === 'pending')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalReceived = filteredReceivable
      .filter(acc => acc.status === 'received')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const totalPaid = filteredPayable
      .filter(acc => acc.status === 'paid')
      .reduce((sum, acc) => sum + acc.amount, 0);

    const receivablePendingCount = filteredReceivable.filter(acc => acc.status === 'pending').length;
    const payablePendingCount = filteredPayable.filter(acc => acc.status === 'pending').length;
    const receivedCount = filteredReceivable.filter(acc => acc.status === 'received').length;
    const paidCount = filteredPayable.filter(acc => acc.status === 'paid').length;

    return {
      totalReceivable,
      totalPayable,
      totalReceived,
      totalPaid,
      receivablePendingCount,
      payablePendingCount,
      receivedCount,
      paidCount
    };
  }, [filteredData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSelectedMonthName = () => {
    const monthObj = months.find(m => m.value === selectedMonth);
    return monthObj ? monthObj.label : '';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2">Plataforma Financeira Pessoal</h1>
              <p className="text-muted-foreground">
                Gerencie suas finanças pessoais de forma organizada e eficiente
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              💾 Dados salvos automaticamente
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="payable" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Contas a Pagar
            </TabsTrigger>
            <TabsTrigger value="receivable" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Contas a Receber
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              DFC
            </TabsTrigger>
            <TabsTrigger value="dre" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              DRE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Filtro de Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtro de Período
                </CardTitle>
                <CardDescription>
                  Selecione o mês e ano para visualizar os dados específicos do período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month-select">Mês</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger id="month-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year-select">Ano</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Exibindo dados de <strong>{getSelectedMonthName()} de {selectedYear}</strong>
                </div>
              </CardContent>
            </Card>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Receber</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(dashboardStats.totalReceivable)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.receivablePendingCount} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">A Pagar</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPayable)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.payablePendingCount} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Recebido</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.receivedCount} contas recebidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Pago</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.paidCount} contas pagas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cards de Resumo Detalhado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo das Categorias</CardTitle>
                  <CardDescription>Organização atual das suas categorias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Categorias de Entrada</span>
                      <Badge className="bg-green-100 text-green-800">
                        {categories.filter(cat => cat.type === 'entrada').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Categorias de Saída</span>
                      <Badge className="bg-red-100 text-red-800">
                        {categories.filter(cat => cat.type === 'saida').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Subcategorias</span>
                      <Badge>
                        {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Período</CardTitle>
                  <CardDescription>
                    {getSelectedMonthName()} de {selectedYear} - Baseado nas contas do período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Receitas</span>
                      <span className="text-green-600">
                        {formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Despesas</span>
                      <span className="text-red-600">
                        {formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Resultado do Período</span>
                      <span className={
                        (dashboardStats.totalReceived + dashboardStats.totalReceivable) - 
                        (dashboardStats.totalPaid + dashboardStats.totalPayable) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }>
                        {formatCurrency(
                          (dashboardStats.totalReceived + dashboardStats.totalReceivable) - 
                          (dashboardStats.totalPaid + dashboardStats.totalPayable)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Pendências Líquidas</span>
                        <span className={dashboardStats.totalReceivable - dashboardStats.totalPayable >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(dashboardStats.totalReceivable - dashboardStats.totalPayable)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo de Movimentações por Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Contas a Receber - {getSelectedMonthName()}/{selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Recebidas</span>
                      <div className="text-right">
                        <div className="text-green-600">{formatCurrency(dashboardStats.totalReceived)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.receivedCount} contas</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pendentes</span>
                      <div className="text-right">
                        <div className="text-orange-600">{formatCurrency(dashboardStats.totalReceivable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.receivablePendingCount} contas</div>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total do Período</span>
                      <div className="text-right">
                        <div className="text-green-600">
                          {formatCurrency(dashboardStats.totalReceived + dashboardStats.totalReceivable)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dashboardStats.receivedCount + dashboardStats.receivablePendingCount} contas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Contas a Pagar - {getSelectedMonthName()}/{selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Pagas</span>
                      <div className="text-right">
                        <div className="text-red-600">{formatCurrency(dashboardStats.totalPaid)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.paidCount} contas</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pendentes</span>
                      <div className="text-right">
                        <div className="text-orange-600">{formatCurrency(dashboardStats.totalPayable)}</div>
                        <div className="text-xs text-muted-foreground">{dashboardStats.payablePendingCount} contas</div>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total do Período</span>
                      <div className="text-right">
                        <div className="text-red-600">
                          {formatCurrency(dashboardStats.totalPaid + dashboardStats.totalPayable)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dashboardStats.paidCount + dashboardStats.payablePendingCount} contas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager 
              categories={categories}
              onCategoriesChange={setCategories}
            />
          </TabsContent>

          <TabsContent value="payable">
            <AccountsPayable 
              accounts={accountsPayable}
              categories={categories}
              onAccountsChange={setAccountsPayable}
            />
          </TabsContent>

          <TabsContent value="receivable">
            <AccountsReceivable 
              accounts={accountsReceivable}
              categories={categories}
              onAccountsChange={setAccountsReceivable}
            />
          </TabsContent>

          {/* Tabs com largura total para DFC e DRE */}
          <TabsContent value="cashflow" className="-mx-4 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
            <div className="px-4">
              <CashFlow 
                categories={categories}
                accountsPayable={accountsPayable}
                accountsReceivable={accountsReceivable}
              />
            </div>
          </TabsContent>

          <TabsContent value="dre" className="-mx-4 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
            <div className="px-4">
              <IncomeStatement 
                categories={categories}
                accountsPayable={accountsPayable}
                accountsReceivable={accountsReceivable}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}