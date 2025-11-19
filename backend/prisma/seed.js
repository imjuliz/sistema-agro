import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import * as pkg from "@prisma/client"; // mais seguro que named imports

// Extrai enums (podem ficar undefined se seu schema não os exportar)
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, } = pkg;

// fallback simples caso enums não sejam exportados
const TP = TipoPerfil ?? {
    GERENTE_MATRIZ: "GERENTE_MATRIZ",
    GERENTE_FAZENDA: "GERENTE_FAZENDA",
    GERENTE_LOJA: "GERENTE_LOJA",
};
const TU = TipoUnidade ?? { MATRIZ: "MATRIZ", FAZENDA: "FAZENDA", LOJA: "LOJA" };
const TL = TipoLote ?? { GADO: "GADO", SOJA: "SOJA", LEITE: "LEITE", OUTRO: "OUTRO" };
const TRS = TipoRegistroSanitario ?? { VACINA: "VACINA", MEDICACAO: "MEDICACAO", RACAO: "RACAO", OUTRO: "OUTRO" };
const TPAG = TipoPagamento ?? { DINHEIRO: "DINHEIRO", CARTAO: "CARTAO", PIX: "PIX" };
const TSAIDA = TipoSaida ?? { ALUGUEL: "ALUGUEL", AGUA: "AGUA", ENERGIA: "ENERGIA", MANUTENCAO: "MANUTENCAO", SALARIOS: "SALARIOS", ESTOQUE: "ESTOQUE" };
const TAT = AtividadesEnum ?? { PLANTIO: "PLANTIO", ADUBACAO: "ADUBACAO", FERTILIZACAO: "FERTILIZACAO" };
const SCON = StatusContrato ?? { ATIVO: "ATIVO", INATIVO: "INATIVO" };
const FREQ = FrequenciaEnum ?? { SEMANALMENTE: "SEMANALMENTE", QUINZENAL: "QUINZENAL", MENSALMENTE: "MENSALMENTE" };
const UMED = UnidadesDeMedida ?? { KG: "KG", UNIDADE: "UNIDADE", LITRO: "LITRO", SACA: "SACA" };


// npx prisma db seed
async function main() {
    try {
        console.log("Conectando ao banco...");
        await prisma.$connect();

        // // ===== Limpeza (ordem pensada para FK) =====
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
                { funcao: TP.GERENTE_MATRIZ, descricao: "Gerente da matriz ou administração central" },
                { funcao: TP.GERENTE_FAZENDA, descricao: "Gerente responsável pela fazenda" },
                { funcao: TP.GERENTE_LOJA, descricao: "Gerente responsável pela loja ou filial" },
            ],
            skipDuplicates: true,
        });
        console.log("Perfis criados.");

        // Buscar perfis para map
        const perfisDb = await prisma.perfil.findMany();
        const perfilMap = Object.fromEntries(perfisDb.map(p => [String(p.funcao), p.id]));

        // // ===== Unidades =====
        console.log("Criando unidades...");
        const unidadesData = [
            { nome: "RuralTech", endereco: "Av. Empresarial, 1000", tipo: TU.MATRIZ, cidade: "São Paulo", estado: "SP", cep: "01000-000", latitude: -23.55052, longitude: -46.633308, cnpj: "12345678000101", email: "ruraltech91@gmail.com", telefone: "1140000001" },
            { nome: "VerdeFresco Hortaliças", endereco: "Av. Central, 1", tipo: TU.LOJA, cidade: "São Paulo", estado: "SP", cep: "01001-001", latitude: -23.5450, longitude: -46.6340, cnpj: "12345678000202", email: "lojacentral@empresa.com", telefone: "1140000002", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T19:00:00Z'), },
            { nome: "AgroBoi", endereco: "Rua Norte, 23", tipo: TU.LOJA, cidade: "Guarulhos", estado: "SP", cep: "07010-000", latitude: -23.4628, longitude: -46.5333, cnpj: "12345678000303", email: "lojanorte@empresa.com", telefone: "1140000003", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T18:00:00Z'), },
            { nome: "Casa Útil Mercado", endereco: "Av. Sul, 45", tipo: TU.LOJA, cidade: "Santo André", estado: "SP", cep: "09010-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678000404", email: "lojasul@empresa.com", telefone: "1140000004", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), },
            { nome: "Sabor do Campo Laticínios", endereco: "Praça Leste, 10", tipo: TU.LOJA, cidade: "São Bernardo", estado: "SP", cep: "09810-000", latitude: -23.6916, longitude: -46.5644, cnpj: "12345678000505", email: "lojaleste@empresa.com", telefone: "1140000005", horarioAbertura: new Date('1970-01-01T09:30:00Z'), horarioFechamento: new Date('1970-01-01T19:30:00Z'), },
            { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 100", tipo: TU.FAZENDA, cidade: "Campinas", estado: "SP", cep: "13010-000", areaTotal: 1500.5, areaProdutiva: 1200.3, latitude: -22.9099, longitude: -47.0626, cnpj: "12345678100110", email: "fazendaalpha@empresa.com", telefone: "1930001001" },
            { nome: "Fazenda Gamma", endereco: "Rod. BR-101, km 150", tipo: TU.FAZENDA, cidade: "Ribeirão Preto", estado: "SP", cep: "14010-000", areaTotal: 980.75, areaProdutiva: 760.0, latitude: -21.1775, longitude: -47.8103, cnpj: "12345678100220", email: "fazendabeta@empresa.com", telefone: "1630001002" },
            { nome: "Fazenda Beta", endereco: "Estrada Rural, 77", tipo: TU.FAZENDA, cidade: "Piracicaba", estado: "SP", cep: "13400-000", areaTotal: 420.0, areaProdutiva: 365.25, latitude: -22.7127, longitude: -47.6476, cnpj: "12345678100330", email: "fazendagamma@empresa.com", telefone: "1930001003" },
            { nome: "Fazenda Delta", endereco: "Estrada Rural, 88", tipo: TU.FAZENDA, cidade: "Limeira", estado: "SP", cep: "13480-000", areaTotal: 600.0, areaProdutiva: 480.5, latitude: -22.5641, longitude: -47.4019, cnpj: "12345678100440", email: "fazendadelta@empresa.com", telefone: "1930001004" },
            { nome: "Unidade Teste", endereco: "Rua Teste, 9", tipo: TU.FAZENDA, cidade: "Itu", estado: "SP", cep: "13300-000", areaTotal: 50.0, areaProdutiva: 40.0, latitude: -23.2646, longitude: -47.2995, cnpj: "12345678100550", email: "teste@empresa.com", telefone: "1140000099" },
        ];
        await prisma.unidade.createMany({ data: unidadesData, skipDuplicates: true });
        const unidades = await prisma.unidade.findMany();
        const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));
        const lojas = unidades.filter(u => u.tipo === TU.LOJA);
        const fazendas = unidades.filter(u => u.tipo === TU.FAZENDA);
        console.log("Unidades criadas:", unidades.length);

        // ===== Usuários =====
        console.log("Criando usuários...");
        const senhaHash = await bcrypt.hash("123456", 10);

        const usuariosRuralTech = [
            { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, telefone: "11987651001", perfilId: perfilMap["GERENTE_MATRIZ"], unidadeId: unidadeMap["RuralTech"], status: true },
            { nome: "Lorena Oshiro", email: "lorenaoshiro2007@gmail.com", senha: senhaHash, telefone: "11987652001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            { nome: "Maria Del Rey", email: "mebdelrey@gmail.com", senha: senhaHash, telefone: "11987653001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Richard Souza", email: "richardrrggts@gmail.com", senha: senhaHash, telefone: "11916694683", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
        ]
        const usuariosFicticios = [
            { nome: "Usuario Ficticio", email: "user.teste@gmail.com", senha: senhaHash, telefone: "11995251689", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Unidade Teste"], status: true },
            { nome: "Otávio Viana", email: "otavio.viana89@gmail.com", senha: senhaHash, telefone: "11999215361", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Bruna Carvalho", email: "bru.carvalho@gmail.com", senha: senhaHash, telefone: "11988821353", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            { nome: "Kátia Oliveira", email: "oliveirakatia09@gmail.com", senha: senhaHash, telefone: "11924245261", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Roberto Barros", email: "robertbarros01@gmail.com", senha: senhaHash, telefone: "11916683574", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Juliana Correia", email: "correiajuh@gmail.com", senha: senhaHash, telefone: "11958283626", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
        ];

        await prisma.usuario.createMany({ data: usuariosFicticios, skipDuplicates: true });
        await prisma.usuario.createMany({ data: usuariosRuralTech, skipDuplicates: true });
        const usuarios = await prisma.usuario.findMany();
        const usuarioMap = Object.fromEntries(usuarios.map(u => [u.nome, u.id]));
        console.log("Usuários criados.");

        // ===== ATUALIZAR UNIDADES COM gerenteId =====
        console.log("Ajustando gerenteId nas unidades...");

        await prisma.unidade.update({
            where: { id: unidadeMap["RuralTech"] },
            data: { gerenteId: usuarioMap["Julia Alves"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Unidade Teste"] },
            data: { gerenteId: usuarioMap["Usuario Ficticio"] },
        });

        await prisma.unidade.update({
            where: { id: unidadeMap["Sabor do Campo Laticínios"] },
            data: { gerenteId: usuarioMap["Lorena Oshiro"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Gamma"] },
            data: { gerenteId: usuarioMap["Otávio Viana"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Beta"] },
            data: { gerenteId: usuarioMap["Richard Souza"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Delta"] },
            data: { gerenteId: usuarioMap["Kátia Oliveira"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Casa Útil Mercado"] },
            data: { gerenteId: usuarioMap["Maria Del Rey"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["AgroBoi"] },
            data: { gerenteId: usuarioMap["Bruna Carvalho"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["VerdeFresco Hortaliças"] },
            data: { gerenteId: usuarioMap["Roberto Barros"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Alpha"] },
            data: { gerenteId: usuarioMap["Juliana Correia"] },
        });

        console.log("gerenteId configurado para todas as unidades.");

        console.log("Criando fornecedores...");
        const fornecedores = [
            {
                nomeEmpresa: "AgroFornecimentos Ltda",
                descricaoEmpresa: "Fornece rações e insumos",
                material: ["Ração", "Fertilizante"],
                cnpjCpf: "12345678000190",
                email: "contato@agrofornece.com",
                telefone: "11999001122",
                endereco: "Rua do Agronegócio, 100",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Alpha"],
            },
            {
                nomeEmpresa: "NutriBov Distribuidora",
                descricaoEmpresa: "Distribuição de ração bovina e suplementos",
                material: ["Ração", "Suplemento"],
                cnpjCpf: "10111213000144",
                email: "vendas@nutribov.com",
                telefone: "11988882211",
                endereco: "Rua NutriBov, 123",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Alpha"],
            },
            {
                nomeEmpresa: "Sementes Brasil",
                descricaoEmpresa: "Venda de sementes selecionadas",
                material: ["Sementes"],
                cnpjCpf: "11121314000155",
                email: "contato@sementesbrasil.com",
                telefone: "19997773344",
                endereco: "Av. Sementes, 200",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Gamma"],
            },
            {
                nomeEmpresa: "AgroGrãos Comercial",
                descricaoEmpresa: "Comercialização de farelos e grãos",
                material: ["Farelo", "Grãos"],
                cnpjCpf: "12131415000166",
                email: "vendas@agrograos.com",
                telefone: "21996664455",
                endereco: "Rua Grãos, 50",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Gamma"],
            },
            {
                nomeEmpresa: "FertSul Distribuição",
                descricaoEmpresa: "Distribuição de fertilizantes e corretivos",
                material: ["Fertilizante", "Corretivo"],
                cnpjCpf: "13141516000177",
                email: "contato@fertsul.com",
                telefone: "51995555566",
                endereco: "Av. Fertilizantes, 300",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Delta"],
            },
            {
                nomeEmpresa: "BioInsumos Ltda",
                descricaoEmpresa: "Produtos biológicos e microbianos",
                material: ["Composto", "Inoculante"],
                cnpjCpf: "14151617000188",
                email: "contato@bioinsumos.com",
                telefone: "51994446677",
                endereco: "Rua Bio, 77",
                status: "ATIVO",
                unidadeId: unidadeMap["Fazenda Delta"],
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
                responsavelId: usuarioMap["Juliana Correia"],
                nome: "Lote Gado 2025-01",
                tipo: TL.GADO,
                qntdItens: 120,
                observacoes: "Lote destinado à engorda",
                dataCriacao: new Date("2025-01-10"),
                dataColheita: new Date("2025-06-20"),
                percentualAgrotoxicos: 8.2,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                responsavelId: usuarioMap["Juliana Correia"],
                nome: "Lote Gado 2025-02",
                tipo: TL.GADO,
                qntdItens: 80,
                observacoes: "Lote de reposição",
                dataCriacao: new Date("2025-02-01"),
                dataColheita: null,
                percentualAgrotoxicos: 5.0,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                responsavelId: usuarioMap["Otávio Viana"],
                nome: "Lote Soja 2025-01",
                tipo: TL.SOJA,
                qntdItens: 1000,
                observacoes: "Soja primeira safra - irrigado",
                dataCriacao: new Date("2025-01-20"),
                dataColheita: new Date("2025-05-30"),
                percentualAgrotoxicos: 12.5,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                responsavelId: usuarioMap["Otávio Viana"],
                nome: "Lote Soja 2025-02",
                tipo: TL.SOJA,
                qntdItens: 1200,
                observacoes: "Soja segunda safra - teste de nova semente",
                dataCriacao: new Date("2025-03-05"),
                dataColheita: new Date("2025-08-10"),
                percentualAgrotoxicos: 42.7,
                statusQualidade: "IMPRÓPRIO",
                bloqueadoParaVenda: true
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                responsavelId: usuarioMap["Richard Souza"],
                nome: "Lote Leite 2025-01",
                tipo: TL.LEITE,
                qntdItens: 60,
                observacoes: "Rebanho leiteiro - ordenha diurna",
                dataCriacao: new Date("2025-02-11"),
                dataColheita: null,
                percentualAgrotoxicos: 2.1,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                responsavelId: usuarioMap["Richard Souza"],
                nome: "Lote Leite 2025-02",
                tipo: TL.LEITE,
                qntdItens: 55,
                observacoes: "Lote de ordenha noturna",
                dataCriacao: new Date("2025-03-12"),
                dataColheita: null,
                percentualAgrotoxicos: 6.7,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                responsavelId: usuarioMap["Kátia Oliveira"],
                nome: "Lote Horta 2025-01",
                tipo: TL.OUTRO,
                qntdItens: 300,
                observacoes: "Horta de verduras para abastecer lojas locais",
                dataCriacao: new Date("2025-01-15"),
                dataColheita: new Date("2025-02-28"),
                percentualAgrotoxicos: 18.0,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                responsavelId: usuarioMap["Kátia Oliveira"],
                nome: "Lote Horta 2025-02",
                tipo: TL.OUTRO,
                qntdItens: 250,
                observacoes: "Horta orgânica (manejo reduzido de agroquímicos)",
                dataCriacao: new Date("2025-04-01"),
                dataColheita: new Date("2025-06-05"),
                percentualAgrotoxicos: 0.6,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Unidade Teste"],
                responsavelId: usuarioMap["Usuario Ficticio"],
                nome: "Lote Teste 01",
                tipo: TL.OUTRO,
                qntdItens: 10,
                observacoes: "Teste seed - uso interno",
                dataCriacao: new Date(),
                dataColheita: null,
                percentualAgrotoxicos: 0.0,
                statusQualidade: "PROPRIO",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Unidade Teste"],
                responsavelId: usuarioMap["Usuario Ficticio"],
                nome: "Lote Teste 02",
                tipo: TL.OUTRO,
                qntdItens: 15,
                observacoes: "Teste seed 2 - calibracao IoT",
                dataCriacao: new Date(),
                dataColheita: null,
                percentualAgrotoxicos: 45.2,
                statusQualidade: "IMPRÓPRIO",
                bloqueadoParaVenda: true
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                responsavelId: usuarioMap["Juliana Correia"],
                nome: "Lote Milho 2025-01",
                tipo: TL.OUTRO,
                qntdItens: 800,
                observacoes: "Milho de segunda safra, teste de correção de solo",
                dataCriacao: new Date("2025-01-05"),
                dataColheita: new Date("2025-04-10"),
                percentualAgrotoxicos: 28.4,
                statusQualidade: "ALERTA",
                bloqueadoParaVenda: false
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                responsavelId: usuarioMap["Otávio Viana"],
                nome: "Lote Trigo 2025-01",
                tipo: TL.OUTRO,
                qntdItens: 650,
                observacoes: "Trigo experimental - manejo integrado",
                dataCriacao: new Date("2025-02-20"),
                dataColheita: new Date("2025-07-01"),
                percentualAgrotoxicos: 41.0,
                statusQualidade: "IMPRÓPRIO",
                bloqueadoParaVenda: true
            }
        ];

        await prisma.lote.createMany({ data: lotesData, skipDuplicates: true });
        const lotesDb = await prisma.lote.findMany();
        const loteMap = Object.fromEntries(lotesDb.map(l => [l.nome, l.id]));
        console.log("Lotes criados.");

        // ===== Produtos =====
        console.log("Criando produtos...");
        // ------------------------ PRODUTOS PARA ESTOQUE DAS FAZENDAS ------------------------
        const produtosEstoqueFazenda = [
            // ------------------------ PRODUTOS PARA ESTOQUE DAS FAZENDAS (insumos / ração / fertilizantes / sementes) ------------------------
            // Fazenda Alpha — insumos para gado (FORNECEDOR externo)
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorId: fornecedorMap["AgroFornecimentos Ltda"], // fornecedor externo
                criadoPorId: usuarioMap["Juliana Correia"],
                nome: "Ração Bovino Engorda 50kg",
                sku: "RACAO-BOV-050",
                categoria: "Ração",
                descricao: "Ração para bovinos em fase de engorda - 50kg (fornecido por NutriBov)",
                preco: "260.00",
                dataFabricacao: new Date("2025-01-20"),
                dataValidade: new Date("2026-01-20"),
                unidadeMedida: UMED.SACA,
                codigoBarras: "7891000000000",
                ncm: "23091000",
                pesoUnidade: "50.000",
                tags: ["racao", "bovino", "engorda"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorId: fornecedorMap["NutriBov Distribuidora"],
                criadoPorId: usuarioMap["Juliana Correia"],
                nome: "Suplemento Mineral Bovino 5kg",
                sku: "SUP-MIN-BOV-005",
                categoria: "Suplemento",
                descricao: "Suplemento mineral para bovinos - 5kg (bloco mineralizado)",
                preco: "42.00",
                dataFabricacao: new Date("2025-02-01"),
                dataValidade: new Date("2027-02-01"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000001",
                ncm: "23099000",
                pesoUnidade: "5.000",
                tags: ["suplemento", "bovino"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorId: fornecedorMap["NutriBov Distribuidora"],
                criadoPorId: usuarioMap["Juliana Correia"],
                nome: "Bloco Mineral Bovino 10kg",
                sku: "BLOCO-MIN-BOV-010",
                categoria: "Suplemento",
                descricao: "Bloco mineral para bovinos - 10kg",
                preco: "95.00",
                dataFabricacao: new Date("2025-02-10"),
                dataValidade: new Date("2027-02-10"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000002",
                ncm: "23099000",
                pesoUnidade: "10.000",
                tags: ["mineral", "bovino"],
                impostos: { icms: 12.0 }
            },
            // Fazenda Gamma — sementes / corretivos / farelo (FORNECEDORES externos)
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorId: fornecedorMap["Sementes Brasil"],
                criadoPorId: usuarioMap["Otávio Viana"],
                nome: "Semente Soja Alta Germinacao 20kg",
                sku: "SEED-SOJA-020",
                categoria: "Sementes",
                descricao: "Semente de soja selecionada - embalagem 20kg",
                preco: "320.00",
                dataFabricacao: new Date("2025-01-10"),
                dataFabricacao: new Date("2025-01-10"),
                dataValidade: new Date("2027-01-10"),
                unidadeMedida: UMED.SACA,
                codigoBarras: "7891000000003",
                ncm: "12010010",
                pesoUnidade: "20.000",
                tags: ["semente", "soja"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorId: fornecedorMap["AgroGrãos Comercial"],
                criadoPorId: usuarioMap["Otávio Viana"],
                nome: "Farelo de Soja 25kg",
                sku: "FARELO-SOJA-025",
                categoria: "Insumos",
                descricao: "Farelo de soja para ração - embalagem 25kg",
                preco: "130.00",
                dataFabricacao: new Date("2025-08-10"),
                dataValidade: new Date("2026-08-10"),
                unidadeMedida: UMED.SACA,
                codigoBarras: "7891000000004",
                ncm: "23031000",
                pesoUnidade: "25.000",
                tags: ["farelo", "soja"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorId: fornecedorMap["FertSul Distribuicao"],
                criadoPorId: usuarioMap["Otávio Viana"],
                nome: "Calcario Agricola 40kg",
                sku: "CALC-AG-040",
                categoria: "Corretivo",
                descricao: "Calcário dolomítico granuloso - 40kg",
                preco: "75.00",
                dataFabricacao: new Date("2025-02-15"),
                dataValidade: new Date("2030-02-15"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000005",
                ncm: "25201000",
                pesoUnidade: "40.000",
                tags: ["calcario", "corretivo"],
                impostos: { icms: 12.0 }
            },
            // Fazenda Beta — insumos para produção leiteira (FORNECEDORES externos)
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorId: fornecedorMap["NutriBov Distribuidora"],
                criadoPorId: usuarioMap["Richard Souza"],
                nome: "Ração Leiteiro Premium 40kg",
                sku: "RACAO-LEI-040",
                categoria: "Ração",
                descricao: "Ração formulada para vacas leiteiras - 40kg (fornecido por NutriBov)",
                preco: "210.00",
                dataFabricacao: new Date("2025-02-05"),
                dataValidade: new Date("2026-02-05"),
                unidadeMedida: UMED.SACA,
                codigoBarras: "7891000000006",
                ncm: "23091000",
                pesoUnidade: "40.000",
                tags: ["racao", "leiteiro"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorId: fornecedorMap["NutriBov Distribuidora"],
                criadoPorId: usuarioMap["Richard Souza"],
                nome: "Bloco Mineral Bovino 10kg (para uso no cocho)",
                sku: "BLOCO-MIN-COCHO-010",
                categoria: "Suplemento",
                descricao: "Bloco mineral para suplementação - 10kg",
                preco: "98.00",
                dataFabricacao: new Date("2025-02-10"),
                dataValidade: new Date("2027-02-10"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000007",
                ncm: "23099000",
                pesoUnidade: "10.000",
                tags: ["mineral", "bovino"],
                impostos: { icms: 12.0 }
            },
            // Fazenda Delta — fertilizantes / composto / inoculantes (FORNECEDORES externos)
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorId: fornecedorMap["FertSul Distribuicao"],
                criadoPorId: usuarioMap["Kátia Oliveira"],
                nome: "NPK 20-05-20 25kg",
                sku: "NPK-20520-025",
                categoria: "Fertilizantes",
                descricao: "Fertilizante NPK 20-05-20 granulado - 25kg",
                preco: "95.00",
                dataFabricacao: new Date("2025-01-10"),
                dataValidade: new Date("2028-01-10"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000008",
                ncm: "31053000",
                pesoUnidade: "25.000",
                tags: ["npk", "fertilizante"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorId: fornecedorMap["BioInsumos Ltda"],
                criadoPorId: usuarioMap["Kátia Oliveira"],
                nome: "Composto Microbiano 10kg",
                sku: "COMPO-MIC-010",
                categoria: "Adubo",
                descricao: "Composto microbiano para hortas - 10kg (bio)",
                preco: "48.00",
                dataFabricacao: new Date("2025-03-01"),
                dataValidade: new Date("2027-03-01"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000009",
                ncm: "31059000",
                pesoUnidade: "10.000",
                tags: ["composto", "microbiano", "organico"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorId: fornecedorMap["BioInsumos Ltda"],
                criadoPorId: usuarioMap["Kátia Oliveira"],
                nome: "Inoculante Microbiano para Soja 1L",
                sku: "INOC-SOJA-001",
                categoria: "Inoculante",
                descricao: "Inoculante biológico para tratamento de sementes - 1L",
                preco: "38.00",
                dataFabricacao: new Date("2025-01-12"),
                dataValidade: new Date("2026-01-12"),
                unidadeMedida: UMED.LITRO,
                codigoBarras: "7891000000010",
                ncm: "30049090",
                pesoUnidade: "1.000",
                tags: ["inoculante", "microbiano"],
                impostos: { icms: 12.0 }
            },
        ];
        await prisma.produto.createMany({ data: produtosEstoqueFazenda, skipDuplicates: true });

        // ------------------------ PRODUTOS PARA PRODUÇÃO DAS FAZENDAS ------------------------ 
        const produtosProducaoFazenda = [
        ];
        await prisma.produto.createMany({ data: produtosProducaoFazenda, skipDuplicates: true })

        // ------------------------ PRODUTOS PARA ESTOQUE DAS LOJAS ------------------------
        const produtosEstoqueLoja = [
            // VerdeFresco Hortaliças (hortaliças / vegetais) - origin: Fazenda Delta (hortas)
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-02"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Alface Crespa (maço)",
                sku: "ALFACE-CRES-001",
                categoria: "Hortaliça",
                descricao: "Alface crespa colhida para venda por unidade (maço)",
                preco: "2.50",
                dataFabricacao: new Date("2025-06-01"),
                dataValidade: new Date("2025-06-07"),
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.150",
            },
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-01"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Tomate Carmem (kg)",
                sku: "TOMATE-CARM-001",
                categoria: "Hortaliça",
                descricao: "Tomate Carmem, vendido a granel por kg",
                preco: "6.80",
                dataFabricacao: new Date("2025-05-28"),
                dataValidade: new Date("2025-06-10"),
                ncm: "07020010",
                pesoUnidade: "1.000",
            },
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-02"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Mix Verduras (pack)",
                sku: "MIX-VERD-001",
                categoria: "Hortaliça",
                descricao: "Pack com mix de rúcula, agrião e alface (porção pronta para venda)",
                preco: "5.50",
                dataFabricacao: new Date("2025-06-01"),
                dataValidade: new Date("2025-06-06"),
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.350",
            },
            // AgroBoi (gado / insumos para bovinos) - origin: Fazenda Alpha (gado)
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-01"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Carne Contrafilé (1kg)",
                sku: "CARNE-CF-001",
                categoria: "Carne",
                descricao: "Contrafilé bovino - embalagem por 1kg (procedência Fazenda Alpha)",
                preco: "39.00",
                dataFabricacao: new Date("2025-05-25"),
                dataValidade: new Date("2025-06-05"),
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
            },
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-01"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Ração Bovino Engorda 50kg (loja)",
                sku: "RACAO-BOV-050-LOJA",
                categoria: "Ração",
                descricao: "Ração para engorda - saco 50kg (transferência interna da fazenda)",
                preco: "265.00",
                dataFabricacao: new Date("2025-01-20"),
                dataValidade: new Date("2026-01-20"),
                ncm: "23091000",
                pesoUnidade: "50.000",
            },
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-02"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Suplemento Mineral Bovino 5kg (loja)",
                sku: "SUP-MIN-BOV-005-LOJA",
                categoria: "Suplemento",
                descricao: "Bloco mineral 5kg para bovinos - vendido na loja AgroBoi",
                preco: "45.00",
                dataFabricacao: new Date("2025-02-01"),
                dataValidade: new Date("2027-02-01"),
                unidadeMedida: UMED.KG,
                pesoUnidade: "5.000",
            },
            // Sabor do Campo Laticínios (laticínios) - origin: Fazenda Beta (leite)
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-01"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Leite Pasteurizado 1L",
                sku: "LEITE-PAST-001",
                categoria: "Laticínio",
                descricao: "Leite pasteurizado, 1 litro, procedência Fazenda Beta",
                preco: "4.50",
                dataFabricacao: new Date("2025-05-10"),
                dataValidade: new Date("2025-05-17"),
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
            },
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-01"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Queijo Minas Frescal 200g",
                sku: "QUEIJO-MINAS-200",
                categoria: "Laticínio",
                descricao: "Queijo Minas fresco - 200g (produção local)",
                preco: "16.00",
                dataFabricacao: new Date("2025-05-05"),
                dataValidade: new Date("2025-05-20"),
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
            },
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-02"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Iogurte Natural 500g",
                sku: "IOGURTE-NAT-500",
                categoria: "Laticínio",
                descricao: "Iogurte natural sem açúcar - pote 500g",
                preco: "7.50",
                dataFabricacao: new Date("2025-05-12"),
                dataValidade: new Date("2025-05-22"),
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.500",
            },
            // Casa Útil Mercado (produtos diversos pequenos) - origem variada (ex.: Fazendas / Unidade Teste)
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Fazenda Gamma"],
                loteId: loteMap["Lote Trigo 2025-01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Farinha de Trigo Tipo 1 1kg",
                sku: "FARIN-TRIG-1KG",
                categoria: "Alimentos",
                descricao: "Farinha de trigo tipo 1 - pacote 1kg (produção local / moagem a partir do lote)",
                preco: "6.80",
                dataFabricacao: new Date("2025-04-15"),
                dataValidade: new Date("2026-04-15"),
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Unidade Teste"],
                loteId: loteMap["Lote Teste 01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Sabão em Pó 1kg (marca local)",
                sku: "SABAO-PO-1KG",
                categoria: "Higiene",
                descricao: "Sabão em pó embalagem 1kg - marca local/teste",
                preco: "9.50",
                dataFabricacao: new Date("2025-03-01"),
                dataValidade: new Date("2027-03-01"),
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Milho 2025-01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Milho Para Pipoca 1kg",
                sku: "MILHO-PIPE-1KG",
                categoria: "Alimentos",
                descricao: "Milho seco para consumo/uso doméstico - 1kg",
                preco: "7.20",
                dataFabricacao: new Date("2025-04-01"),
                dataValidade: new Date("2026-04-01"),
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
            },
        ];
        await prisma.produto.createMany({ data: produtosEstoqueLoja, skipDuplicates: true });

        // ------------------------ PRODUTOS PARA VENDA DAS LOJAS ------------------------
        const produtosVendaLoja = [
            // VerdeFresco Hortaliças (hortaliças / vegetais) - origin: Fazenda Delta (hortas)
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-02"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Alface Crespa (maço)",
                sku: "ALFACE-CRES-001",
                categoria: "Hortaliça",
                descricao: "Alface crespa colhida para venda por unidade (maço)",
                preco: "2.50",
                dataFabricacao: new Date("2025-06-01"),
                dataValidade: new Date("2025-06-07"),
                unidadeMedida: UMED.UNIDADE,
                codigoBarras: "7891000000011",
                ncm: "07051100",
                pesoUnidade: "0.150",
                tags: ["folha", "orgânico"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-01"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Tomate Carmem (kg)",
                sku: "TOMATE-CARM-001",
                categoria: "Hortaliça",
                descricao: "Tomate Carmem, vendido a granel por kg",
                preco: "6.80",
                dataFabricacao: new Date("2025-05-28"),
                dataValidade: new Date("2025-06-10"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000012",
                ncm: "07020010",
                pesoUnidade: "1.000",
                tags: ["tomate", "fresco"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                origemUnidadeId: unidadeMap["Fazenda Delta"],
                loteId: loteMap["Lote Horta 2025-02"],
                criadoPorId: usuarioMap["Roberto Barros"],
                nome: "Mix Verduras (pack)",
                sku: "MIX-VERD-001",
                categoria: "Hortaliça",
                descricao: "Pack com mix de rúcula, agrião e alface (porção pronta para venda)",
                preco: "5.50",
                dataFabricacao: new Date("2025-06-01"),
                dataValidade: new Date("2025-06-06"),
                unidadeMedida: UMED.UNIDADE,
                codigoBarras: "7891000000013",
                ncm: "07059000",
                pesoUnidade: "0.350",
                tags: ["mix", "salada"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            // AgroBoi (gado / insumos para bovinos) - origin: Fazenda Alpha (gado)
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-01"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Carne Contrafilé (1kg)",
                sku: "CARNE-CF-001",
                categoria: "Carne",
                descricao: "Contrafilé bovino - embalagem por 1kg (procedência Fazenda Alpha)",
                preco: "39.00",
                dataFabricacao: new Date("2025-05-25"),
                dataValidade: new Date("2025-06-05"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000020",
                ncm: "02023000",
                pesoUnidade: "1.000",
                tags: ["bovino", "corte"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-01"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Ração Bovino Engorda 50kg (loja)",
                sku: "RACAO-BOV-050-LOJA",
                categoria: "Ração",
                descricao: "Ração para engorda - saco 50kg (transferência interna da fazenda)",
                preco: "265.00",
                dataFabricacao: new Date("2025-01-20"),
                dataValidade: new Date("2026-01-20"),
                unidadeMedida: UMED.SACA,
                codigoBarras: "7891000000021",
                ncm: "23091000",
                pesoUnidade: "50.000",
                tags: ["racao", "bovino"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["AgroBoi"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Gado 2025-02"],
                criadoPorId: usuarioMap["Bruna Carvalho"],
                nome: "Suplemento Mineral Bovino 5kg (loja)",
                sku: "SUP-MIN-BOV-005-LOJA",
                categoria: "Suplemento",
                descricao: "Bloco mineral 5kg para bovinos - vendido na loja AgroBoi",
                preco: "45.00",
                dataFabricacao: new Date("2025-02-01"),
                dataValidade: new Date("2027-02-01"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000022",
                ncm: "23099000",
                pesoUnidade: "5.000",
                tags: ["suplemento", "bovino"],
                impostos: { icms: 12.0 }
            },
            // Sabor do Campo Laticínios (laticínios) - origin: Fazenda Beta (leite)
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-01"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Leite Pasteurizado 1L",
                sku: "LEITE-PAST-001",
                categoria: "Laticínio",
                descricao: "Leite pasteurizado, 1 litro, procedência Fazenda Beta",
                preco: "4.50",
                dataFabricacao: new Date("2025-05-10"),
                dataValidade: new Date("2025-05-17"),
                unidadeMedida: UMED.LITRO,
                codigoBarras: "7891000000030",
                ncm: "04012010",
                pesoUnidade: "1.000",
                tags: ["leite", "pasteurizado"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-01"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Queijo Minas Frescal 200g",
                sku: "QUEIJO-MINAS-200",
                categoria: "Laticínio",
                descricao: "Queijo Minas fresco - 200g (produção local)",
                preco: "16.00",
                dataFabricacao: new Date("2025-05-05"),
                dataValidade: new Date("2025-05-20"),
                unidadeMedida: UMED.UNIDADE,
                codigoBarras: "7891000000031",
                ncm: "04063010",
                pesoUnidade: "0.200",
                tags: ["queijo", "fresco"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                origemUnidadeId: unidadeMap["Fazenda Beta"],
                loteId: loteMap["Lote Leite 2025-02"],
                criadoPorId: usuarioMap["Lorena Oshiro"],
                nome: "Iogurte Natural 500g",
                sku: "IOGURTE-NAT-500",
                categoria: "Laticínio",
                descricao: "Iogurte natural sem açúcar - pote 500g",
                preco: "7.50",
                dataFabricacao: new Date("2025-05-12"),
                dataValidade: new Date("2025-05-22"),
                unidadeMedida: UMED.UNIDADE,
                codigoBarras: "7891000000032",
                ncm: "04031000",
                pesoUnidade: "0.500",
                tags: ["iogurte", "natural"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            // Casa Útil Mercado (produtos diversos pequenos) - origem variada
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Fazenda Gamma"],
                loteId: loteMap["Lote Trigo 2025-01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Farinha de Trigo Tipo 1 1kg",
                sku: "FARIN-TRIG-1KG",
                categoria: "Alimentos",
                descricao: "Farinha de trigo tipo 1 - pacote 1kg (produção local / moagem a partir do lote)",
                preco: "6.80",
                dataFabricacao: new Date("2025-04-15"),
                dataValidade: new Date("2026-04-15"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000040",
                ncm: "11010000",
                pesoUnidade: "1.000",
                tags: ["farinha", "trigo"],
                impostos: { icms: 12.0 }
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Unidade Teste"],
                loteId: loteMap["Lote Teste 01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Sabão em Pó 1kg (marca local)",
                sku: "SABAO-PO-1KG",
                categoria: "Higiene",
                descricao: "Sabão em pó embalagem 1kg - marca local/teste",
                preco: "9.50",
                dataFabricacao: new Date("2025-03-01"),
                dataValidade: new Date("2027-03-01"),
                unidadeMedida: UMED.UNIDADE,
                codigoBarras: "7891000000041",
                ncm: "34021300",
                pesoUnidade: "1.000",
                tags: ["limpeza"],
                impostos: { icms: 12.0, pis: 1.65, cofins: 7.6 }
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                origemUnidadeId: unidadeMap["Fazenda Alpha"],
                loteId: loteMap["Lote Milho 2025-01"],
                criadoPorId: usuarioMap["Maria Del Rey"],
                nome: "Milho Para Pipoca 1kg",
                sku: "MILHO-PIPE-1KG",
                categoria: "Alimentos",
                descricao: "Milho seco para consumo/uso doméstico - 1kg",
                preco: "7.20",
                dataFabricacao: new Date("2025-04-01"),
                dataValidade: new Date("2026-04-01"),
                unidadeMedida: UMED.KG,
                codigoBarras: "7891000000042",
                ncm: "10059011",
                pesoUnidade: "1.000",
                tags: ["milho", "seco"],
                impostos: { icms: 12.0 }
            },
        ];
        await prisma.produto.createMany({ data: produtosVendaLoja, skipDuplicates: true });

        let produtosDb = await prisma.produto.findMany();
        const produtoMap = Object.fromEntries(produtosDb.map(p => [p.sku, p.id]));
        console.log("Produtos criados:", produtosDb.length);

        // ===== Estoques =====
        console.log("Criando estoques...");
        const estoqueLoja = [
            // ----------------- LOJAS
            // VerdeFresco Hortaliças (hortaliças / vegetais)
            { unidadeId: unidadeMap["VerdeFresco Hortaliças"], produtoId: produtoMap["RACAO-BOV-050"], quantidade: 250, estoqueMinimo: 20 },
            { unidadeId: unidadeMap["VerdeFresco Hortaliças"], produtoId: produtoMap["TOMATE-CARM-001"], quantidade: 200, estoqueMinimo: 15 },
            { unidadeId: unidadeMap["VerdeFresco Hortaliças"], produtoId: produtoMap["MIX-VERD-001"], quantidade: 200, estoqueMinimo: 10 },
            // AgroBoi (gado / insumos para bovinos)
            { unidadeId: unidadeMap["AgroBoi"], produtoId: produtoMap["CARNE-CF-001"], quantidade: 50, estoqueMinimo: 5 },
            { unidadeId: unidadeMap["AgroBoi"], produtoId: produtoMap["RACAO-BOV-050-LOJA"], quantidade: 80, estoqueMinimo: 8 },
            { unidadeId: unidadeMap["AgroBoi"], produtoId: produtoMap["SUP-MIN-BOV-005-LOJA"], quantidade: 60, estoqueMinimo: 6 },
            // Sabor do Campo Laticínios (laticínios)
            { unidadeId: unidadeMap["Sabor do Campo Laticínios"], produtoId: produtoMap["LEITE-PAST-001"], quantidade: 400, estoqueMinimo: 40 },
            { unidadeId: unidadeMap["Sabor do Campo Laticínios"], produtoId: produtoMap["QUEIJO-MIN-1KG"], quantidade: 60, estoqueMinimo: 6 },
            { unidadeId: unidadeMap["Sabor do Campo Laticínios"], produtoId: produtoMap["IOGURTE-NAT-500"], quantidade: 120, estoqueMinimo: 12 },
            // Casa Útil Mercado (produtos diversos pequenos)
            { unidadeId: unidadeMap["Casa Útil Mercado"], produtoId: produtoMap["FARIN-TRIG-1KG"], quantidade: 40, estoqueMinimo: 4 },
            { unidadeId: unidadeMap["Casa Útil Mercado"], produtoId: produtoMap["SABAO-PO-1KG"], quantidade: 90, estoqueMinimo: 9 },
            { unidadeId: unidadeMap["Casa Útil Mercado"], produtoId: produtoMap["MILHO-PIPE-1KG"], quantidade: 60, estoqueMinimo: 6 },
        ];
        await prisma.estoque.createMany({ data: estoqueLoja, skipDuplicates: true });

        const estoqueFazenda = [
            // ----------------- FAZENDAS
            // Fazenda Alpha
            { unidadeId: unidadeMap["Fazenda Alpha"], produtoId: produtoMap["RACAO-BOV-050"], quantidade: 250, estoqueMinimo: 20 },
            { unidadeId: unidadeMap["Fazenda Alpha"], produtoId: produtoMap["SUP-MIN-BOV-005"], quantidade: 200, estoqueMinimo: 15 },
            { unidadeId: unidadeMap["Fazenda Alpha"], produtoId: produtoMap["BLOCO-MIN-BOV-010"], quantidade: 200, estoqueMinimo: 10 },
            // Fazenda Gamma
            { unidadeId: unidadeMap["Fazenda Gamma"], produtoId: produtoMap["SEED-SOJA-020"], quantidade: 50, estoqueMinimo: 5 },
            { unidadeId: unidadeMap["Fazenda Gamma"], produtoId: produtoMap["FARELO-SOJA-025"], quantidade: 80, estoqueMinimo: 8 },
            { unidadeId: unidadeMap["Fazenda Gamma"], produtoId: produtoMap["CALC-AG-040"], quantidade: 60, estoqueMinimo: 6 },
            // Fazenda Beta
            { unidadeId: unidadeMap["Fazenda Beta"], produtoId: produtoMap["RACAO-LEI-040"], quantidade: 400, estoqueMinimo: 40 },
            { unidadeId: unidadeMap["Fazenda Beta"], produtoId: produtoMap["BLOCO-MIN-COCHO-010"], quantidade: 60, estoqueMinimo: 6 },
            // Fazenda Delta
            { unidadeId: unidadeMap["Fazenda Delta"], produtoId: produtoMap["NPK-20520-025"], quantidade: 40, estoqueMinimo: 4 },
            { unidadeId: unidadeMap["Fazenda Delta"], produtoId: produtoMap["COMPO-MIC-010"], quantidade: 90, estoqueMinimo: 9 },
            { unidadeId: unidadeMap["Fazenda Delta"], produtoId: produtoMap["INOC-SOJA-001"], quantidade: 60, estoqueMinimo: 6 },
        ]

        await prisma.estoque.createMany({ data: estoqueFazenda, skipDuplicates: true });
        console.log("Estoques criados:", estoqueData.length);


        const contratos = [
            // externos -> Faz. Alpha
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"],
                produtoId: produtoMap["Ração Bovinos"] || produtoMap["Ração"] || produtoMap["Racao"], // ajuste nome conforme seu produtoMap
                dataInicio: new Date("2024-01-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-05T08:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "MENSAL",
                unidadeMedida: "SACO",
                diaPagamento: "30",
                formaPagamento: "A_VISTA",
                valorTotal: 25000.00,
                materiais: JSON.stringify([{ item: "Ração bovina", embalagem: "saco 25kg" }]),
                qtndItens: 1000,
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["NutriBov Distribuidora"],
                produtoId: produtoMap["Suplemento Mineral"] || produtoMap["Suplemento"],
                dataInicio: new Date("2024-02-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-03T07:30:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "MENSAL",
                unidadeMedida: "KG",
                diaPagamento: "15",
                formaPagamento: "30_DIAS",
                valorTotal: 8000.00,
                materiais: JSON.stringify([{ item: "Suplemento mineral", observacao: "blocos e pó" }]),
                qtndItens: 200,
            },

            // externos -> Faz. Gamma
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["Sementes Brasil"],
                produtoId: produtoMap["Semente Soja"] || produtoMap["Soja Semente"],
                dataInicio: new Date("2024-03-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-03-05T09:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "ANUAL",
                unidadeMedida: "SACO",
                diaPagamento: "10",
                formaPagamento: "A_VISTA",
                valorTotal: 12000.00,
                materiais: JSON.stringify([{ item: "Sementes soja", embalagem: "saco 20kg" }]),
                qtndItens: 600,
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["AgroGrãos Comercial"],
                produtoId: produtoMap["Farelo"] || produtoMap["Farelo Soja"],
                dataInicio: new Date("2024-04-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-04-03T08:30:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "MENSAL",
                unidadeMedida: "TON",
                diaPagamento: "05",
                formaPagamento: "30_DIAS",
                valorTotal: 40000.00,
                materiais: JSON.stringify([{ item: "Farelo", tipos: ["Soja", "Trigo"] }]),
                qtndItens: 50,
            },

            // externos -> Faz. Delta
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["FertSul Distribuicao"],
                produtoId: produtoMap["Fertilizante NPK"] || produtoMap["Fertilizante"],
                dataInicio: new Date("2024-01-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-20T06:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "SAZONAL",
                unidadeMedida: "SACO",
                diaPagamento: "20",
                formaPagamento: "A_VISTA",
                valorTotal: 18000.00,
                materiais: JSON.stringify([{ item: "NPK 20-05-20", embalagem: "saco 50kg" }]),
                qtndItens: 360,
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["BioInsumos Ltda"],
                produtoId: produtoMap["Inoculante"] || produtoMap["Bioinsumo"],
                dataInicio: new Date("2024-02-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-12T07:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "MENSAL",
                unidadeMedida: "LITRO",
                diaPagamento: "10",
                formaPagamento: "30_DIAS",
                valorTotal: 6000.00,
                materiais: JSON.stringify([{ item: "Inoculante líquido", embalagem: "20L" }]),
                qtndItens: 30,
            },

            // fornecedores como UNIDADE -> contratos internos
            // Fazenda Delta recebe de VerdeFresco Hortaliças (fornecedor unidade)
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorUnidadeId: unidadeMap["VerdeFresco Hortaliças"],
                produtoId: produtoMap["Hortaliça Mix"] || produtoMap["Hortalicas"],
                dataInicio: new Date("2024-05-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-05-02T06:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "SEMANAL",
                unidadeMedida: "CAIXA",
                diaPagamento: "SOB DEMANDA",
                formaPagamento: "A_VISTA",
                valorTotal: 3000.00,
                materiais: JSON.stringify([{ item: "Hortaliças variadas", observacao: "entrega em caixas" }]),
                qtndItens: 20,
            },

            // Fazenda Alpha recebe de AgroBoi (unidade)
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorUnidadeId: unidadeMap["AgroBoi"],
                produtoId: produtoMap["Bovino Vivo"] || produtoMap["Gado"],
                dataInicio: new Date("2024-06-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-06-03T08:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "VARIÁVEL",
                unidadeMedida: "CAB",
                diaPagamento: "15",
                formaPagamento: "30_DIAS",
                valorTotal: 150000.00,
                materiais: JSON.stringify([{ item: "Bovinos para terminação", quantidade: 50 }]),
                qtndItens: 50,
            },

            // Fazenda Beta recebe de Sabor do Campo Laticínios (unidade local)
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorUnidadeId: unidadeMap["Sabor do Campo Laticínios"],
                produtoId: produtoMap["Leite UHT"] || produtoMap["Leite"],
                dataInicio: new Date("2024-07-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-07-02T05:30:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "DIARIA",
                unidadeMedida: "LITRO",
                diaPagamento: "SOB DEMANDA",
                formaPagamento: "A_VISTA",
                valorTotal: 12000.00,
                materiais: JSON.stringify([{ item: "Leite pasteurizado", embalagem: "galões 20L" }]),
                qtndItens: 600,
            },

            // Fornecedores diversos -> Casa Útil Mercado (interpretei como: loja recebe de unidade Casa Útil Mercado)
            {
                unidadeId: unidadeMap["Loja Matriz"] || unidadeMap["Loja"] || unidadeMap["Centro de Distribuição"],
                fornecedorUnidadeId: unidadeMap["Casa Útil Mercado"],
                produtoId: produtoMap["Utensílio Diverso"] || produtoMap["Embalagem"],
                dataInicio: new Date("2024-08-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-08-05T09:00:00.000Z"),
                status: "ATIVO",
                frequenciaEntregas: "MENSAL",
                unidadeMedida: "UNIDADE",
                diaPagamento: "30",
                formaPagamento: "30_DIAS",
                valorTotal: 5000.00,
                materiais: JSON.stringify([{ item: "Embalagens e utensílios pequenos" }]),
                qtndItens: 500,
            },
        ];

        await prisma.contratos.createMany({ data: contratos, skipDuplicates: true });
        console.log("Contratos criados (seed).");

        // Atualize os maps caso precise utilizar IDs logo depois
        const contratosDb = await prisma.contratos.findMany();
        console.log("Quantidade de contratos:", contratosDb.length);

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
