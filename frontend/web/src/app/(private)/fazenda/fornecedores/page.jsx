"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable } from "@/components/Fazenda/parceiros";
import data from "./data.json";
// Para tradução
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from "@/components/TextoTraduzido/TextoTraduzido";
//-------
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCatalog } from "@/components/fornecedores/ProductCatalog";
// import { OrderManagement } from './OrderManagement';
import { ChatInterface } from "@/components/fornecedores/ChatInterface";
import { ComplaintSystem } from "@/components/fornecedores/ComplaintSystem";
import { ShoppingCart, MessageSquare, AlertTriangle, Search, TrendingUp, Clock, CheckCircle, FileCheck } from "lucide-react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Card, CardContent, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FornecedoresCard from "@/components/fornecedores/fornecedores-card";
import { OrderManagement } from "@/components/fornecedores/OrderManagement";

export default function ConsumerDashboard() {
  const { fetchWithAuth, user } = useAuth();
  usePerfilProtegido("GERENTE_FAZENDA");

  const [lojas, setLojas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const unidadeId = user?.unidadeId;

        if (!unidadeId) {
          console.error("Unidade não identificada");
          return;
        }

        // Carrega lojas atendidas
        const resLojas = await fetchWithAuth(
          `${API_URL}listarLojasParceiras/${unidadeId}`
        );
        if (resLojas.ok) {
          const bodyLojas = await resLojas.json();
          setLojas(bodyLojas.lojas || []);
        }

        // Carrega contratos com lojas
        const resContratos = await fetchWithAuth(
          `${API_URL}verContratosComLojas/${unidadeId}`
        );
        if (resContratos.ok) {
          const bodyContratos = await resContratos.json();
          setContratos(bodyContratos.contratos || []);
        }

        // Carrega pedidos (origem da fazenda)
        const resPedidos = await fetchWithAuth(
          `${API_URL}estoque-produtos/pedidos-origem/${unidadeId}`
        );
        if (resPedidos.ok) {
          const bodyPedidos = await resPedidos.json();
          setPedidos(bodyPedidos.pedidos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (user?.unidadeId) {
      carregarDados();
    }
  }, [user?.unidadeId, fetchWithAuth]);

  const totalLojas = lojas.length;
  const totalContratos = contratos.length;
  const pedidosPendentes = pedidos.filter(
    (p) => p.status === "PENDENTE" || p.status === "EM_TRANSITO"
  ).length;

  const StatCard = ({ title, value, icon: Icon, color = "text-muted-foreground" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{title}</p>
            <p className={`text-2xl ${color}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 flex flex-col gap-12">
      {/* cards / kpis / indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:@xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-0">
        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Contratos Ativos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {carregando ? "-" : totalContratos}
            </CardTitle>
            <CardAction>
              <FileCheck />
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Pedidos pendentes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {carregando ? "-" : pedidosPendentes}
            </CardTitle>
            <CardAction>
              <Clock />
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="h-fit bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardDescription>Lojas Parceiras</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {carregando ? "-" : totalLojas}
            </CardTitle>
            <CardAction>
              <CheckCircle />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* card de lojas atendidas */}
      <FornecedoresCard fornecedores={lojas} carregando={carregando} />
      {/* produtos */}
      <ProductCatalog contratos={contratos} carregando={carregando} />
      {/* gerenciamento de pedidos */}
      <OrderManagement pedidos={pedidos} carregando={carregando} />
    </div>
  );
}
