# Exemplos de Uso - Formulários de Pedidos

## Exemplo 1: Criando Pedido Externo (Fazenda)

### Cenário
Uma fazenda de tomate quer comprar fertilizante de um fornecedor externo.

### Passos
1. Acesse como usuário com role **GERENTE_FAZENDA**
2. Vá para a dashboard de fornecedores da fazenda
3. Clique na aba **"Contratos como consumidor"**
4. Clique no botão **"Criar Pedido"**

### Preenchimento do Formulário

```
Fornecedor Externo: "Agrotech Suprimentos" (ID: 5)
Contrato: [Opcional - deixe em branco]

Tipo de Transporte: "VEICULO_PROPRIO"
Placa do Veículo: "ABC-1234"
Motorista: "Carlos Silva"
Documento de Referência: "NF-2024-12345"

Observações: "Entregar na porta principal da fazenda"

Itens:
  Item 1:
    - Produto ID: 127
    - Quantidade: 50
    - Unidade: kg
    - Preço Unitário: 35.50
    - Observações: "Fertilizante NPK 20-20-20"
    
  Item 2:
    - Produto ID: 128
    - Quantidade: 30
    - Unidade: kg
    - Preço Unitário: 42.00
    - Observações: "Fertilizante K extra"
```

### Total do Pedido
- Item 1: 50 × 35.50 = R$ 1.775,00
- Item 2: 30 × 42.00 = R$ 1.260,00
- **Total: R$ 3.035,00**

### Resultado
```
✅ Sucesso!
Pedido criado com sucesso! ID: 42
```

A lista de pedidos será atualizada automaticamente.

---

## Exemplo 2: Criando Pedido Interno (Loja)

### Cenário
Uma loja de varejo quer comprar produtos agrícolas de uma fazenda fornecedora.

### Passos
1. Acesse como usuário com role **GERENTE_LOJA**
2. Vá para a dashboard de fornecedores da loja
3. Clique no botão **"Criar Pedido"** na área de pedidos

### Preenchimento do Formulário

```
Fazenda Fornecedora: "Fazenda Santa Maria" (ID: 15)

Tipo de Transporte: "RETIRADA"
Placa do Veículo: [Deixe em branco]
Motorista: [Deixe em branco]
Documento de Referência: "Pedido Loja #001"

Observações: "Retirada na sexta-feira, horário 14h"

Itens:
  Item 1:
    - Produto ID: 45
    - Quantidade: 100
    - Unidade: un
    - Preço Unitário: 15.00
    - Observações: "Alface crespa fresca"
    
  Item 2:
    - Produto ID: 46
    - Quantidade: 50
    - Unidade: un
    - Preço Unitário: 12.50
    - Observações: "Tomate italiano"
```

### Total do Pedido
- Item 1: 100 × 15.00 = R$ 1.500,00
- Item 2: 50 × 12.50 = R$ 625,00
- **Total: R$ 2.125,00**

### Resultado
```
✅ Sucesso!
Pedido criado com sucesso! ID: 23
```

---

## Exemplo 3: Tratamento de Erros

### Cenário 1: Sem Fornecedor Selecionado

```
❌ Erro: "Por favor, selecione um fornecedor externo"
```

### Cenário 2: Sem Itens Adicionados

```
❌ Erro: "Por favor, adicione pelo menos um item ao pedido"
```

### Cenário 3: Item Incompleto

```
Tentativa de adicionar item com:
  - Produto ID: [vazio]
  - Quantidade: 10
  - Preço: 25.50

❌ Erro: "Por favor, preencha Produto, Quantidade e Preço"
```

### Cenário 4: Erro do Servidor

```
Resposta do Backend:
{
  "sucesso": false,
  "erro": "Fornecedor não encontrado",
  "detalhes": "ID 999 não existe"
}

❌ Erro: "Fornecedor não encontrado"
```

---

## Exemplo 4: Adicionando Múltiplos Itens

### Passo a Passo

```
1. Preencer formulário de item:
   - Produto ID: 50
   - Quantidade: 100
   - Preço: 10.00

2. Clicar no botão "+"
   → Item adicionado à lista

3. Preencer novo item:
   - Produto ID: 51
   - Quantidade: 75
   - Preço: 15.00

4. Clicar no botão "+"
   → Item 2 adicionado

5. Preencer outro item:
   - Produto ID: 52
   - Quantidade: 50
   - Preço: 20.00

6. Clicar no botão "+"
   → Item 3 adicionado

Itens Adicionados (3):
┌─────────────────────────────┐
│ Produto ID: 50              │
│ 100 un × R$ 10.00 = R$1.000 │ [🗑️]
└─────────────────────────────┘

┌─────────────────────────────┐
│ Produto ID: 51              │
│ 75 un × R$ 15.00 = R$1.125  │ [🗑️]
└─────────────────────────────┘

┌─────────────────────────────┐
│ Produto ID: 52              │
│ 50 un × R$ 20.00 = R$1.000  │ [🗑️]
└─────────────────────────────┘

Total do Pedido: R$ 3.125,00

7. Clicar "Criar Pedido"
   → Modal envia dados para backend
```

---

## Exemplo 5: Removendo um Item

```
Lista de Itens:
┌──────────────────────────────┐
│ Produto ID: 100              │
│ 10 kg × R$ 50.00 = R$ 500    │ [🗑️]
└──────────────────────────────┘

┌──────────────────────────────┐
│ Produto ID: 101              │
│ 20 kg × R$ 60.00 = R$ 1.200  │ [🗑️]  ← Clique aqui
└──────────────────────────────┘

┌──────────────────────────────┐
│ Produto ID: 102              │
│ 5 kg × R$ 75.00 = R$ 375     │ [🗑️]
└──────────────────────────────┘

Após clicar no ícone de lixeira do item 2:

┌──────────────────────────────┐
│ Produto ID: 100              │
│ 10 kg × R$ 50.00 = R$ 500    │ [🗑️]
└──────────────────────────────┘

┌──────────────────────────────┐
│ Produto ID: 102              │
│ 5 kg × R$ 75.00 = R$ 375     │ [🗑️]
└──────────────────────────────┘

Total Atualizado: R$ 875,00
```

---

## Exemplo 6: Fluxo Completo de Criar Pedido com Contrato (Externo)

### Pré-requisitos
- Usuário é GERENTE_FAZENDA
- Fazenda tem contratos com fornecedores externos
- Fornecedor está selecionado

### Passos

```
1. Abrir Modal "Criar Pedido para Fornecedor Externo"

2. Selecionar Fornecedor:
   ┌─────────────────────────┐
   │ Fornecedor Externo *    │
   │ ┌───────────────────┐   │
   │ │ Agrotech...  ▼    │   │
   │ │ - Agrotech Suprimentos
   │ │ - Sementes Brasil
   │ │ - Químico Agrícola
   │ └───────────────────┘   │
   └─────────────────────────┘

3. Selecionar Contrato (Optional):
   ┌─────────────────────────┐
   │ Contrato (Opcional)     │
   │ ┌───────────────────┐   │
   │ │ Selecionar...  ▼  │   │
   │ │ - Contrato 5 - Agrotech
   │ │ - Contrato 8 - Agrotech
   │ └───────────────────┘   │
   └─────────────────────────┘

4. Preencher Detalhes de Transporte:
   ┌──────────────────────────┐
   │ Tipo: VEICULO_PROPRIO    │
   │ Placa: XYZ-9876          │
   │ Motorista: João          │
   │ Doc Ref: NF-2024-001     │
   └──────────────────────────┘

5. Preencher Observações:
   ┌──────────────────────────┐
   │ Entregar com cuidado,    │
   │ produtos frágeis         │
   └──────────────────────────┘

6. Adicionar Itens:
   - Item 1: Produto 200, 50 kg, 25.00 = R$ 1.250
   - Item 2: Produto 201, 30 kg, 30.00 = R$ 900
   Total: R$ 2.150

7. Clicar "Criar Pedido"

8. Modal mostra:
   ✅ Sucesso!
   Pedido criado com sucesso! ID: 87

9. Modal fecha automaticamente após 1.5s

10. Lista de pedidos atualiza com novo pedido
```

---

## Exemplo 7: Cálculo Automático de Custos

```
Preenchendo Item:
- Quantidade: 25.5
- Preço Unitário: 12.75

Cálculo Automático:
25.5 × 12.75 = 325.125

Exibição:
25.5 kg × R$ 12.75 = R$ 325.13 (arredondado para 2 casas)
```

---

## Payloads Reais Enviados

### Pedido Externo (Fazenda → Fornecedor)

```javascript
POST /pedidos-externos/18
Content-Type: application/json

{
  "itens": [
    {
      "produtoId": 127,
      "quantidade": 50,
      "unidadeMedida": "kg",
      "precoUnitario": 35.5,
      "custoTotal": 1775,
      "observacoes": "Fertilizante NPK"
    },
    {
      "produtoId": 128,
      "quantidade": 30,
      "unidadeMedida": "kg",
      "precoUnitario": 42,
      "custoTotal": 1260,
      "observacoes": "Fertilizante K"
    }
  ],
  "origemFornecedorExternoId": 5,
  "contratoId": null,
  "tipoTransporte": "VEICULO_PROPRIO",
  "placaVeiculo": "ABC-1234",
  "motorista": "Carlos Silva",
  "documentoReferencia": "NF-2024-12345",
  "observacoes": "Entregar na porta principal"
}
```

### Pedido Interno (Loja → Fazenda)

```javascript
POST /pedidos-internos/12
Content-Type: application/json

{
  "destinoUnidadeId": 15,
  "itens": [
    {
      "produtoId": 45,
      "quantidade": 100,
      "unidadeMedida": "un",
      "precoUnitario": 15,
      "custoTotal": 1500,
      "observacoes": "Alface crespa"
    },
    {
      "produtoId": 46,
      "quantidade": 50,
      "unidadeMedida": "un",
      "precoUnitario": 12.5,
      "custoTotal": 625,
      "observacoes": "Tomate italiano"
    }
  ],
  "tipoTransporte": "RETIRADA",
  "placaVeiculo": null,
  "motorista": null,
  "documentoReferencia": "Pedido Loja #001",
  "observacoes": "Retirada sexta-feira 14h"
}
```

---

## Dicas e Truques

### 1. Validação Rápida de Dados
Sempre verifique no Console (F12) se há erros JavaScript antes de reportar bug.

### 2. Recuperação de Falha de Rede
Se o pedido falhar por timeout, tente novamente. Os dados não são duplicados.

### 3. Editar Quantidade Rapidamente
Você pode clicar no campo de quantidade e usar as setas do teclado para incrementar/decrementar.

### 4. Navegar com Teclado
Use TAB para navegar entre campos e ENTER para submeter.

### 5. Unidades de Medida Comuns
Para produtos agrícolas: kg, L, un
Para produtos embalados: cx, dz

---

## FAQ

**P: Posso editar um pedido após criar?**
R: Não, mas você pode cancelá-lo (função em desenvolvimento) e criar um novo.

**P: Qual é o limite de itens por pedido?**
R: Não há limite definido, adicione quantos itens forem necessários.

**P: Os dados são salvos automaticamente?**
R: Não, você precisa clicar "Criar Pedido" para confirmar.

**P: Posso adicionar um item vazio?**
R: Não, o botão "+" fica desabilitado até preencher todos os campos obrigatórios.

**P: Como faço se não encontro meu fornecedor?**
R: Verifique se você tem acesso. Nível de acesso pode estar limitado por perfil.
