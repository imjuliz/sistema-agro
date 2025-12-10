# Resumo das Alterações - Formulários de Criação de Pedidos

## Arquivos Criados

### 1. Modal de Pedido Externo (Fazenda)
**Arquivo**: `frontend/web/src/components/fornecedores-fazenda/CreatePedidoModal.jsx`
- Componente reutilizável para criar pedidos externos
- Aceita props: `open`, `onOpenChange`, `unidadeId`, `tipo`, `fornecedores`, `contratos`, `onPedidoCreated`
- Features:
  - Seleção de fornecedor externo
  - Seleção opcional de contrato
  - Informações de transporte (tipo, placa, motorista)
  - Formulário dinâmico para adicionar múltiplos itens
  - Cálculo automático de total
  - Validações em tempo real
  - Feedback visual (erro/sucesso)

### 2. Modal de Pedido Interno (Loja)
**Arquivo**: `frontend/web/src/components/fornecedores-loja/CreatePedidoLojaModal.jsx`
- Componente para lojas criarem pedidos para fazendas
- Aceita props: `open`, `onOpenChange`, `unidadeId`, `fornecedores`, `onPedidoCreated`
- Mesmos recursos que o modal externo, adaptado para contexto interno

### 3. Documentação
**Arquivo**: `docs/PEDIDOS_FORMULARIOS.md`
- Guia completo de uso
- Estrutura de payloads
- Validações e tratamento de erros
- Sugestões de melhorias futuras

---

## Arquivos Modificados

### 1. ConsumerDashboard (Fazenda)
**Arquivo**: `frontend/web/src/components/fornecedores-fazenda/ConsumerDashboard.jsx`

**Alterações**:
- ✅ Importado `CreatePedidoModal`
- ✅ Adicionado estado `showCreatePedidoModal`
- ✅ Atualizada função `ContratosComoConsumidor` com:
  - Props: `unidadeId`, `onShowCreatePedido`
  - Botão "Criar Pedido" na área de pedidos
- ✅ Integrado `CreatePedidoModal` com callbacks

### 2. ConsumerDashboard (Loja)
**Arquivo**: `frontend/web/src/components/fornecedores-loja/ConsumerDashboard.jsx`

**Alterações**:
- ✅ Importado `CreatePedidoLojaModal`
- ✅ Adicionado estado `showCreatePedidoModal`
- ✅ Atualizada função `ContratosComoConsumidor` com:
  - Props: `unidadeId`, `onShowCreatePedido`
  - Botão "Criar Pedido" na área de pedidos
- ✅ Integrado `CreatePedidoLojaModal` com callbacks

---

## Fluxo de Dados

### Pedido Externo (Fazenda → Fornecedor)
```
User clica "Criar Pedido" 
  → Modal CreatePedidoModal abre
  → User seleciona fornecedor + adiciona itens
  → Clica "Criar Pedido"
  → POST /pedidos-externos/:unidadeId
  → Backend cria Pedido + PedidoItems
  → Modal fecha, lista de pedidos atualiza
```

### Pedido Interno (Loja → Fazenda)
```
User clica "Criar Pedido"
  → Modal CreatePedidoLojaModal abre
  → User seleciona fazenda + adiciona itens
  → Clica "Criar Pedido"
  → POST /pedidos-internos/:unidadeId
  → Backend cria Pedido + PedidoItems
  → Modal fecha, lista de pedidos atualiza
```

---

## Componentes UI Utilizados

- `Button` - Botões
- `Input` - Campos de texto
- `Label` - Rótulos
- `Dialog` / `DialogContent` / `DialogHeader` - Modal
- `Select` / `SelectTrigger` / `SelectContent` / `SelectItem` - Dropdowns
- `Textarea` - Área de texto
- `Card` - Cartões
- `Badge` - Badges informativos
- `AlertCircle` - Ícone de alerta/sucesso

---

## Endpoints Backend Utilizados

### Criar Pedido Externo
- **Método**: POST
- **Rota**: `/pedidos-externos/:unidadeId`
- **Auth**: GERENTE_FAZENDA, FUNCIONARIO_FAZENDA, GERENTE_MATRIZ
- **Body**: Payload com itens, transporte, observações

### Criar Pedido Interno
- **Método**: POST
- **Rota**: `/pedidos-internos/:unidadeId`
- **Auth**: GERENTE_LOJA, FUNCIONARIO_LOJA, GERENTE_MATRIZ
- **Body**: Payload com destinoUnidadeId, itens, transporte

---

## Validações Implementadas

### Frontend
- ✓ Fornecedor/Fazenda obrigatório
- ✓ Mínimo 1 item no pedido
- ✓ Cada item deve ter: ID, quantidade, preço
- ✓ Números válidos para quantidade/preço
- ✓ Displays de erro inline

### Backend (via API)
- ✓ Array de itens não-vazio
- ✓ Autenticação por roles
- ✓ Validação de IDs existentes
- ✓ Cálculo de custos totais

---

## Estados do Modal

1. **Inicial**: Modal fechado
2. **Aberto**: Formulário exibido
3. **Carregando**: Durante submissão (botão desabilitado)
4. **Sucesso**: Mensagem verde + auto-fechamento (1.5s)
5. **Erro**: Mensagem vermelha + permanece aberto

---

## Integração com Backend Existente

Os modais se integram com as funções backend existentes:
- `criarPedido()` em `backend/models/Fornecedores.js`
- `createPedidoInternoController()` em `backend/controllers/FornecedorController.js`
- `createPedidoExternoController()` em `backend/controllers/FornecedorController.js`
- Rotas em `backend/routes/appRoutes.js`

---

## Testes Recomendados

### Teste 1: Criar Pedido Externo
1. Login como GERENTE_FAZENDA
2. Ir para fornecedores-fazenda
3. Aba "Contratos como consumidor"
4. Clique "Criar Pedido"
5. Selecione fornecedor
6. Adicione item (ID: 1, Qtd: 10, Preço: 25.50)
7. Clique "Criar Pedido"
8. Espere mensagem de sucesso

### Teste 2: Criar Pedido Interno
1. Login como GERENTE_LOJA
2. Ir para fornecedores-loja
3. Clique "Criar Pedido"
4. Selecione fazenda
5. Adicione item (ID: 2, Qtd: 5, Preço: 50.00)
6. Clique "Criar Pedido"
7. Espere mensagem de sucesso

### Teste 3: Validações
1. Tente criar pedido sem selecionar fornecedor → Erro
2. Tente criar pedido sem itens → Erro
3. Tente adicionar item sem dados → Erro
4. Remova item adicionado → OK

---

## Performance

- Modal utiliza `useState` para gerenciamento de estado
- Cálculos de total são síncronos (sem re-renders desnecessários)
- Validações executadas antes de requisições
- Loading state desabilita botões durante requisição

---

## Acessibilidade

- Labels associados com `htmlFor`
- Ícones com aria-labels em desenvolvimento
- Estrutura semântica com Dialog
- Teclado navegável

---

## Próximas Melhorias

- [ ] Busca de produtos com autocomplete
- [ ] Verificação de estoque em tempo real
- [ ] Sugestão de preços históricos
- [ ] Integração com sistema de pedidos anterior
- [ ] Exportação de pedido como PDF
- [ ] Agendamento de pedidos para data futura
- [ ] Notificações em tempo real
- [ ] Histórico de pedidos filtráveis
