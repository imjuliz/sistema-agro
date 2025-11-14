// import bcrypt from "bcryptjs";
// // arquivo para popular o banco com dados iniciais
// import { configDotenv } from "dotenv";
// configDotenv();
// import prisma from "./client.js";
// import pkg from "./generated/index.js";
// const { TipoUnidade } = pkg;

// async function main() {
//     try {
//         // Validar conexão com o banco
//         console.log("Conectando ao banco de dados...");
//         await prisma.$connect();
//         console.log("Conexão com banco estabelecida com sucesso");

//     // Limpar dados antigos
//         console.log("Limpando dados antigos...");
//         await prisma.usuario.deleteMany({});
//         await prisma.unidade.deleteMany({});
//         await prisma.perfil.deleteMany({});

//         console.log("Dados antigos apagados com sucesso");
//     } catch (error) {
//         console.error("Erro ao conectar ou limpar dados:", error);
//         throw error;
//     }

//     // Criar perfis
//     console.log("Criando perfis de usuário...");
//     const perfisResult = await prisma.perfil.createMany({
//         data: [
//             { nome: "gerente_matriz", descricao: "Gerente da matriz ou administração central" },
//             { nome: "gerente_fazenda", descricao: "Gerente responsável pela fazenda" },
//             { nome: "gerente_loja", descricao: "Gerente responsável pela loja ou filial" },
//         ],
//         skipDuplicates: true,
//     });
//     console.log(`${perfisResult.count} perfis criados com sucesso`);

//     // Criar unidades
//     console.log("Criando unidades do sistema...");
//     const unidadesData = [
//         { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 123, Zona Rural, São Paulo - SP", tipo: pkg.TipoUnidade.Fazenda, gerenteId: null, status: true },
//         { nome: "Fazenda Beta", endereco: "Estrada do Campo, s/n, Zona Rural, Campinas - SP", tipo: pkg.TipoUnidade.Fazenda, gerenteId: null, status: true },
//         { nome: "Loja Central", endereco: "Av. Principal, 456, Centro, São Paulo - SP, CEP: 01310-100", tipo: pkg.TipoUnidade.Loja, gerenteId: null, status: true },
//         { nome: "Loja Norte", endereco: "Rua das Flores, 789, Zona Norte, São Paulo - SP, CEP: 02456-000", tipo: pkg.TipoUnidade.Loja, gerenteId: null, status: true },
//         { nome: "Matriz São Paulo", endereco: "Av. Empresarial, 1000, Centro, São Paulo - SP, CEP: 01310-200", tipo: pkg.TipoUnidade.Matriz, gerenteId: null, status: true },
//         { nome: "Matriz Campinas", endereco: "Rua Corporativa, 200, Distrito Industrial, Campinas - SP, CEP: 13050-000", tipo: pkg.TipoUnidade.Matriz, gerenteId: null, status: true},
//     ];

//     const unidadesCriadas = await prisma.unidade.createMany({
//         data: unidadesData,
//         skipDuplicates: true,
//     });
//     console.log(`${unidadesCriadas.count} unidades criadas com sucesso`);

//     console.log("Seed executado com sucesso! Banco de dados populado com dados iniciais.");

//     // Buscar IDs de perfis e unidades
//     const perfis = await prisma.perfil.findMany();
//     const unidades = await prisma.unidade.findMany();

//     const perfilMap = Object.fromEntries(perfis.map(p => [p.nome, p.id]));
//     const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));

//     // Criar usuários
//     const senhaHash = await bcrypt.hash("123456", 10);

//     const usuariosData = [
//         // Administradores
//         { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, telefone: "(11) 98765-1001", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz São Paulo"], status: true },
//         { nome: "Lorena Oshiro", email: "lorena.oshiro@example.com", senha: senhaHash, telefone: "(11) 98765-1002", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz São Paulo"], status: true },
//         { nome: "Maria Del Rey", email: "maria.delrey@example.com", senha: senhaHash, telefone: "(19) 98765-1003", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz Campinas"], status: true },
//         { nome: "Richard Sousa", email: "richard.sousa@example.com", senha: senhaHash, telefone: "(19) 98765-1004", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz Campinas"], status: true },

//         // Gerente Fazenda
//         { nome: "Carlos Silva", email: "carlos.silva@example.com", senha: senhaHash, telefone: "(11) 98765-2001", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
//         { nome: "Ana Costa", email: "ana.costa@example.com", senha: senhaHash, telefone: "(11) 98765-2002", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
//         { nome: "Paulo Lima", email: "paulo.lima@example.com", senha: senhaHash, telefone: "(19) 98765-2003", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
//         { nome: "Fernanda Rocha", email: "fernanda.rocha@example.com", senha: senhaHash, telefone: "(19) 98765-2004", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Beta"], status: true },

//         // Gerente Loja
//         { nome: "Bruno Pereira", email: "bruno.pereira@example.com", senha: senhaHash, telefone: "(11) 98765-3001", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Central"], status: true },
//         { nome: "Carla Mendes", email: "carla.mendes@example.com", senha: senhaHash, telefone: "(11) 98765-3002", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Central"], status: true },
//         { nome: "Thiago Santos", email: "thiago.santos@example.com", senha: senhaHash, telefone: "(11) 98765-3003", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Norte"], status: true },
//         { nome: "Juliana Fernandes", email: "juliana.fernandes@example.com", senha: senhaHash, telefone: "(11) 98765-3004", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Norte"], status: true },
//     ];

//     await prisma.usuario.createMany({
//         data: usuariosData,
//         skipDuplicates: true,
//     });
//     console.log(`${usuariosData.length} usuários criados com sucesso`);
//     }

// main()
//     .catch((error) => {
//         console.error("Erro durante execução do seed:", error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         console.log("Desconectando do banco de dados...");
//         await prisma.$disconnect();
//         console.log("Desconectado com sucesso");
//     });
// seed_full.js
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import pkg from "./generated/index.js"; // contém enums e possivelmente Decimal/Prisma expostos

const { TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida } = pkg;

async function main() {
    try {
        console.log("Conectando ao banco...");
        await prisma.$connect();

        // ===== Limpeza (ordem pensada para FK) =====
        console.log("Limpando dados antigos...");
        await prisma.itemVenda.deleteMany({});
        await prisma.venda.deleteMany({});
        await prisma.caixa.deleteMany({});
        await prisma.estoque.deleteMany({});
        await prisma.produtoFornecedor.deleteMany({});
        await prisma.fornecedor.deleteMany({});
        await prisma.contratos.deleteMany({});
        await prisma.registroSanitario.deleteMany({});
        await prisma.rastreabilidadeLote.deleteMany({});
        await prisma.producao.deleteMany({});
        await prisma.atividadesLote.deleteMany({});
        await prisma.produto.deleteMany({});
        await prisma.lote.deleteMany({});
        await prisma.saidas.deleteMany({});
        await prisma.sessao.deleteMany({});
        await prisma.resetSenha.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.unidade.deleteMany({});
        await prisma.perfil.deleteMany({});
        console.log("Limpeza concluída");

        // ===== Perfis =====
        console.log("Criando perfis...");
        const perfis = await prisma.perfil.createMany({
            data: [
                { nome: "gerente_matriz", descricao: "Gerente da matriz ou administração central", funcao: "MATRIZ" },
                { nome: "gerente_fazenda", descricao: "Gerente responsável pela fazenda", funcao: "PRODUCAO" },
                { nome: "gerente_loja", descricao: "Gerente responsável pela loja ou filial", funcao: "VENDA" },
            ],
            skipDuplicates: true,
        });
        console.log("Perfis criados.");

        // Buscar perfis para map
        const perfisDb = await prisma.perfil.findMany();
        const perfilMap = Object.fromEntries(perfisDb.map(p => [p.nome, p.id]));

        // ===== Unidades =====
        console.log("Criando unidades...");
        const unidadesData = [
            { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 123, Zona Rural, São Paulo - SP", tipo: TipoUnidade.Fazenda, status: true },
            { nome: "Fazenda Beta", endereco: "Estrada do Campo, s/n, Zona Rural, Campinas - SP", tipo: TipoUnidade.Fazenda, status: true },
            { nome: "Loja Central", endereco: "Av. Principal, 456, Centro, São Paulo - SP", tipo: TipoUnidade.Loja, status: true },
            { nome: "Loja Norte", endereco: "Rua das Flores, 789, Zona Norte, São Paulo - SP", tipo: TipoUnidade.Loja, status: true },
            { nome: "Matriz São Paulo", endereco: "Av. Empresarial, 1000, Centro, São Paulo - SP", tipo: TipoUnidade.Matriz, status: true },
        ];

        await prisma.unidade.createMany({ data: unidadesData, skipDuplicates: true });
        const unidades = await prisma.unidade.findMany();
        const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));
        console.log("Unidades criadas.");

        // ===== Usuários =====
        console.log("Criando usuários...");
        const senhaHash = await bcrypt.hash("123456", 10);

        const usuariosData = [
            { nome: "Julia Alves", email: "juliaalves@example.com", senha: senhaHash, telefone: "(11) 98765-1001", perfilId: perfilMap["gerente_matriz"], unidadeId: unidadeMap["Matriz São Paulo"], status: true },
            { nome: "Carlos Silva", email: "carlos.silva@example.com", senha: senhaHash, telefone: "(11) 98765-2001", perfilId: perfilMap["gerente_fazenda"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
            { nome: "Bruno Pereira", email: "bruno.pereira@example.com", senha: senhaHash, telefone: "(11) 98765-3001", perfilId: perfilMap["gerente_loja"], unidadeId: unidadeMap["Loja Central"], status: true },
        ];

        await prisma.usuario.createMany({ data: usuariosData, skipDuplicates: true });
        const usuarios = await prisma.usuario.findMany();
        const usuarioMap = Object.fromEntries(usuarios.map(u => [u.nome, u.id]));
        console.log("Usuários criados.");

        // ===== Fornecedores =====
        console.log("Criando fornecedores...");
        const fornecedores = [
            {
                nomeEmpresa: "AgroFornecimentos Ltda",
                descricaoEmpresa: "Fornece rações e insumos",
                material: "Ração, Fertilizante",
                cnpjCpf: "12.345.678/0001-90",
                contato: "Paulo",
                email: "contato@agrofornece.com",
                endereco: "Rua do Agronegócio, 100",
                unidadeId: unidadeMap["Fazenda Alpha"],
            },
            {
                nomeEmpresa: "Distribuidora Central",
                descricaoEmpresa: "Distribuição para lojas",
                material: "Embalagens, Produtos secos",
                cnpjCpf: "98.765.432/0001-11",
                contato: "Mariana",
                email: "vendas@distcentral.com",
                endereco: "Av. Distribuição, 500",
                unidadeId: unidadeMap["Loja Central"],
            },
        ];
        await prisma.fornecedor.createMany({ data: fornecedores, skipDuplicates: true });
        const fornecedoresDb = await prisma.fornecedor.findMany();
        const fornecedorMap = Object.fromEntries(fornecedoresDb.map(f => [f.nomeEmpresa, f.id]));
        console.log("Fornecedores criados.");

        // ===== Lotes =====
        console.log("Criando lotes...");
        const lotesData = [
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                responsavelId: usuarioMap["Carlos Silva"],
                nome: "Lote Gado 2025-01",
                tipo: TipoLote.Gado,
                qntdItens: 120,
                observacoes: "Lote destinado à engorda",
                dataCriacao: new Date(),
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                responsavelId: usuarioMap["Carlos Silva"],
                nome: "Lote Soja 2025-01",
                tipo: TipoLote.Soja,
                qntdItens: 50,
                observacoes: "Plantio inicial",
                dataCriacao: new Date(),
            },
        ];

        await prisma.lote.createMany({ data: lotesData, skipDuplicates: true });
        const lotesDb = await prisma.lote.findMany();
        const loteMap = Object.fromEntries(lotesDb.map(l => [l.nome, l.id]));
        console.log("Lotes criados.");

        // ===== Produtos =====
        console.log("Criando produtos...");
        const produtosData = [
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-01"], // <-- usar id real do lote
                nome: "Ração Bovino Premium",
                sku: "RACAO-BOV-001",
                categoria: "Ração",
                descricao: "Ração balanceada para bovinos",
                preco: "150.00",
                dataFabricacao: new Date(),
                dataValidade: new Date(new Date().getTime() + 365 * 24 * 3600 * 1000),
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],      // <-- usar a unidade que corresponde ao lote "Lote Soja 2025-01"
                loteId: loteMap["Lote Soja 2025-01"],      // <-- usar id real do lote
                nome: "Fertilizante NPK 20-20-20",
                sku: "FERT-20-001",
                categoria: "Fertilizante",
                descricao: "Fertilizante granulado",
                preco: "80.50",
                dataFabricacao: new Date(),
                dataValidade: new Date(new Date().getTime() + 720 * 24 * 3600 * 1000),
            },
        ];

        await prisma.produto.createMany({ data: produtosData, skipDuplicates: true });

        // buscar produtos e extrair IDs usados adiante
        let produtosDb = await prisma.produto.findMany();
        const produtoMap = Object.fromEntries(produtosDb.map(p => [p.sku, p.id]));
        console.log("Produtos criados.");

        // Extrai IDs que serão usados nos estoques, fornecedores, vendas, contratos etc.
        const produtoRacaoId = produtoMap["RACAO-BOV-001"];
        const produtoFertId = produtoMap["FERT-20-001"];

        // validação clara para erro em runtime (ajuda a debugar se os SKUs não existirem)
        if (!produtoRacaoId || !produtoFertId) {
            throw new Error(
                `IDs de produtos não encontrados: RACAO-BOV-001 -> ${produtoRacaoId}, FERT-20-001 -> ${produtoFertId}. ` +
                `Verifique se os SKUs foram criados corretamente no banco.`
            );
        }

        // ===== Estoques =====
        console.log("Criando estoques...");
        await prisma.estoque.createMany({
            data: [
                { unidadeId: unidadeMap["Fazenda Alpha"], produtoId: produtoRacaoId, quantidade: 500, estoqueMinimo: 50 },
                { unidadeId: unidadeMap["Loja Central"], produtoId: produtoFertId, quantidade: 200, estoqueMinimo: 20 },
            ],
            skipDuplicates: true,
        });
        console.log("Estoques criados.");

        // ===== ProdutoFornecedor (preço, prazo) =====
        console.log("Ligando produtos a fornecedores...");
        await prisma.produtoFornecedor.createMany({
            data: [
                {
                    produtoId: produtoRacaoId,
                    fornecedorId: fornecedorMap["AgroFornecimentos Ltda"],
                    quantidade: 100,
                    unidade_medida: UnidadesDeMedida.SACA,
                    precoCusto: "120.00",
                    prazoEntregaDias: 7,
                    preferencial: true,
                    id_contrato: 0,
                },
                {
                    produtoId: produtoFertId,
                    fornecedorId: fornecedorMap["Distribuidora Central"],
                    quantidade: 50,
                    unidade_medida: UnidadesDeMedida.KG,
                    precoCusto: "60.00",
                    prazoEntregaDias: 5,
                    preferencial: false,
                    id_contrato: 0,
                },
            ],
            skipDuplicates: true,
        });
        console.log("Produtos<->Fornecedores criados.");

        // ===== Produções =====
        console.log("Criando produções...");
        await prisma.producao.createMany({
            data: [
                {
                    loteId: loteMap["Lote Gado 2025-01"],
                    tipoProduto: "Carcaça",
                    quantidade: 10.5,
                    unidadeMedida: "cabeça",
                    dataRegistro: new Date(),
                },
                {
                    loteId: loteMap["Lote Soja 2025-01"],
                    tipoProduto: "Soja em grão",
                    quantidade: 2000,
                    unidadeMedida: "KG",
                    dataRegistro: new Date(),
                },
            ],
            skipDuplicates: true,
        });
        console.log("Produções criadas.");

        // ===== Rastreabilidade =====
        console.log("Criando rastreabilidade entre lotes (exemplo)...");
        await prisma.rastreabilidadeLote.create({
            data: {
                loteOrigemId: loteMap["Lote Gado 2025-01"],
                loteDestinoId: loteMap["Lote Soja 2025-01"],
                descricao: "Transição de material de teste",
            },
        });
        console.log("Rastreabilidade criada.");

        // ===== Atividades Lote =====
        console.log("Criando atividades de lote...");
        await prisma.atividadesLote.createMany({
            data: [
                {
                    descricao: "Adubação inicial",
                    tipo: AtividadesEnum.ADUBACAO,
                    loteId: loteMap["Lote Soja 2025-01"],
                    data: new Date(),
                    responsavelId: usuarioMap["Carlos Silva"],
                },
                {
                    descricao: "Primeira vacinação",
                    tipo: AtividadesEnum.PLANTIO,
                    loteId: loteMap["Lote Gado 2025-01"],
                    data: new Date(),
                    responsavelId: usuarioMap["Carlos Silva"],
                },
            ],
            skipDuplicates: true,
        });
        console.log("Atividades criadas.");

        // ===== Registro Sanitario =====
        console.log("Criando registros sanitários...");
        await prisma.registroSanitario.createMany({
            data: [
                {
                    loteId: loteMap["Lote Gado 2025-01"],
                    tipo: TipoRegistroSanitario.VACINA,
                    produto: "Vacina XYZ",
                    dataAplicacao: new Date(),
                    quantidade: 120,
                    observacoes: "Dose única",
                },
            ],
            skipDuplicates: true,
        });
        console.log("Registros sanitários criados.");

        // ===== Contratos (Fornecedor <-> Loja) =====
        console.log("Criando contratos...");
        // Para contratos precisamos de unidades que representem fornecedor (unidade id) e loja (unidade id).
        // Usaremos unidadeMap["Loja Central"] como loja e unidadeMap["Fazenda Alpha"] como fornecedor (conforme model)
        await prisma.contratos.createMany({
            data: [
                {
                    fornecedor_id: unidadeMap["Fazenda Alpha"],
                    produto_id: produtoRacaoId,
                    loja_id: unidadeMap["Loja Central"],
                    dataInicio: new Date(),
                    dataFim: new Date(new Date().getTime() + 365 * 24 * 3600 * 1000),
                    status: StatusContrato.ATIVO,
                    frequencia_entregas: FrequenciaEnum.MENSALMENTE,
                    frequencia_pagamento: FrequenciaEnum.MENSALMENTE,
                    valorTotal: 100000,
                },
            ],
            skipDuplicates: true,
        });
        console.log("Contratos criados.");

        // ===== Caixa, Venda, Itens de Venda =====
        console.log("Criando caixa e vendas de exemplo...");
        const caixa = await prisma.caixa.create({
            data: {
                unidadeId: unidadeMap["Loja Central"],
                usuarioId: usuarioMap["Bruno Pereira"],
                status: true,
                saldoInicial: "1000.00",
                abertoEm: new Date(),
            },
        });

        const venda = await prisma.venda.create({
            data: {
                caixaId: caixa.id,
                usuarioId: usuarioMap["Bruno Pereira"],
                unidadeId: unidadeMap["Loja Central"],
                total: "380.50",
                pagamento: TipoPagamento.PIX,
                criadoEm: new Date(),
            },
        });

        await prisma.itemVenda.createMany({
            data: [
                {
                    vendaId: venda.id,
                    produtoId: produtoFertId,
                    quantidade: 2,
                    precoUnitario: "80.50",
                    desconto: "0.00",
                    subtotal: "161.00",
                },
                {
                    vendaId: venda.id,
                    produtoId: produtoRacaoId,
                    quantidade: 1,
                    precoUnitario: "150.00",
                    desconto: "0.00",
                    subtotal: "150.00",
                },
            ],
            skipDuplicates: true,
        });

        // Atualiza saldoFinal do caixa só para exemplo
        await prisma.caixa.update({
            where: { id: caixa.id },
            data: { saldoFinal: "1380.50", status: false, fechadoEm: new Date() },
        });
        console.log("Caixa e venda criados.");

        // ===== Saídas (despesas) =====
        console.log("Criando saídas...");
        await prisma.saidas.createMany({
            data: [
                {
                    usuarioId: usuarioMap["Bruno Pereira"],
                    unidadeId: unidadeMap["Loja Central"],
                    descricao: "Pagamento de conta de energia",
                    tipo: TipoSaida.ENERGIA,
                    valor: "500.00",
                    data: new Date(),
                },
            ],
            skipDuplicates: true,
        });
        console.log("Saídas criadas.");

        // ===== Sessões e ResetSenha (exemplos) =====
        console.log("Criando sessão e reset de senha...");
        await prisma.sessao.create({
            data: {
                id: "session_example_1",
                usuarioId: usuarioMap["Julia Alves"],
                refreshTokenHash: "hash_exemplo_refreshtoken",
                userAgent: "seed-script/1.0",
                ip: "127.0.0.1",
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
                revoked: false,
            },
        });

        await prisma.resetSenha.create({
            data: {
                usuarioId: usuarioMap["Julia Alves"],
                codigoReset: "123456",
                codigoExpira: new Date(Date.now() + 60 * 60 * 1000),
                usado: false,
            },
        });
        console.log("Sessão e reset de senha criados.");

        console.log("SEED finalizado com sucesso!");
    } catch (error) {
        console.error("Erro durante seed:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
        console.log("Desconectado do banco.");
    }
}

main();
