## RuralTech – Plataforma de Gestão de Agronegócio

Sistema completo para gestão de fazendas e operações agro (estoque, financeiro, rebanho, plantio, vendas, fornecedores e relatórios), composto por:

- **Frontend web**: aplicação em **Next.js (App Router)** localizada em `frontend/web`
- **Backend**: API em **Node.js/Express** com **Prisma** e **PostgreSQL** (ex.: Supabase) localizada em `backend`

---

### Visão Geral

- **Gestão de fazendas**: cadastro de fazendas, dados gerais e perfis (`Fazendas`, `Perfil`, `DadosGerais`).
- **Rebanho e produção animal**: animais, matrizes, lotes, registros sanitários e atividades de lote.
- **Plantio e produção vegetal**: controle de plantio, plano de produção, unidades e fazendas.
- **Estoque e produtos**: estoque de produtos, lotes, unidades de venda, loja, notas e upload de documentos.
- **Financeiro**: fluxo de caixa, contas a pagar e receber, categorias financeiras e relatórios.
- **Fornecedores e contatos**: cadastro de fornecedores, contatos e envio de dúvidas.
- **Autenticação e perfis**: controle de acesso, JWT e gerenciamento de usuários.

A interface web foi pensada para uso diário em operações agro, com navegação por módulos (Fazenda, Estoque, Financeiro, etc.) e componentes reutilizáveis.

---

### Tecnologias Principais

- **Frontend**
  - Next.js (App Router) / React
  - Context API para temas, autenticação e inventário
  - CSS / PostCSS e utilitários em `globals.css` e `styles/utils.css`
  - Integração com backend via `src/lib/api.js`, `backendHealth.js` e services dedicados (ex.: `financeirosAPI.js`)

- **Backend**
  - Node.js / Express (`app.js`, `server.js`)
  - **Prisma ORM** com PostgreSQL (`prisma/schema.prisma`)
  - Autenticação JWT (`config/jwt.js`, `middlewares/authMiddleware.js`, `utils/auth.js`)
  - Envio de e-mails via Nodemailer (`config/nodemailer.js`, `utils/mailer.js`)
  - Organização em **controllers**, **models**, **routes** e **schemas** para validação

---

### Estrutura do Projeto

```text
sistema-agro/
  backend/
    api/
    config/
    controllers/
    middlewares/
    models/
    prisma/
    routes/
    schemas/
    utils/
    server.js

  frontend/
    web/
      src/
        app/
        components/
        config/
        contexts/
        hooks/
        lib/
        services/
        styles/
      package.json
```

---

### Pré-requisitos

- **Node.js** (versão LTS recomendada – 18+)
- **npm** (ou yarn/pnpm, se preferir)
- **PostgreSQL** em execução (local ou serviço gerenciado como Supabase)

---

### Configuração do Backend

1. **Instalar dependências**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente**

   Crie um arquivo `.env` na pasta `backend` com base no exemplo abaixo (ajuste conforme sua infra):

   ```bash
   # Banco de dados PostgreSQL (ex.: Supabase)
   # Formato típico: postgresql://usuario:senha@host:porta/banco
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/sistema_agro"

   # JWT
   JWT_SECRET="uma_chave_secreta_segura"
   JWT_EXPIRES_IN="7d"

   # E-mail (Nodemailer)
   MAIL_HOST=smtp.seuprovedor.com
   MAIL_PORT=587
   MAIL_USER=seu_usuario
   MAIL_PASSWORD=sua_senha
   MAIL_FROM="Sistema Agro <no-reply@seusistema.com>"
   ```

3. **Configurar o Prisma e o banco**

   - Ajuste `prisma/schema.prisma` se necessário para refletir sua base em PostgreSQL.
   - Rode as migrações/seed (se aplicável para este projeto), por exemplo:

   ```bash
   npx prisma migrate dev
   node prisma/seed.js
   ```

   > Verifique os scripts disponíveis em `backend/package.json` para o fluxo exato usado no projeto.

4. **Rodar o backend em desenvolvimento**

   ```bash
   cd backend
   npm run dev   # ou o script equivalente configurado (ex.: npm start)
   ```

   O servidor geralmente estará disponível em algo como `http://localhost:8080`.

---

### Configuração do Frontend (Web)

1. **Instalar dependências**

   ```bash
   cd frontend/web
   npm install
   ```

2. **Configurar variáveis de ambiente do frontend**

   Crie um arquivo `.env.local` em `frontend/web` para apontar para a API do backend, por exemplo:

   ```bash
   NEXT_PUBLIC_BACKEND_URL=<URL_DO_BACKEND>
   NEXT_PUBLIC_FEATURE_FLAG_X=<VALOR_DA_FEATURE_FLAG>
   ```

   Veja `src/lib/api.js` e `contexts` para identificar outras variáveis necessárias.

3. **Rodar o frontend em desenvolvimento**

   ```bash
   cd frontend/web
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

---

### Rodando o Sistema Completo em Desenvolvimento

1. **Suba o banco PostgreSQL** (local, Docker ou serviço gerenciado como Supabase).
2. **Inicie o backend**:

   ```bash
   cd backend
   npm run dev
   ```

3. **Inicie o frontend** em outro terminal:

   ```bash
   cd frontend/web
   npm run dev
   ```

4. Acesse `http://localhost:3000` no navegador.  
   O frontend consumirá a API exposta pelo backend conforme configurado nas variáveis de ambiente.

---

### Scripts Úteis

- **Backend (`backend/package.json`)**
  - **`npm run dev`**: inicia o servidor em modo desenvolvimento (com nodemon, se configurado).
  - **`npm start`**: inicia o servidor em modo produção.
  - **`npm run prisma:*`**: comandos do Prisma (migrate, generate, etc.), se presentes.

- **Frontend (`frontend/web/package.json`)**
  - **`npm run dev`**: roda o Next.js em modo desenvolvimento.
  - **`npm run build`**: gera build de produção.
  - **`npm run start`**: sobe o servidor Next.js em modo produção.
  - **`npm run lint`**: executa o linter (se configurado).

---

### Arquitetura do Backend

- **`controllers/`**: lógica de cada módulo (animais, estoque, fazenda, financeiro, fornecedores, plantio, etc.).
- **`models/`**: definição dos modelos de dados utilizados com Prisma/PostgreSQL.
- **`routes/`**: definição das rotas REST por recurso (ex.: `animaisRoutes.js`, `estoqueRoutes.js`, `financeiroRoutes.js`).
- **`middlewares/`**: autenticação JWT, upload de arquivos e outras responsabilidades transversais.
- **`schemas/`**: validações de entrada (por exemplo, criação/edição de produtos, unidades, lotes).
- **`utils/`**: funções de apoio (hash de senha, geração de segredos, envio de e-mails, etc.).

---

### Arquitetura do Frontend

- **`src/app`**: rotas do Next.js (App Router), páginas públicas e privadas, layouts e provedores.
- **`src/components`**: componentes reutilizáveis por domínio:
  - `Fazenda`, `Estoque`, `Financeiro`, `Blog`, `catalogo`, formulários de login/cadastro, tabelas, gráficos e etc.
- **`src/contexts`**: contextos de autenticação, tema, inventário e outros estados globais.
- **`src/hooks`**: hooks customizados (ex.: `useFinanceiro`, `useLocalStorage`, `useTranslation`).
- **`src/lib`**: utilitários de API, checagem de saúde do backend e funções de apoio.
- **`src/services`**: serviços específicos para comunicação com a API (por exemplo, financeiro).
- **`src/styles`**: estilos globais e utilitários CSS.

---

### Boas Práticas e Padrões

- **Separação por domínio**: cada módulo de negócio (estoque, financeiro, fazenda, etc.) possui controllers, models e rotas dedicados.
- **Camadas bem definidas**: o frontend só acessa o backend via serviços/`lib`, e o backend isola regras de negócio em controllers e schemas.
- **Uso de variáveis de ambiente**: não versionar segredos ou credenciais; use `.env`/`.env.local`.
- **Autenticação centralizada**: middleware de autenticação garante segurança nas rotas privadas.

---

### Deploy (Visão Geral)

O fluxo de deploy pode variar de acordo com a infraestrutura, mas em geral:

- **Backend**
  - Fazer build/empacotamento (se necessário).
  - Configurar variáveis de ambiente no servidor (ou serviço de hospedagem).
  - Garantir acesso ao banco PostgreSQL (Supabase, RDS, Cloud SQL, etc.).

- **Frontend**
  - Rodar `npm run build` em `frontend/web`.
  - Servir a aplicação Next.js (Vercel, Docker, ou servidor Node).
  - Apontar as variáveis `NEXT_PUBLIC_BACKEND_URL` para a URL pública do backend.
