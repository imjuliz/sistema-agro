"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FinanceiroTab() {
  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Módulo financeiro da loja em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}
