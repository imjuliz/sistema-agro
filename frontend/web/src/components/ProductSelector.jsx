"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Lista de produtos e preços (exemplo)
const PRODUCTS = [
  { id: 1, name: "Arroz", pricePerKg: 6.5 },
  { id: 2, name: "Feijão", pricePerKg: 8.0 },
  { id: 3, name: "Açúcar", pricePerKg: 4.2 },
  { id: 4, name: "Farinha", pricePerKg: 5.7 },
];

export default function ProductSelector() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState([]);

  // Adiciona produto à lista
  const addProduct = () => {
    if (!selectedProduct) return;
    const product = PRODUCTS.find((p) => p.name === selectedProduct);
    if (!product) return;

    // Evita duplicados
    if (productList.some((item) => item.id === product.id)) return;

    setProductList([...productList, { ...product, quantity: 0 }]);
    setSelectedProduct("");
  };

  // Atualiza quantidade e recalcula preço
  const updateQuantity = (id, value) => {
    const newList = productList.map((p) =>
      p.id === id ? { ...p, quantity: parseFloat(value) || 0 } : p
    );
    setProductList(newList);
  };

  const totalPrice = productList.reduce(
    (acc, item) => acc + item.pricePerKg * item.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-10">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <h2 className="text-xl font-semibold">Selecione um produto</h2>
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedProduct(value)} value={selectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha um produto" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} — R$ {p.pricePerKg.toFixed(2)}/kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addProduct}>Adicionar</Button>
          </div>

          {productList.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-medium">Produtos Selecionados</h3>
              {productList.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                  <span>{item.name}</span>

                  <div className="flex items-center gap-2">
                    <Input type="number" step="0.1" min="0" className="w-24" placeholder="kg" value={item.quantity} onChange={(e) => updateQuantity(item.id, e.target.value)}/>
                    <span className="text-sm">
                      R$ {(item.pricePerKg * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="text-right font-bold text-lg mt-2">
                Total: R$ {totalPrice.toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}