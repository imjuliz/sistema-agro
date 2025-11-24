"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, } from "@/components/ui/select";

const produtosMock = [
    {
        id: 1,
        nome: "Carne Bovina Premium",
        categoria: "bovinos",
        descricao: "Carne bovina selecionada, ideal para churrasco.",
        imagens: ["/img/bov1.jpg", "/img/bov2.jpg"],
        lojas: [{ nome: "Frigorífico Central", preco: "59,90/kg", endereco: "Av. Brasil, 1020 - Centro" }, { nome: "Carnes da Serra", preco: "62,00/kg", endereco: "R. das Acácias, 88 - Jd Verde" }],
    },
    {
        id: 2,
        nome: "Carne Suína Fresca",
        categoria: "suinos",
        descricao: "Carne suína magra e de alta qualidade.",
        imagens: ["/img/suino1.jpg", "/img/suino2.jpg"],
        lojas: [{ nome: "Açougue Popular", preco: "34,90/kg", endereco: "R.Paraná, 514 - Centro" }, { nome: "Mercado Bom Preço", preco: "36,50/kg", endereco: "Av. das Palmeiras, 230 - Vila Nova" }],
    },
    {
        id: 3,
        nome: "Cesta Vegana Completa",
        categoria: "veganos",
        descricao: "Cesta com legumes, verduras e proteínas vegetais.",
        imagens: ["/img/veg1.jpg", "/img/veg2.jpg"],
        lojas: [{ nome: "Horta Viva", preco: "89,90", endereco: "Estrada da Grama, 22 - Zona Rural" }, { nome: "Veggie House", preco: "92,00", endereco: "R.Limeira, 675 - Centro" }],
    },
    {
        id: 4,
        nome: "Cesta Mista de Alimentos",
        categoria: "cestas",
        descricao: "Cesta variada contendo itens essenciais.",
        imagens: ["/img/cesta1.jpg", "/img/cesta2.jpg"],
        lojas: [{ nome: "Casa das Cestas", preco: "129,00", endereco: "R. Dom Pedro II, 140 - Vila Amélia" }, { nome: "SuperMix", preco: "132,50", endereco: "Av. São Jorge, 900 - Pq Industrial" }],
    },
    {
        id: 5,
        nome: "Picanha Bovina Angus",
        categoria: "bovinos",
        descricao: "Corte premium de picanha Angus com alto marmoreio.",
        imagens: ["/img/bov3.jpg"],
        lojas: [{ nome: "Carnes Nobres Grill", preco: "89,90/kg", endereco: "R.Machado de Assis, 77 - Centro" }, { nome: "FrigoMax", preco: "94,00/kg", endereco: "Av. Esperança, 512 - Jd das Flores" }]
    },
    {
        id: 6,
        nome: "Linguiça Suína Temperada",
        categoria: "suinos",
        descricao: "Linguiça artesanal temperada ideal para churrasco.",
        imagens: ["/img/suino3.jpg"],
        lojas: [{ nome: "Açougue do Zé", preco: "24,90/kg", endereco: "R.Treze de Maio, 40 - Centro" }, { nome: "Mercadão União", preco: "26,50/kg", endereco: "Av. Dom Bosco, 800 - União" }]
    },
    {
        id: 7,
        nome: "Kit Vegano Proteico",
        categoria: "veganos",
        descricao: "Kit variado com proteínas vegetais de alta qualidade.",
        imagens: ["/img/veg3.jpg"],
        lojas: [{ nome: "Natural Vita", preco: "75,90", endereco: "R.Hortênsias, 222 - Vila Verde" }, { nome: "VegVida", preco: "79,90", endereco: "Av. Independência, 900 - Centro" }]
    },
    {
        id: 8,
        nome: "Cesta Familiar Econômica",
        categoria: "cestas",
        descricao: "Cesta com itens básicos para o mês.",
        imagens: ["/img/cesta3.jpg"],
        lojas: [{ nome: "Cestas Brasil", preco: "79,90", endereco: "Av. Amazonas, 10 - Antares" }, { nome: "Super Econômico", preco: "82,00", endereco: "R.Ipê Rosa, 334 - Vila Bela" }]
    },
    {
        id: 9,
        nome: "Contrafilé Bovina",
        categoria: "bovinos",
        descricao: "Corte macio e ideal para grelha.",
        imagens: ["/img/bov4.jpg"],
        lojas: [{ nome: "Frigo Sul", preco: "49,90/kg", endereco: "R.Projetada, 101 - São Pedro" }, { nome: "Carne Boa", preco: "51,00/kg", endereco: "Av. da Serra, 800 - Bela Vista" }]
    },
    {
        id: 10,
        nome: "Costelinha Suína Barbecue",
        categoria: "suinos",
        descricao: "Costelinha suína marinada no barbecue.",
        imagens: ["/img/suino4.jpg"],
        lojas: [{ nome: "BBQ House", preco: "42,90/kg", endereco: "R.Alecrim, 90 - Jd Primavera" }, { nome: "Açougue Real", preco: "44,00/kg", endereco: "Av. da Saudade, 440 - Centro" }]
    },
    {
        id: 11,
        nome: "Combo Vegano Festa",
        categoria: "veganos",
        descricao: "Combo especial para refeições veganas festivas.",
        imagens: ["/img/veg4.jpg"],
        lojas: [{ nome: "EcoFoods", preco: "119,90", endereco: "Av. do Sol, 303 - Nova América" }, { nome: "Mundo Veg", preco: "124,00", endereco: "R.Cedro, 81 - Bairro Azul" }]
    },
    {
        id: 12,
        nome: "Cesta Premium Selecionada",
        categoria: "cestas",
        descricao: "Cesta premium com grãos, biscoitos e itens gourmet.",
        imagens: ["/img/cesta4.jpg"],
        lojas: [{ nome: "CestasPrime", preco: "189,00", endereco: "R.das Palmeiras, 190 - Bela Vista" }, { nome: "Mercadão Central", preco: "194,00", endereco: "Av. das Nações, 1000 - Centro" }]
    }
];

export default function Catalogo() {
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const produtosFiltrados = produtosMock.filter((p) => {
        const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
        const categoriaMatch = filtro === "todos" || filtro === "" ? true : p.categoria === filtro;

        return nomeMatch && categoriaMatch;
    });

    return (
        <div className="p-6">
            <style jsx global>{`
        @keyframes snow {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 400px 800px, 0 1500px; }
        }

        .natal-hover:hover { box-shadow: 0 0 15px rgba(255, 0, 0, 1), 0 0 25px rgba(180, 255, 157, 0.84);
          transform: scale(1.04); transition: 0.3s ease-in-out;
        }

        .natal-hover:hover::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; background-image: url('/img/snow1.png'), url('/img/snow2.png');
          background-repeat: repeat; animation: snow 4s linear infinite; opacity: 0.5;
        }
      `}</style>
            <h1 className="text-3xl font-bold mb-4">Catálogo de Produtos</h1>
            {/* BARRA DE BUSCA + FILTRO */}
            <div className="flex gap-4 mb-6">
                <div className="relative w-full">
                    <svg className="w-5 h-5 absolute top-3 left-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                    <Input placeholder="Buscar produto..." className="pl-9 " value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>

                <Select onValueChange={setFiltro}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filtrar por categoria" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="bovinos">Bovinos</SelectItem>
                        <SelectItem value="suinos">Suínos</SelectItem>
                        <SelectItem value="veganos">Veganos</SelectItem>
                        <SelectItem value="cestas">Cestas</SelectItem>
                        <SelectItem value="natal">Natal 🎄</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {produtosFiltrados.map((produto) => (
                    <Card key={produto.id} className={`cursor-pointer transition relative overflow-hidden ${produto.categoria === "natal" ? "natal-hover" : ""}`} onClick={() => setProdutoSelecionado(produto)}>
                        <CardHeader>
                            <CardTitle>{produto.nome}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img src={produto.imagens[0]} alt={produto.nome} className="rounded-md w-full h-40 object-cover" />
                            <p className="text-sm text-gray-600 mt-2">{produto.descricao}</p>
                            <Button className="mt-4 w-full">Ver detalhes</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {produtoSelecionado && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-3xl">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {produtoSelecionado.nome}
                                <Button variant="destructive" onClick={() => setProdutoSelecionado(null)}>Fechar</Button>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {/* GALERIA DE IMAGENS */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {produtoSelecionado.imagens.map((img, i) => (<img key={i} src={img} alt="foto" className="rounded-md w-full h-40 object-cover" />))}
                            </div>
                            <p className="mb-4">{produtoSelecionado.descricao}</p>

                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-green-700">
                                        <th className="p-2 border">Loja</th>
                                        <th className="p-2 border">Preço</th>
                                        <th className="p-2 border">Local</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtoSelecionado.lojas.map((loja, i) => (
                                        <tr key={i}>
                                            <td className="p-2 border">{loja.nome}</td>
                                            <td className="p-2 border">R$ {loja.preco}</td>
                                            <td className="p-2 border">{loja.endereco}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
