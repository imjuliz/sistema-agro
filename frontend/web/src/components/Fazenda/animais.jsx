"use client"
import * as React from 'react';
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/config';
import { toast } from 'sonner';
import { Pie, PieChart } from "recharts"
//ui
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
//mui

export function SectionCards() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [lotes, setLotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function loadLotesAnimais() {
            try {
                const res = await fetchWithAuth(`${API_URL}/lotesPlantio/${unidadeId}`);
                if (!res.ok) {
                    const errorBody = await res.json().catch(() => null);
                    throw new Error(errorBody?.erro || errorBody?.message || `Erro na API: ${res.status}`);
                }

                const data = await res.json().catch(() => ({}));
                if (!mounted) return;

                const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
                if (!Array.isArray(arr)) {throw new Error("Resposta inválida ao buscar lotes/atividades");}

                setLotes(arr);
            } catch (err) {
                console.error("Erro ao carregar lotes/atividades:", err.message);
                setError(err.message || "Erro desconhecido");
            }
        }
        loadLotesAnimais();
        return () => {mounted = false;};
    }, [unidadeId, fetchWithAuth]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {error ? (<div className="text-red-500">Erro: {error}</div>) : (
                lotes.map((lote, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardDescription>Lote {index + 1}</CardDescription>
                            <CardTitle>{lote.nome || "Sem nome"}</CardTitle>
                        </CardHeader>
                    </Card>
                ))
            )}
        </div>
    );
}
export function ChartPieDonut() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [chartDataState, setChartDataState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadChart() {
            if (!unidadeId) {
                console.warn("Unidade ID não encontrado. Abortando carregamento do gráfico.");
                setLoading(false);
                return;
            }
            setError(false);
            setErrorMessage("");

            try {
                const fetchFn = fetchWithAuth || fetch;
                console.info("Carregando dados do gráfico...");
                const res = await fetchFn(`${API_URL}/dashboard/fazenda/${unidadeId}`);

                if (!res.ok) {
                    const errBody = await res.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || `HTTP ${res.status}`);
                }

                const json = await res.json().catch(() => null);
                console.log("Resposta da API (gráfico):", json);

                const chart = json?.chart ?? [];
                if (!Array.isArray(chart)) throw new Error("Resposta inválida ao buscar gráfico");
                if (!mounted) return;

                setChartDataState(chart);
            } catch (err) {
                console.error("Erro carregando chart:", err);
                setError(true);
                setErrorMessage(err.message || "Erro desconhecido");
                toast.error("Erro ao carregar gráfico. Verifique sua conexão ou tente novamente.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadChart();
        return () => {
            mounted = false;
        };
    }, [unidadeId, fetchWithAuth]);

    const config = { visitors: { label: "Valor" } };

    return (
        <Card className="flex flex-col w-full h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Lotes em andamento</CardTitle>
                <CardDescription>
                    {loading ? "Carregando..." : chartDataState.reduce((s, i) => s + (i.value || 0), 0) || "—"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 flex justify-center items-center">
                {error ? (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">
                        <strong>Falha ao carregar informações</strong>
                        {errorMessage ? `: ${errorMessage}` : ""}
                    </div>
                ) : (
                    <ChartContainer config={config} className="w-[90%] h-[90%] flex justify-center items-center">
                        <PieChart width={300} height={300}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartDataState} dataKey="value" nameKey="label" innerRadius={80} outerRadius={120} />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function TableDemo() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");
    const [atividadesState, setAtividadesState] = useState([]);
    const [atividadesError, setAtividadesError] = useState(false);
    const [atividadesErrorMessage, setAtividadesErrorMessage] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadLotesAnimais() {
            if (!unidadeId) return;
            setAtividadesError(false);
            setAtividadesErrorMessage("");

            try {
                const fetchFn = fetchWithAuth || fetch;
                const res = await fetchFn(`${API_URL}/lotesPlantio/${unidadeId}`);
                if (!res.ok) {
                    const errBody = await res.json().catch(() => null);
                    throw new Error(errBody?.erro || errBody?.message || `HTTP ${res.status}`);
                }

                const data = await res.json().catch(() => null);
                console.log("Resposta da API (atividades):", data); 

                if (!mounted) return;

                const arr = data?.lotes ?? data?.data ?? (Array.isArray(data) ? data : []);
                if (!Array.isArray(arr)) {throw new Error("Resposta inválida ao buscar lotes/atividades");}

                const mappedActivities = arr.slice(0, 8).map((l, idx) => ({
                    id: l.id ?? idx + 1,
                    descricao: l.nome || l.produto || `Lote ${l.id}`, // Corrigido
                    tipo: l.tipo || 'Monitoramento',
                    lote: l.talhao || l.local || '-',
                    data: l.plantio || l.dataPlantio || '-',
                    responsavel: l.responsavel || '-'
                }));

                setAtividadesState(mappedActivities);
            } catch (err) {
                console.error("Erro carregando dados de atividades:", err);
                setAtividadesState([]);
                setAtividadesError(true);
                setAtividadesErrorMessage(err.message || "Erro desconhecido");
                toast.error("Erro ao carregar dados de atividades");
            }
        }

        loadLotesAnimais();

        return () => {mounted = false;};
    }, [unidadeId, fetchWithAuth]); // Corrigido fechamento do bloco

    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold">Atividades</h2>
                    <Select onValueChange={setCategoria}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Ordenar por</SelectLabel>
                                <SelectItem value="id">Id</SelectItem>
                                <SelectItem value="tipo">Tipo</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
            </div>
            {atividadesError ? (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
                    <strong>falha ao puxar informações</strong>
                    {atividadesErrorMessage ? `: ${atividadesErrorMessage}` : ''}
                </div>
            ) : atividadesState.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">Nenhuma atividade encontrada.</div>
            ) : (
                <Table>
                    <TableCaption>Atividades Animais</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-700">
                            <TableHead className="w-[80px] font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Descrição</TableHead>
                            <TableHead className="font-semibold">Tipo</TableHead>
                            <TableHead className="font-semibold">Lote</TableHead>
                            <TableHead className="font-semibold">Data</TableHead>
                            <TableHead className="font-semibold">Responsavel</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {atividadesState.map((atvd) => (
                            <TableRow key={atvd.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <TableCell className="font-medium">{atvd.id}</TableCell>
                                <TableCell>{atvd.descricao}</TableCell>
                                <TableCell>{atvd.tipo}</TableCell>
                                <TableCell>{atvd.lote}</TableCell>
                                <TableCell>{atvd.data}</TableCell>
                                <TableCell>{atvd.responsavel}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

// export function TableDemo2() {
//     const { user, fetchWithAuth } = useAuth();
//     const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
//     const [categoria, setCategoria] = useState("");
//     const [busca, setBusca] = useState("");
//     const [lotesAnimais, setLotesAnimais] = useState([]);
//     const [lotesAnimaisError, setLotesAnimaisError] = useState(false);
//     const [lotesAnimaisErrorMessage, setLotesAnimaisErrorMessage] = useState("");

//     useEffect(() => {
//         let mounted = true;

//         async function loadAnimais() {
//             if (!unidadeId) {
//                 console.warn("Unidade ID não encontrado. Abortando carregamento dos lotes de animais.");
//                 return;
//             }

//             setLotesAnimaisError(false);
//             setLotesAnimaisErrorMessage("");

//             try {
//                 const fetchFn = fetchWithAuth || fetch;
//                 console.info("Carregando lotes de animais...");
//                 const res = await fetchFn(`${API_URL}/animais`);

//                 if (!res.ok) {
//                     const errBody = await res.json().catch(() => null);
//                     throw new Error(errBody?.erro || errBody?.message || `HTTP ${res.status}`);
//                 }

//                 const json = await res.json().catch(() => null);
//                 console.log("Resposta da API (lotes de animais):", json);

//                 const arr = Array.isArray(json?.animais) ? json.animais : [];
//                 if (!mounted) return;

//                 setLotesAnimais(arr.filter(a => Number(a.unidadeId) === Number(unidadeId)));
//             } catch (err) {
//                 console.error("Erro carregando lotes de animais:", err);
//                 setLotesAnimais([]);
//                 setLotesAnimaisError(true);
//                 setLotesAnimaisErrorMessage(err.message || "Erro desconhecido");
//                 toast.error("Erro ao carregar lotes de animais. Verifique sua conexão ou tente novamente.");
//             }
//         }

//         loadAnimais();

//         return () => {
//             mounted = false;
//         };
//     }, [unidadeId, fetchWithAuth]);

//     return (
//         <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
//             <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
//                 <div className="flex items-center gap-4 flex-wrap">
//                     <h2 className="text-xl font-semibold">Lotes de Animais</h2>
//                     <Select onValueChange={setCategoria}>
//                         <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
//                         <SelectContent>
//                             <SelectGroup>
//                                 <SelectLabel>Tipo</SelectLabel>
//                                 <SelectItem value="bovinos">Bovinos</SelectItem>
//                                 <SelectItem value="suinos">Suínos</SelectItem>
//                                 <SelectItem value="aves">Aves</SelectItem>
//                                 <SelectItem value="ovinos">Ovinos</SelectItem>
//                                 <SelectItem value="caprinos">Caprinos</SelectItem>
//                                 <SelectItem value="equinos">Equinos</SelectItem>
//                             </SelectGroup>
//                         </SelectContent>
//                     </Select>
//                     <Input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-[250px]" />
//                 </div>
//             </div>
//             {lotesAnimaisError ? (
//                 <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
//                     <strong>falha ao puxar informações</strong>
//                     {lotesAnimaisErrorMessage ? `: ${lotesAnimaisErrorMessage}` : ''}
//                 </div>
//             ) : (
//                 <Table>
//                     <TableCaption>Lotes de Animais</TableCaption>
//                     <TableHeader>
//                         <TableRow className="bg-gray-100 dark:bg-gray-700">
//                             <TableHead className="w-[80px] font-semibold">ID</TableHead>
//                             <TableHead className="font-semibold">Animal</TableHead>
//                             <TableHead className="font-semibold">Tipo</TableHead>
//                             <TableHead className="font-semibold">Quantidade</TableHead>
//                             <TableHead className="font-semibold">Custo</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {lotesAnimais.map((a) => (
//                             <TableRow key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                 <TableCell className="font-medium">{a.id}</TableCell>
//                                 <TableCell>{a.animal}</TableCell>
//                                 <TableCell>{a.tipo}</TableCell>
//                                 <TableCell>{a.quantidade ?? '-'}</TableCell>
//                                 <TableCell>{a.custo ? `R$ ${a.custo}` : '-'}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             )}
//         </div>
//     );
// }
export function TableDemo2() {
    const { user, fetchWithAuth } = useAuth();
    const unidadeId = user?.unidadeId ?? user?.unidade?.id ?? null;
    const [categoria, setCategoria] = useState("");
    const [busca, setBusca] = useState("");
    const [lotesAnimais, setLotesAnimais] = useState([]);
    const [lotesAnimaisError, setLotesAnimaisError] = useState(false);
    const [lotesAnimaisErrorMessage, setLotesAnimaisErrorMessage] = useState("");
  
    useEffect(() => {
      let mounted = true;
      async function loadAnimais() {
        if (!unidadeId || !categoria) {
          console.warn("Unidade ID ou categoria não informados. Abortando carregamento.");
          return;
        }
        setLotesAnimaisError(false);
        setLotesAnimaisErrorMessage("");
        try {
          const fetchFn = fetchWithAuth || fetch;
          console.info(`Carregando lotes de animais do tipo ${categoria}...`);
          const res = await fetchFn(`${API_URL}/lotes/tipo?tipo=${categoria}`);

          if (!res.ok) {
            const errBody = await res.json().catch(() => null);
            throw new Error(errBody?.erro || errBody?.message || `HTTP ${res.status}`);
          }
          const json = await res.json().catch(() => null);
          console.log("Resposta da API (lotes de animais):", json);
  
          const arr = Array.isArray(json?.lotesAnimalia?.loteTipo)
            ? json.lotesAnimalia.loteTipo
            : [];
  
          if (!mounted) return;
          // filtra por unidadeId
          setLotesAnimais(arr.filter((a) => Number(a.unidadeId) === Number(unidadeId)));
        } catch (err) {
          console.error("Erro carregando lotes de animais:", err);
          setLotesAnimais([]);
          setLotesAnimaisError(true);
          setLotesAnimaisErrorMessage(err.message || "Erro desconhecido");
          toast.error("Erro ao carregar lotes de animais. Verifique sua conexão ou tente novamente.");
        }
      }
      loadAnimais();
      return () => {mounted = false;};
    }, [unidadeId, categoria, fetchWithAuth]);
  
    return (
      <div className="border rounded-lg shadow-sm bg-white dark:bg-black h-full p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-xl font-semibold">Lotes de Animais</h2>
            <Select onValueChange={setCategoria}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="GADO">Gado</SelectItem>
                  <SelectItem value="LEITE">Leite</SelectItem>
                  <SelectItem value="BOVINOS">Bovinos</SelectItem>
                  <SelectItem value="SUINOS">Suínos</SelectItem>
                  <SelectItem value="OVINOS">Ovinos</SelectItem>
                  <SelectItem value="CAPRINOS">Caprinos</SelectItem>
                  <SelectItem value="AVES">Aves</SelectItem>
                  <SelectItem value="EQUINOS">Equinos</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-[250px]"
            />
          </div>
        </div>
  
        {lotesAnimaisError ? (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
            <strong>Falha ao puxar informações</strong>
            {lotesAnimaisErrorMessage ? `: ${lotesAnimaisErrorMessage}` : ""}
          </div>
        ) : lotesAnimais.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            Nenhum lote encontrado para o tipo selecionado.
          </div>
        ) : (
          <Table>
            <TableCaption>Lotes de Animais</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="w-[80px] font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Animal</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Quantidade</TableHead>
                <TableHead className="font-semibold">Custo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotesAnimais
                .filter((a) =>
                  busca
                    ? a.animal?.toLowerCase().includes(busca.toLowerCase())
                    : true
                )
                .map((a) => (
                  <TableRow
                    key={a.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">{a.id}</TableCell>
                    <TableCell>{a.animal}</TableCell>
                    <TableCell>{a.tipo}</TableCell>
                    <TableCell>{a.quantidade ?? "-"}</TableCell>
                    <TableCell>{a.custo ? `R$ ${a.custo}` : "-"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
  