# Documentação: Formulários de Criação de Pedidos

## Visão Geral

Dois novos modais foram criados para permitir a criação de pedidos no sistema:

1. **Modal de Pedido Externo** (Fazenda → Fornecedor Externo)
2. **Modal de Pedido Interno** (Loja → Fazenda)

---

## 1. Modal de Pedido Externo (Fazenda)

### Localização
- **Arquivo**: `src/components/fornecedores-fazenda/CreatePedidoModal.jsx`
- **Componente**: `CreatePedidoModal`
- **Integrado em**: `src/components/fornecedores-fazenda/ConsumerDashboard.jsx`

### Características
- Permite que uma **FAZENDA** crie um pedido para um **FORNECEDOR EXTERNO**
- Aparece na aba **"Contratos como consumidor"** da dashboard de fornecedores
- Um botão **"Criar Pedido"** é exibido na área de pedidos

### Campos Disponíveis

#### Obrigatórios
- **Fornecedor Externo**: Select para escolher um fornecedor externo cadastrado
- **Itens do Pedido**: Pelo menos 1 item deve ser adicionado com:
  - Produto ID (número)
  - Quantidade (número decimal)
  - Unidade de Medida (kg, L, un, etc.)
  - Preço Unitário (número decimal)

#### Opcionais
- **Contrato**: Pode estar vinculado a um contrato existente
- **Tipo de Transporte**: VEICULO_PROPRIO, TERCEIRO, RETIRADA, SEDEX, PAC
- **Placa do Veículo**: Identificação do veículo de transporte
- **Motorista**: Nome do motorista responsável
- **Documento de Referência**: Nota fiscal, RCF, etc.
- **Observações**: Notas adicionais sobre o pedido

### Como Usar

1. Acesse a dashboard de fornecedores como uma **FAZENDA**
2. Clique na aba **"Contratos como consumidor"**
3. Clique no botão **"Criar Pedido"** na área de pedidos
4. Preencha os campos obrigatórios
5. Adicione itens ao pedido usando o formulário de itens
6. Clique em **"Criar Pedido"** para confirmar

### Fluxo de Itens
1. Preencha os campos do novo item (Produto ID, Quantidade, Preço)
2. Clique no botão **"+"** para adicionar
3. O item aparece na lista "Itens Adicionados"
4. O total do pedido é calculado automaticamente
5. Para remover um item, clique no ícone de lixeira

### Endpoint Backend
- **Método**: POST
- **Rota**: `/pedidos-externos/:unidadeId`
- **Roles Permitidos**: GERENTE_FAZENDA, FUNCIONARIO_FAZENDA, GERENTE_MATRIZ

---

## 2. Modal de Pedido Interno (Loja)

### Localização
- **Arquivo**: `src/components/fornecedores-loja/CreatePedidoLojaModal.jsx`
- **Componente**: `CreatePedidoLojaModal`
- **Integrado em**: `src/components/fornecedores-loja/ConsumerDashboard.jsx`

### Características
- Permite que uma **LOJA** crie um pedido para uma **FAZENDA FORNECEDORA**
- Aparece na aba de fornecedores da dashboard
- Um botão **"Criar Pedido"** é exibido na área de pedidos

### Campos Disponíveis

#### Obrigatórios
- **Fazenda Fornecedora**: Select para escolher uma fazenda fornecedora
- **Itens do Pedido**: Pelo menos 1 item com:
  - Produto ID
  - Quantidade
  - Unidade de Medida
  - Preço Unitário

#### Opcionais
- **Tipo de Transporte**: VEICULO_PROPRIO, TERCEIRO, RETIRADA, SEDEX, PAC
- **Placa do Veículo**: Identificação do veículo
- **Motorista**: Nome do motorista
- **Documento de Referência**: Identificação do documento
- **Observações**: Notas adicionais

### Como Usar

1. Acesse a dashboard de fornecedores como uma **LOJA**
2. Clique no botão **"Criar Pedido"** na área de pedidos
3. Selecione uma fazenda fornecedora
4. Preencha os campos e adicione itens
5. Clique em **"Criar Pedido"** para confirmar

### Endpoint Backend
- **Método**: POST
- **Rota**: `/pedidos-internos/:unidadeId`
- **Roles Permitidos**: GERENTE_LOJA, FUNCIONARIO_LOJA, GERENTE_MATRIZ

---

## 3. Estrutura de Dados do Payload

### Payload Enviado para Backend

```json
{
  "destinoUnidadeId": 34,
  "origemFornecedorExternoId": 12,
  "contratoId": 5,
  "tipoTransporte": "VEICULO_PROPRIO",
  "placaVeiculo": "ABC-1234",
  "motorista": "João da Silva",
  "documentoReferencia": "NF-123456",
  "observacoes": "Entregar em horário comercial",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 100.5,
      "unidadeMedida": "kg",
      "precoUnitario": 25.50,
      "custoTotal": 2562.75,
      "observacoes": "Produto especial"
    }
  ]
}
```

### Resposta do Backend

**Sucesso (201)**:
```json
{
  "sucesso": true,
  "pedido": {
    "id": 15,
    "dataPedido": "2025-12-09T10:30:00Z",
    "status": "PENDENTE",
    "itens": [...]
  },
  "message": "Pedido criado com sucesso."
}
```

**Erro (400/500)**:
```json
{
  "sucesso": false,
  "erro": "Mensagem de erro",
  "detalhes": "Informações adicionais"
}
```

---

## 4. Validações Frontend

Os modais executam as seguintes validações **antes** de enviar ao backend:

- ✓ Fornecedor/Fazenda deve estar selecionado
- ✓ Pelo menos um item deve estar adicionado
- ✓ Cada item deve ter ID de produto, quantidade e preço
- ✓ Quantidade e preço devem ser números válidos
- ✓ Exibe mensagens de erro claras para o usuário

---

## 5. Tratamento de Erros

O modal exibe mensagens de erro do backend quando:
- Fornecedor não existe
- Produto não existe
- Dados inválidos foram enviados
- Erro no servidor (5xx)

---

## 6. Unidades de Medida Disponíveis

- **kg** - Quilograma
- **g** - Grama
- **L** - Litro
- **ml** - Mililitro
- **un** - Unidade
- **cx** - Caixa
- **dz** - Dúzia
- **m** - Metro
- **m2** - Metro Quadrado
- **m3** - Metro Cúbico

---

## 7. Tipos de Transporte Disponíveis

- **VEICULO_PROPRIO** - Veículo Próprio
- **TERCEIRO** - Terceiro
- **RETIRADA** - Retirada
- **SEDEX** - Sedex
- **PAC** - PAC

---

## 8. Próximas Melhorias (Sugestões)

- [ ] Autocomplete para seleção de produtos
- [ ] Validação de disponibilidade de produtos no estoque
- [ ] Integração com histórico de preços
- [ ] Cálculo automático de custos com desconto/taxa
- [ ] Integração com sistema de estoque para reserva automática
- [ ] Notificações ao fornecedor quando pedido é criado
- [ ] Rastreamento automático de status de pedido

---

## 9. Suporte

Para problemas ou dúvidas, verifique:
1. Console do navegador (F12) para erros JavaScript
2. Network tab para ver respostas do backend
3. Backend logs para erros de servidor
