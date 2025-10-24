-- CreateEnum
CREATE TYPE "public"."tipo_unidade" AS ENUM ('Matriz', 'Fazenda', 'Loja');

-- CreateEnum
CREATE TYPE "public"."tipo_lote" AS ENUM ('Gado', 'Soja', 'Leite', 'Outro');

-- CreateEnum
CREATE TYPE "public"."tipo_registro_sanitario" AS ENUM ('VACINA', 'MEDICACAO', 'RACAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."tipo_pagamento" AS ENUM ('DINHEIRO', 'CARTAO', 'PIX');

-- CreateTable
CREATE TABLE "public"."perfis" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fornecedores" (
    "id" SERIAL NOT NULL,
    "nome_empresa" VARCHAR(200) NOT NULL,
    "descricao_empresa" TEXT NOT NULL,
    "material" VARCHAR(150) NOT NULL,
    "cnpj_cpf" VARCHAR(20) NOT NULL,
    "contato" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "endereco" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidades" (
    "id" SERIAL NOT NULL,
    "gerente_id" INTEGER,
    "nome" VARCHAR(100) NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo" "public"."tipo_unidade" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "unidade_id" INTEGER,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reset_senhas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "codigo_reset" VARCHAR(6) NOT NULL,
    "codigo_expira" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_senhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lotes" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "responsavel_id" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" "public"."tipo_lote" NOT NULL,
    "qntd_itens" INTEGER NOT NULL,
    "observacoes" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "lote_id" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "categoria" VARCHAR(100),
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "data_fabricacao" TIMESTAMP(3) NOT NULL,
    "data_validade" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estoques" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "estoque_minimo" INTEGER NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estoques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos_fornecedores" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "fornecedor_id" INTEGER NOT NULL,
    "preco_custo" DECIMAL(10,2),
    "prazo_entrega_dias" INTEGER,
    "preferencial" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "produtos_fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."producoes" (
    "id" SERIAL NOT NULL,
    "lote_id" INTEGER NOT NULL,
    "tipo_produto" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade_medida" VARCHAR(50) NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "producoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rastreabilidade_lotes" (
    "id" SERIAL NOT NULL,
    "lote_origem_id" INTEGER NOT NULL,
    "lote_destino_id" INTEGER NOT NULL,
    "descricao" VARCHAR(255),
    "data_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rastreabilidade_lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registros_sanitarios" (
    "id" SERIAL NOT NULL,
    "lote_id" INTEGER NOT NULL,
    "tipo" "public"."tipo_registro_sanitario" NOT NULL,
    "produto" VARCHAR(255) NOT NULL,
    "data_aplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidade" DOUBLE PRECISION,
    "observacoes" TEXT,

    CONSTRAINT "registros_sanitarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."caixas" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "saldo_inicial" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "saldo_final" DECIMAL(12,2),
    "aberto_em" TIMESTAMP(3) NOT NULL,
    "fechado_em" TIMESTAMP(3),

    CONSTRAINT "caixas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendas" (
    "id" SERIAL NOT NULL,
    "caixa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "pagamento" "public"."tipo_pagamento" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens_vendas" (
    "id" SERIAL NOT NULL,
    "venda_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(12,2) NOT NULL,
    "desconto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "itens_vendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfis_nome_key" ON "public"."perfis"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cnpj_cpf_key" ON "public"."fornecedores"("cnpj_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_sku_key" ON "public"."produtos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "estoques_unidade_id_produto_id_key" ON "public"."estoques"("unidade_id", "produto_id");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_fornecedores_produto_id_fornecedor_id_key" ON "public"."produtos_fornecedores"("produto_id", "fornecedor_id");

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_gerente_id_fkey" FOREIGN KEY ("gerente_id") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reset_senhas" ADD CONSTRAINT "reset_senhas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lotes" ADD CONSTRAINT "lotes_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lotes" ADD CONSTRAINT "lotes_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "public"."lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estoques" ADD CONSTRAINT "estoques_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estoques" ADD CONSTRAINT "estoques_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos_fornecedores" ADD CONSTRAINT "produtos_fornecedores_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos_fornecedores" ADD CONSTRAINT "produtos_fornecedores_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."producoes" ADD CONSTRAINT "producoes_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "public"."lotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rastreabilidade_lotes" ADD CONSTRAINT "rastreabilidade_lotes_lote_origem_id_fkey" FOREIGN KEY ("lote_origem_id") REFERENCES "public"."lotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rastreabilidade_lotes" ADD CONSTRAINT "rastreabilidade_lotes_lote_destino_id_fkey" FOREIGN KEY ("lote_destino_id") REFERENCES "public"."lotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_sanitarios" ADD CONSTRAINT "registros_sanitarios_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "public"."lotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."caixas" ADD CONSTRAINT "caixas_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."caixas" ADD CONSTRAINT "caixas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_caixa_id_fkey" FOREIGN KEY ("caixa_id") REFERENCES "public"."caixas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_vendas" ADD CONSTRAINT "itens_vendas_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "public"."vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_vendas" ADD CONSTRAINT "itens_vendas_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
