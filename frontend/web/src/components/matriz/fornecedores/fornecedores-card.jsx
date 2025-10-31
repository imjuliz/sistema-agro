"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expandable, ExpandableCard, ExpandableCardContent, ExpandableCardFooter, ExpandableCardHeader, ExpandableContent, ExpandableTrigger, } from "@/components/ui/expandable"
import { Bluetooth, CircleDot, Tags, ShoppingCart, Star, Users, Battery, Package, Search, Sliders, DownloadIcon, FileTextIcon, FileSpreadsheetIcon, } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";

export default function FornecedoresCard() {
    const suppliers = [
        { name: 'Animals', category: 'Animais', status: 'ativa', products: 156 },
        { name: 'Nature Co.', category: 'Insumos', status: 'ativa', products: 89 },
        { name: 'PetFood', category: 'Rações', status: 'ativa', products: 67 },
        { name: 'EcoMundo', category: 'Plantas', status: 'ativa', products: 134 }
    ];

    const badgeVariantFor = (status) => {
        // status strings em sua base: 'ativa' ou 'inativa' (ajuste se necessário)
        return status === 'ativa' ? 'default' : 'secondary';
    };

    const [statusFilters, setStatusFilters] = useState({ Ativa: true, Inativa: true });

    return (
        <div>
            <header className="mb-4">

                <h2 className="text-lg font-semibold mb-3">Fornecedores</h2>
                {/* <p className="text-sm text-muted-foreground">
                    Acesse catálogos de seus fornecedores aprovados
                </p> */}

                <div className="flex flex-row gap-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        {/* <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /> */}
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar por nome ou CNPJ..." className="pl-10" />
                    </div>
                    {/* FILTROS AVANÇADOS: usa Popover para menu parecido com dropdown */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Sliders className="h-4 w-4" />Filtros avançados
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="start" className="w-[360px] p-3">
                            {/* header com ações rápidas */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">Filtros Avançados</div>
                                <div className="text-sm text-neutral-400">X resultados</div>
                            </div>

                            <div className="space-y-3">
                                {/* STATUS */}
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                                    <div className="flex gap-2">
                                        {["Ativa", "Inativa"].map(s => (
                                            <label key={s} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                                                <Checkbox checked={!!statusFilters[s]} onCheckedChange={() => { toggleStatus(s); setPage(1); }} />
                                                <div className="text-sm">{s}</div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <Separator />

                                {/* LOCALIZAÇÃO */}
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Localização</div>
                                    <Input placeholder="Filtrar por cidade / estado" />
                                </div>
                                <Separator />
                                {/* RESPONSAVEL - ainda nn funciona */}
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Responsável</div>
                                    <Input placeholder="Filtrar por responsável" />
                                </div>

                                <Separator />
                                {/* Area */}
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Área</div>
                                    <Input placeholder="Filtrar por responsável" />
                                </div>

                                {/* APLICAR / RESET */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={() => { setPage(1); /* já aplica por react */ }}>Aplicar</Button>
                                        <Button size="sm" variant="ghost">Limpar</Button>
                                    </div>
                                </div>

                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <span className="text-sm">Ordenar Por</span>
                            <div className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded bg-neutral-800 text-neutral-300 text-xs">1</div>
                        </Button>

                        <div className="flex items-center gap-2 ml-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline' size='sm'>
                                        <DownloadIcon className='mr-2 h-4 w-4' />
                                        Exportar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem onClick={() => handleExport()}>
                                        <FileTextIcon className='mr-2 h-4 w-4' />
                                        Exportar CSV
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileSpreadsheetIcon className='mr-2 h-4 w-4' />
                                        Exportar PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div>
                </div>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* {suppliers.map((supplier, idx) => (
                    <Expandable key={idx} expandDirection="both" expandBehavior="replace">
                        {({ isExpanded }) => (
                            <ExpandableTrigger>
                                <ExpandableCard
                                    className="w-full relative cursor-pointer hover:shadow-md transition-shadow"
                                    collapsedSize={{ width: "100%", height: 160 }}
                                    expandedSize={{ width: "100%", height: 380 }}
                                    hoverToExpand={false}
                                >
                                    <ExpandableCardHeader className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium">{supplier.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{supplier.category}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant={badgeVariantFor(supplier.status)}>
                                                    {supplier.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {supplier.products} produtos
                                                </span>
                                            </div>
                                        </div>
                                    </ExpandableCardHeader>

                                    <ExpandableCardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    {isExpanded
                                                        ? `Catálogo completo de ${supplier.name}. Encontre produtos, especificações e preços.`
                                                        : `Acesse o catálogo de ${supplier.name} (${supplier.products} produtos).`}
                                                </p>

                                                <ExpandableContent preset="fade" keepMounted={false}>
                                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                                                        <li>- Categoria: <strong>{supplier.category}</strong></li>
                                                        <li>- Produtos disponíveis: <strong>{supplier.products}</strong></li>
                                                        <li>- Status do fornecedor: <strong>{supplier.status}</strong></li>
                                                    </ul>
                                                </ExpandableContent>
                                            </div>

                                            <div className="w-28 flex-shrink-0 flex flex-col items-end">
                                                <Button
                                                    size="sm"
                                                    className="mb-2 w-full"
                                                    disabled={supplier.status !== 'ativa'}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    {supplier.status === 'ativa' ? 'Ver catálogo' : 'Aguardando aprovação'}
                                                </Button>

                                                <Button variant="ghost" size="sm" className="w-full">
                                                    Detalhes
                                                </Button>
                                            </div>
                                        </div>
                                    </ExpandableCardContent>

                                    <ExpandableContent preset="slide-up">
                                        <ExpandableCardFooter className="p-3">
                                            <div className="flex justify-between text-xs text-muted-foreground w-full">
                                                <span>Última atualização: —</span>
                                                <span>Política de compras disponível</span>
                                            </div>
                                        </ExpandableCardFooter>
                                    </ExpandableContent>
                                </ExpandableCard>
                            </ExpandableTrigger>
                        )}
                    </Expandable>
                ))} */}


                {suppliers.map((supplier, idx) => (
                    <Expandable key={idx} expandDirection="both" expandBehavior="replace" onExpandStart={() => console.log("Expanding product card...")} onExpandEnd={() => console.log("Product card expanded!")}>
                        {({ isExpanded }) => (
                            <ExpandableTrigger>
                                <ExpandableCard
                                    className="w-full relative"
                                    // collapsedSize={{ width: 300, height: 220 }}
                                    collapsedSize={{ width: "100%", height: 220 }}
                                    // expandedSize={{ width: 300, height: 520 }}
                                    expandedSize={{ width: "100%", height: 520 }}
                                    hoverToExpand={false}
                                    expandDelay={500}
                                    collapseDelay={700}
                                >
                                    <ExpandableCardHeader>
                                        <div className="flex justify-between items-center">
                                            <Badge variant="secondary" className="bg-[#99BF0F]/10 text-[#99BF0F]/80 dark:bg-[#99BF0F]/30">{supplier.status}</Badge>
                                            <Badge variant="outline" className="ml-2">{supplier.products} produtos</Badge>
                                        </div>
                                    </ExpandableCardHeader>
                                    <ExpandableCardContent>
                                        <div className="flex items-start mb-4">
                                            <img src="https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6505/6505727_rd.jpg;maxHeight=640;maxWidth=550;format=webp" alt="Product" className="object-cover rounded-md mr-4" style={{ width: isExpanded ? "120px" : "80px", height: isExpanded ? "120px" : "80px", transition: "width 0.3s, height 0.3s", }} />
                                            <div className="flex-1">

                                                <h3 className="font-medium text-gray-800 dark:text-white tracking-tight transition-all duration-300" style={{ fontSize: isExpanded ? "24px" : "18px", fontWeight: isExpanded ? "700" : "700", }}>{supplier.name}</h3>

                                                <div className="flex items-center mt-1">
                                                    <AnimatePresence mode="wait">
                                                        {isExpanded ? (
                                                            <motion.span key="expanded" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap">{supplier.category}</motion.span>
                                                        ) : (
                                                            <motion.span key="collapsed" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap">{supplier.category}</motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                        <ExpandableContent preset="fade" keepMounted={false} animateIn={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 300, damping: 20 }, }}>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">Descrição da empresa abcdefghijklmnopqrstuvwxyz</p>
                                            <div className="space-y-4">
                                                {[
                                                    { icon: Tags, text: "Categoria:" },
                                                    { icon: Package, text: "Produtos disponíveis: " },
                                                    { icon: CircleDot, text: "Status do fornecedor:" },
                                                ].map((feature, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <feature.icon className="w-4 h-4 mr-2" />
                                                        <span>{feature.text}</span>
                                                    </div>
                                                ))}
                                                <Button className="w-full bg-[#99BF0F]/80 hover:bg-[#99BF0F] text-white"><ShoppingCart className="w-4 h-4 mr-2" />Ver catálogo</Button>
                                            </div>
                                        </ExpandableContent>
                                    </ExpandableCardContent>
                                    <ExpandableContent preset="slide-up">
                                        <ExpandableCardFooter>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 w-full">
                                                <span>Free shipping</span>
                                                <span>30-day return policy</span>
                                            </div>
                                        </ExpandableCardFooter>
                                    </ExpandableContent>
                                </ExpandableCard>
                            </ExpandableTrigger>
                        )}
                    </Expandable>
                ))}
            </div>
        </div>
    );
}
