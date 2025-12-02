import bcrypt from "bcryptjs";
import 'dotenv/config'
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
// import * as pkg from "./generated/";

// Extrai enums
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, tipoTransporte, StatusUnidade, StatusFornecedor, StatusQualidade, TipoMovimento, TipoAtvd, TipoAnimais, StatusVenda, StatusAtvdAnimalia, TipoAnimalia, StatusPedido, StatusProducao, StatusPlantacao, CategoriaInsumo, StatusLote, ContaStatus } = pkg;

// Fallbacks para enums
const TP = TipoPerfil ?? { GERENTE_MATRIZ: "GERENTE_MATRIZ", GERENTE_FAZENDA: "GERENTE_FAZENDA", GERENTE_LOJA: "GERENTE_LOJA", FUNCIONARIO_LOJA: "FUNCIONARIO_LOJA", FUNCIONARIO_FAZENDA: "FUNCIONARIO_FAZENDA" };
const TU = TipoUnidade ?? { MATRIZ: "MATRIZ", FAZENDA: "FAZENDA", LOJA: "LOJA" };
const TL = TipoLote ?? { GADO: "GADO", SOJA: "SOJA", LEITE: "LEITE", OUTRO: "OUTRO", PLANTIO: "PLANTIO" };
const TRS = TipoRegistroSanitario ?? { VACINA: "VACINA", MEDICACAO: "MEDICACAO", RACAO: "RACAO", OUTRO: "OUTRO" };
const TPAG = TipoPagamento ?? { DINHEIRO: "DINHEIRO", CARTAO: "CARTAO", PIX: "PIX" };
const TSAIDA = TipoSaida ?? { ALUGUEL: "ALUGUEL", AGUA: "AGUA", ENERGIA: "ENERGIA", MANUTENCAO: "MANUTENCAO", SALARIOS: "SALARIOS", ESTOQUE: "ESTOQUE" };
const TAT = AtividadesEnum ?? { PLANTIO: "PLANTIO", ADUBACAO: "ADUBACAO", FERTILIZACAO: "FERTILIZACAO" };
const SCON = StatusContrato ?? { ATIVO: "ATIVO", INATIVO: "INATIVO" };
const FREQ = FrequenciaEnum ?? { SEMANALMENTE: "SEMANALMENTE", QUINZENAL: "QUINZENAL", MENSALMENTE: "MENSALMENTE", SEMESTRAL: "SEMESTRAL", TRIMESTRAL: "TRIMESTRAL" };
const UMED = UnidadesDeMedida ?? { KG: "KG", UNIDADE: "UNIDADE", LITRO: "LITRO", SACA: "SACA", G: "G", ML: 'ML', CABECA: 'CABECA' };
const SUNI = StatusUnidade ?? { ATIVA: "ATIVA", INATIVA: "INATIVA", MANUTENCAO: "MANUTENCAO" };
const SF = StatusFornecedor ?? { ATIVO: "ATIVO", INATIVO: "INATIVO" };
const SQ = StatusQualidade ?? { PROPRIO: "PROPRIO", ALERTA: "ALERTA", IMPROPRIO: "IMPROPRIO" };
const TM = TipoMovimento ?? { ENTRADA: "ENTRADA", SAIDA: "SAIDA" };
const TATV = TipoAtvd ?? { IRRIGACAO: "IRRIGACAO", ADUBACAO: "ADUBACAO", USO_AGROTOXICO: "USO_AGROTOXICO", PLANTIO: "PLANTIO", COLHEITA: "COLHEITA" };
const TAN = TipoAnimais ?? { ABATE: "ABATE", VENDA: "VENDA", REPRODUCAO: "REPRODUCAO" };
const TS = StatusVenda ?? { OK: "OK", A_RETIRAR: "A_RETIRAR", CANCELADO: "CANCELADO" };
const TTRANS = tipoTransporte ?? { RODOVIARIO: "RODOVIARIO", FERROVIARIO: "FERROVIARIO", AEREO: "AEREO", FLUVIAL: "FLUVIAL", INTERNO: "INTERNO", OUTRO: "OUTRO" };
const SATVDA = StatusAtvdAnimalia ?? { ATIVA: "ATIVA", INATIVA: "INATIVA", SUSPENSA: "SUSPENSA", CONCLUIDA: "CONCLUIDA" };
const SPLANT = StatusPlantacao ?? { EM_DESENVOLVIMENTO: "EM_DESENVOLVIMENTO", COLHIDO: "COLHIDO", EM_PREPARO: "EM_PREPARO", SEMEADO: "SEMEADO" };
const TANIMALIA = TipoAnimalia ?? { VACINACAO: "VACINACAO", VERMIFUGACAO: "VERMIFUGACAO", ANTIBIOTICO: "ANTIBIOTICO", TESTE_TUBERCULOSE: "TESTE_TUBERCULOSE", TESTE_BRUCELOSE: "TESTE_BRUCELOSE", SANIDADE_GERAL: "SANIDADE_GERAL", NUTRICAO: "NUTRICAO", SUPLEMENTACAO: "SUPLEMENTACAO", CONSUMO_RACAO: "CONSUMO_RACAO", AJUSTE_DIETA: "AJUSTE_DIETA", INSEMINACAO: "INSEMINACAO", MONITORAMENTO_CIO: "MONITORAMENTO_CIO", MONITORAMENTO_GESTACAO: "MONITORAMENTO_GESTACAO", PARTO: "PARTO", SECAGEM: "SECAGEM", TOURO_MANEJO: "TOURO_MANEJO", MANEJO_GERAL: "MANEJO_GERAL", MANEJO_PESAGEM: "MANEJO_PESAGEM", MANEJO_CARREIRA: "MANEJO_CARREIRA", MOVIMENTACAO_INTERNA: "MOVIMENTACAO_INTERNA", SEPARACAO_LOTE: "SEPARACAO_LOTE", ORDENHA_TESTE: "ORDENHA_TESTE", ORDENHA_DIARIA: "ORDENHA_DIARIA", COLETA_LEITE_AMOSTRA: "COLETA_LEITE_AMOSTRA", AVALIACAO_MASTITE: "AVALIACAO_MASTITE", RECEBIMENTO: "RECEBIMENTO", TRANSFERENCIA: "TRANSFERENCIA", VENDA_ANIMAL: "VENDA_ANIMAL", BAIXA_ANIMAL: "BAIXA_ANIMAL", BANHO: "BANHO", HIGIENIZACAO_AMBIENTE: "HIGIENIZACAO_AMBIENTE", TRATAMENTO_PE: "TRATAMENTO_PE", CURATIVO: "CURATIVO", OCORRENCIA: "OCORRENCIA", TRATAMENTO_URGENCIA: "TRATAMENTO_URGENCIA" };
const SPEDIDO = StatusPedido ?? { PENDENTE: "PENDENTE", ENVIADO: "ENVIADO", EM_TRANSITO: "EM_TRANSITO", ENTREGUE: "ENTREGUE", CANCELADO: "CANCELADO" };
const SPROD = StatusProducao ?? { PLANEJADA: "PLANEJADA", EM_ANDAMENTO: "EM_ANDAMENTO", FINALIZADA: "FINALIZADA", CANCELADA: "CANCELADA", EM_ANALISE: "EM_ANALISE" };
const CtgInsumo = CategoriaInsumo ?? { SEMENTE: "SEMENTE", FERTILIZANTE: "FERTILIZANTE", DEFENSIVO: "DEFENSIVO", RACAO: "RACAO", MEDICAMENTO: "MEDICAMENTO", SUPLEMENTO: "SUPLEMENTO", VACINA: "VACINA", OUTROS: "OUTROS", LATICINIOS: "LATICINIOS" };
const SLOTE = StatusLote ?? { PENDENTE: "PENDENTE", PRONTO: "PRONTO", ENVIADO: "ENVIADO" }
const SCONTA = ContaStatus ?? { PENDENTE: "PENDENTE", PAGA: "PAGA", VENCIDA: "VENCIDA", CANCELADA: "CANCELADA" }

async function main() {
    try {
        console.log("Conectando ao banco...");
        await prisma.$connect();

        // ===== 1. PERFIS =====
        console.log("1. Criando perfis...");
        const perfis = await prisma.perfil.createMany({
            data: [
                { funcao: TP.GERENTE_MATRIZ, descricao: "Gerente da matriz ou administração central" },
                { funcao: TP.GERENTE_FAZENDA, descricao: "Gerente responsável pela fazenda" },
                { funcao: TP.GERENTE_LOJA, descricao: "Gerente responsável pela loja ou filial" },
                { funcao: TP.FUNCIONARIO_LOJA, descricao: "Funcionário da loja" },
                { funcao: TP.FUNCIONARIO_FAZENDA, descricao: "Funcionário da fazenda" }
            ],
            skipDuplicates: true,
        });

        const perfisDb = await prisma.perfil.findMany();
        const perfilMap = Object.fromEntries(perfisDb.map(p => [String(p.funcao), p.id]));

        // ===== 2. UNIDADES =====
        console.log("2. Criando unidades...");
        const unidadesData = [
            { nome: "RuralTech", endereco: "Av. Empresarial, 1000", tipo: TU.MATRIZ, cidade: "São Paulo", estado: "SP", cep: "01000-000", latitude: -23.55052, longitude: -46.633308, cnpj: "12345678000101", email: "ruraltech91@gmail.com", telefone: "1140000001", status: SUNI.ATIVA, },
            { nome: "VerdeFresco Hortaliças", endereco: "Av. Central, 1", tipo: TU.LOJA, cidade: "São Paulo", estado: "SP", cep: "01001-001", latitude: -23.5450, longitude: -46.6340, cnpj: "12345678000202", email: "lojacentral@empresa.com", telefone: "1140000002", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T19:00:00Z'), status: SUNI.ATIVA, },
            { nome: "AgroBoi", endereco: "Rua Norte, 23", tipo: TU.LOJA, cidade: "Guarulhos", estado: "SP", cep: "07010-000", latitude: -23.4628, longitude: -46.5333, cnpj: "12345678000303", email: "lojanorte@empresa.com", telefone: "1140000003", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T18:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Casa Útil Mercado", endereco: "Av. Sul, 45", tipo: TU.LOJA, cidade: "Santo André", estado: "SP", cep: "09010-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678000404", email: "lojasul@empresa.com", telefone: "1140000004", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Sabor do Campo Laticínios", endereco: "Praça Leste, 10", tipo: TU.LOJA, cidade: "São Bernardo", estado: "SP", cep: "09810-000", latitude: -23.6916, longitude: -46.5644, cnpj: "12345678000505", email: "lojaleste@empresa.com", telefone: "1140000005", horarioAbertura: new Date('1970-01-01T09:30:00Z'), horarioFechamento: new Date('1970-01-01T19:30:00Z'), status: SUNI.ATIVA, },
            { nome: "RuralTech", endereco: "Av. Empresarial, 1000", tipo: TU.MATRIZ, cidade: "São Paulo", estado: "SP", cep: "01000-000", latitude: -23.55052, longitude: -46.633308, cnpj: "12345678000101", email: "ruraltech91@gmail.com", telefone: "1140000001", status: SUNI.ATIVA, },
            { nome: "VerdeFresco Hortaliças", endereco: "Av. Central, 1", tipo: TU.LOJA, cidade: "São Paulo", estado: "SP", cep: "01001-001", latitude: -23.5450, longitude: -46.6340, cnpj: "12345678000202", email: "lojacentral@empresa.com", telefone: "1140000002", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T19:00:00Z'), status: SUNI.ATIVA, },
            { nome: "AgroBoi", endereco: "Rua Norte, 23", tipo: TU.LOJA, cidade: "Guarulhos", estado: "SP", cep: "07010-000", latitude: -23.4628, longitude: -46.5333, cnpj: "12345678000303", email: "lojanorte@empresa.com", telefone: "1140000003", horarioAbertura: new Date('1970-01-01T09:00:00Z'), horarioFechamento: new Date('1970-01-01T18:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Casa Útil Mercado", endereco: "Av. Sul, 45", tipo: TU.LOJA, cidade: "Santo André", estado: "SP", cep: "09010-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678000404", email: "lojasul@empresa.com", telefone: "1140000004", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
            { nome: "Sabor do Campo Laticínios", endereco: "Praça Leste, 10", tipo: TU.LOJA, cidade: "São Bernardo", estado: "SP", cep: "09810-000", latitude: -23.6916, longitude: -46.5644, cnpj: "12345678000505", email: "lojaleste@empresa.com", telefone: "1140000005", horarioAbertura: new Date('1970-01-01T09:30:00Z'), horarioFechamento: new Date('1970-01-01T19:30:00Z'), status: SUNI.ATIVA, },
            { nome: "Fazenda Alpha", endereco: "Rod. BR-101, km 100", tipo: TU.FAZENDA, cidade: "Campinas", estado: "SP", cep: "13010-000", areaTotal: 1500.5, areaProdutiva: 1200.3, latitude: -22.9099, longitude: -47.0626, cnpj: "12345678100110", email: "fazendaalpha@empresa.com", telefone: "1930001001", status: SUNI.ATIVA, },
            { nome: "Fazenda Gamma", endereco: "Rod. BR-101, km 150", tipo: TU.FAZENDA, cidade: "Ribeirão Preto", estado: "SP", cep: "14010-000", areaTotal: 980.75, areaProdutiva: 760.0, latitude: -21.1775, longitude: -47.8103, cnpj: "12345678100220", email: "fazendabeta@empresa.com", telefone: "1630001002", status: SUNI.ATIVA, },
            { nome: "Fazenda Beta", endereco: "Estrada Rural, 77", tipo: TU.FAZENDA, cidade: "Piracicaba", estado: "SP", cep: "13400-000", areaTotal: 420.0, areaProdutiva: 365.25, latitude: -22.7127, longitude: -47.6476, cnpj: "12345678100330", email: "fazendagamma@empresa.com", telefone: "1930001003", status: SUNI.ATIVA, },
            { nome: "Fazenda Delta", endereco: "Estrada Rural, 88", tipo: TU.FAZENDA, cidade: "Limeira", estado: "SP", cep: "13480-000", areaTotal: 600.0, areaProdutiva: 480.5, latitude: -22.5641, longitude: -47.4019, cnpj: "12345678100440", email: "fazendadelta@empresa.com", telefone: "1930001004", status: SUNI.ATIVA, },
            { nome: "Fazenda Teste", endereco: "Rua Teste, 9", tipo: TU.FAZENDA, cidade: "Itu", estado: "SP", cep: "13300-000", areaTotal: 50.0, areaProdutiva: 40.0, latitude: -23.2646, longitude: -47.2995, cnpj: "12345678100550", email: "teste@empresa.com", telefone: "1140000099", status: SUNI.ATIVA, },
            { nome: "Loja Teste", endereco: "Av. Caetano Limeira, 2205", tipo: TU.LOJA, cidade: "Atibaia", estado: "SP", cep: "04610-000", latitude: -23.6639, longitude: -46.5361, cnpj: "12345678951244", email: "teste.loja@empresa.com", telefone: "1145003151", horarioAbertura: new Date('1970-01-01T10:00:00Z'), horarioFechamento: new Date('1970-01-01T20:00:00Z'), status: SUNI.ATIVA, },
        ];
        await prisma.unidade.createMany({ data: unidadesData, skipDuplicates: true });
        const unidades = await prisma.unidade.findMany();
        const unidadeMap = Object.fromEntries(unidades.map(u => [u.nome, u.id]));

        // ===== 3. USUÁRIOS =====
        console.log("3. Criando usuários...");
        const senhaHash = await bcrypt.hash("123456", 10);

        const usuariosData = [
            { nome: "Julia Alves", email: "juliaalvesdeo447@gmail.com", senha: senhaHash, telefone: "11987651001", perfilId: perfilMap["GERENTE_MATRIZ"], unidadeId: unidadeMap["RuralTech"], status: true },
            { nome: "Renato Martins", email: "renato.martins@gmail.com", senha: senhaHash, telefone: "11987652001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            { nome: "Maria Del Rey", email: "mebdelrey@gmail.com", senha: senhaHash, telefone: "11987653001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Richard Souza", email: "richardrrggts@gmail.com", senha: senhaHash, telefone: "11916694683", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            // gerente da loja
            { nome: "Bruna Carvalho", email: "bru.carvalho@gmail.com", senha: senhaHash, telefone: "11988821353", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            { nome: "Roberto Barros", email: "robertbarros01@gmail.com", senha: senhaHash, telefone: "11916683574", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Lorena Oshiro", email: "lorenaoshiro2007@gmail.com", senha: senhaHash, telefone: "11944556677", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
            // funcionarios da loja
            { nome: "Mariana Coelho", email: "mari.coelho@gmail.com", senha: senhaHash, telefone: "1199637392", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Loja Teste"], status: true },
            { nome: "Jonatas Silva", email: "jonatas91silva@gmail.com", senha: senhaHash, telefone: "11958251620", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["VerdeFresco Hortaliças"], status: true },
            { nome: "Alice Chagas", email: "chagas.alice@gmail.com", senha: senhaHash, telefone: "11953821185", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["AgroBoi"], status: true },
            { nome: "Marco Lucca Costa", email: "lucca.costa@gmail.com", senha: senhaHash, telefone: "11942221116", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Casa Útil Mercado"], status: true },
            { nome: "Lúcia Mello", email: "luciamello11@gmail.com", senha: senhaHash, telefone: "1190086499", perfilId: perfilMap["FUNCIONARIO_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
            // funcionarios da fazenda
            { nome: "Bruno Tavares", email: "bruno.tavares@gmail.com", senha: senhaHash, telefone: "11987654321", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Teste"], status: true },
            { nome: "Camila Duarte", email: "camila.duarte@gmail.com", senha: senhaHash, telefone: "11999887766", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Eduardo Lima", email: "edu.lima@gmail.com", senha: senhaHash, telefone: "11988776655", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Fernanda Rocha", email: "fernanda.rocha@gmail.com", senha: senhaHash, telefone: "11977665544", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
            { nome: "Rafael Nunes", email: "rafael.nunes@gmail.com", senha: senhaHash, telefone: "11966554433", perfilId: perfilMap["FUNCIONARIO_FAZENDA"], unidadeId: unidadeMap["Fazenda Beta"], status: true },
            // gerentes de fazenda
            { nome: "Usuario Ficticio", email: "user.teste@gmail.com", senha: senhaHash, telefone: "11995251689", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Teste"], status: true },
            { nome: "Otávio Viana", email: "otavio.viana89@gmail.com", senha: senhaHash, telefone: "11999215361", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Gamma"], status: true },
            { nome: "Kátia Oliveira", email: "oliveirakatia09@gmail.com", senha: senhaHash, telefone: "11924245261", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Delta"], status: true },
            { nome: "Juliana Correia", email: "correiajuh@gmail.com", senha: senhaHash, telefone: "11958283626", perfilId: perfilMap["GERENTE_FAZENDA"], unidadeId: unidadeMap["Fazenda Alpha"], status: true },
        ];
        await prisma.usuario.createMany({ data: usuariosData, skipDuplicates: true });
        const usuarios = await prisma.usuario.findMany();
        const usuarioMap = Object.fromEntries(usuarios.map(u => [u.nome, u.id]));

        // ===== 4. ATUALIZAR GERENTES DAS UNIDADES =====
        console.log("Ajustando gerenteId nas unidades...");

        await prisma.unidade.update({
            where: { id: unidadeMap["RuralTech"] },
            data: { gerenteId: usuarioMap["Julia Alves"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Teste"] },
            data: { gerenteId: usuarioMap["Usuario Ficticio"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Sabor do Campo Laticínios"] },
            data: { gerenteId: usuarioMap["Renato Martins"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Gamma"] },
            data: { gerenteId: usuarioMap["Otávio Viana"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Beta"] },
            data: { gerenteId: usuarioMap["Richard Souza"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Delta"] },
            data: { gerenteId: usuarioMap["Kátia Oliveira"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Casa Útil Mercado"] },
            data: { gerenteId: usuarioMap["Maria Del Rey"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["AgroBoi"] },
            data: { gerenteId: usuarioMap["Bruna Carvalho"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["VerdeFresco Hortaliças"] },
            data: { gerenteId: usuarioMap["Roberto Barros"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Fazenda Alpha"] },
            data: { gerenteId: usuarioMap["Juliana Correia"], matrizId: unidadeMap["RuralTech"] },
        });
        await prisma.unidade.update({
            where: { id: unidadeMap["Loja Teste"] },
            data: { gerenteId: usuarioMap["Lorena Oshiro"], matrizId: unidadeMap["RuralTech"] },
        });

        console.log("gerenteId configurado para todas as unidades.");

        // ===== 5. FORNECEDORES EXTERNOS =====
        console.log("5. Criando fornecedores externos...");
        const fornecedoresData = [
            {
                nomeEmpresa: "AgroFornecimentos Ltda",
                descricaoEmpresa: "Fornece rações e insumos",
                cnpjCpf: "12345678000190",
                email: "contato@agrofornece.com",
                telefone: "11999001122",
                endereco: "Rua do Agronegócio, 100",
                status: SF.ATIVO,
                // unidadeId: unidadeMap["Fazenda Alpha"],
            },
            {
                nomeEmpresa: "NutriBov Distribuidora",
                descricaoEmpresa: "Distribuição de ração bovina e suplementos",
                cnpjCpf: "10111213000144",
                email: "vendas@nutribov.com",
                telefone: "11988882211",
                endereco: "Rua NutriBov, 123",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "BovinoPrime Reprodutores",
                descricaoEmpresa: "Fornecimento de gado de corte e reprodutores certificados, com seleção genética.",
                cnpjCpf: "23242526000177",
                email: "comercial@bovinoprime.com.br",
                telefone: "11993004567",
                endereco: "Rod. Rural BR-050, km 200, Galpão 3",
                status: SF.ATIVO,
            },
            // fazenda gamma
            {
                nomeEmpresa: "Sementes Brasil",
                descricaoEmpresa: "Venda de sementes selecionadas",
                cnpjCpf: "11121314000155",
                email: "contato@sementesbrasil.com",
                telefone: "19997773344",
                endereco: "Av. Sementes, 200",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "AgroGrãos Comercial",
                descricaoEmpresa: "Comercialização de farelos e grãos",
                cnpjCpf: "12131415000166",
                email: "vendas@agrograos.com",
                telefone: "21996664455",
                endereco: "Rua Grãos, 50",
                status: SF.ATIVO,
            },
            // fazenda delta
            {
                nomeEmpresa: "FertSul Distribuição",
                descricaoEmpresa: "Distribuição de fertilizantes e corretivos",
                cnpjCpf: "13141516000177",
                email: "contato@fertsul.com",
                telefone: "51995555566",
                endereco: "Av. Fertilizantes, 300",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "BioInsumos Ltda",
                descricaoEmpresa: "Produtos biológicos e microbianos",
                cnpjCpf: "14151617000188",
                email: "contato@bioinsumos.com",
                telefone: "51994446677",
                endereco: "Rua Bio, 77",
                status: SF.ATIVO,
            },
            // fazenda beta
            {
                nomeEmpresa: "AgroLácteos Suprimentos",
                descricaoEmpresa: "Insumos para laticínios: coalho, culturas lácteas, consumíveis de processo e embalagens.",
                cnpjCpf: "15161718000199",
                email: "vendas@agrolacteos.com",
                telefone: "11993334455",
                endereco: "Av. Laticínios, 45",
                status: SF.ATIVO,
                // unidadeId: null // fornecedor externo
            },
            {
                nomeEmpresa: "Lácteos & Tecnologia Ltda",
                descricaoEmpresa: "Fornece starter cultures, enzimas, embalagens térmicas e equipamentos de pequeno porte para produção de queijo e iogurte.",
                cnpjCpf: "16171819000100",
                email: "contato@lacteostec.com.br",
                telefone: "11992223344",
                endereco: "Rua do Leite, 200",
                status: SF.ATIVO,
                // unidadeId: null
            },
            {
                nomeEmpresa: "AgroBov Genetics",
                descricaoEmpresa: "Fornecedor de animais reprodutores, touros de alto desempenho e serviços de inseminação artificial.",
                cnpjCpf: "17181920000111",
                email: "contato@agrobovgenetics.com.br",
                telefone: "11991112233",
                endereco: "Estrada da Cria, 500",
                status: SF.ATIVO,
                // unidadeId: null
            },
            {
                nomeEmpresa: "VetBov Serviços e Insumos",
                descricaoEmpresa: "Vacinas, medicamentos veterinários, assistência técnica e serviços de saúde animal.",
                cnpjCpf: "18192021000122",
                email: "vendas@vetbov.com.br",
                telefone: "11994445566",
                endereco: "Rua Veterinária, 77",
                status: SF.ATIVO,
                // unidadeId: null
            },
            // unidade teste
            {
                nomeEmpresa: "PastosVerde Nutrição Animal",
                descricaoEmpresa: "Produção e fornecimento de silagem, feno e suplementos minerais para bovinos.",
                cnpjCpf: "19192122000133",
                email: "contato@pastosverde.com.br",
                telefone: "11993332211",
                endereco: "Rodovia Rural, km 12",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "GenBov Melhoramento Genético",
                descricaoEmpresa: "Serviços de melhoramento genético, inseminação artificial e fornecimento de animais reprodutores.",
                cnpjCpf: "20212223000144",
                email: "vendas@genbov.com.br",
                telefone: "11992221100",
                endereco: "Estrada da Pecuária, 88",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "AgroVet Saúde Animal",
                descricaoEmpresa: "Medicamentos veterinários, vacinas e kits de diagnóstico para rebanhos bovinos.",
                cnpjCpf: "21222324000155",
                email: "contato@agrovetsaude.com.br",
                telefone: "11991114455",
                endereco: "Av. Veterinária, 300",
                status: SF.ATIVO,
            },
            {
                nomeEmpresa: "CampoForte Equipamentos",
                descricaoEmpresa: "Equipamentos para manejo de gado: balanças, troncos de contenção e bebedouros automáticos.",
                cnpjCpf: "22232425000166",
                email: "suporte@campoforte.com.br",
                telefone: "11990002233",
                endereco: "Rua Agroindústria, 150",
                status: SF.ATIVO,
            },
        ];
        await prisma.fornecedorExterno.createMany({ data: fornecedoresData, skipDuplicates: true });
        const fornecedoresDb = await prisma.fornecedorExterno.findMany();
        const fornecedorMap = Object.fromEntries(fornecedoresDb.map(f => [f.nomeEmpresa, f.id]));

        // ===== 6. CONTRATOS =====
        console.log("6. Criando contratos...");
        const contratosData = [
            // ----------------------------------------------------------
            // FAZENDAS
            // externos -> Faz. Alpha
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["AgroFornecimentos Ltda"],
                dataInicio: new Date("2024-01-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-05T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["NutriBov Distribuidora"],
                dataInicio: new Date("2024-02-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-03T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Alpha"],
                fornecedorExternoId: fornecedorMap["BovinoPrime Reprodutores"],
                dataInicio: new Date("2025-02-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-02-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            // externos -> Faz. Gamma
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["Sementes Brasil"],
                dataInicio: new Date("2024-03-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-03-05T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE, // fallback
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Gamma"],
                fornecedorExternoId: fornecedorMap["AgroGrãos Comercial"],
                dataInicio: new Date("2024-04-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-04-03T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // externos -> Faz. Delta
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["FertSul Distribuição"],
                dataInicio: new Date("2024-01-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-01-20T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Delta"],
                fornecedorExternoId: fornecedorMap["BioInsumos Ltda"],
                dataInicio: new Date("2024-02-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-02-12T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },

            // externos -> Fazenda Beta
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
                dataInicio: new Date("2024-07-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-07-18T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
                dataInicio: new Date("2024-07-20T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-07-22T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["AgroBov Genetics"],
                dataInicio: new Date("2024-09-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-09-03T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL, // inseminação/troca genética não é mensal
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Fazenda Beta"],
                fornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
                dataInicio: new Date("2024-08-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-08-05T07:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },

            // Fazenda Teste <- PastosVerde Nutrição Animal (silagem, feno, suplementos minerais)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
                dataInicio: new Date("2024-10-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-10-03T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- GenBov Melhoramento Genético (inseminação e consultoria)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
                dataInicio: new Date("2024-11-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-11-04T08:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.TRIMESTRAL,
                diaPagamento: "20",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- AgroVet Saúde Animal (medicamentos e vacinas)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
                dataInicio: new Date("2024-12-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2024-12-05T07:45:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "25",
                formaPagamento: TPAG.PIX,
            },
            // Fazenda Teste <- CampoForte Equipamentos (balanças, troncos, bebedouros)
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                fornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
                dataInicio: new Date("2025-01-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-01-12T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMESTRAL,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // -------------------------------------------------------
            // LOJAS
            // VerdeFresco Hortaliças (vende hortaliças) <- fornecedor: Fazenda Delta
            {
                unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                fornecedorUnidadeId: unidadeMap["Fazenda Delta"],
                dataInicio: new Date("2025-05-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-02T06:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },

            // AgroBoi (vende gado/insumos) <- fornecedor: Fazenda Alpha
            {
                unidadeId: unidadeMap["AgroBoi"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-05-10T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-12T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },

            // Casa Útil Mercado (produtos diversos) <- fornecedores variados (ex.: usa fazendas para apresentação do usuário Maria)
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Gamma"],
                dataInicio: new Date("2025-04-15T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "15",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Alpha"],
                dataInicio: new Date("2025-04-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-04-03T08:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },
            {
                unidadeId: unidadeMap["Casa Útil Mercado"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-03-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-03-02T09:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "05",
                formaPagamento: TPAG.PIX,
            },

            // Sabor do Campo Laticínios (laticínios) <- fornecedor: Fazenda Beta
            {
                unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
                dataInicio: new Date("2025-05-05T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-05-06T07:30:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.SEMANALMENTE,
                diaPagamento: "30",
                formaPagamento: TPAG.PIX,
            },

            // Loja Teste (laticínios e carne) <- fornecedor: Fazenda Teste
            {
                unidadeId: unidadeMap["Loja Teste"],
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                dataInicio: new Date("2025-06-01T00:00:00.000Z"),
                dataFim: null,
                dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
                status: SCON.ATIVO,
                frequenciaEntregas: FREQ.MENSALMENTE,
                diaPagamento: "10",
                formaPagamento: TPAG.PIX,
            },
        ];
        await prisma.contrato.createMany({ data: contratosData, skipDuplicates: true });
        console.log("Contratos criados (seed).");
        const contratosDb = await prisma.contrato.findMany({
            include: {
                unidade: true,
                fornecedorExterno: true,
                fornecedorInterno: true
            }
        });

        const contratoMap = {};

        for (const c of contratosDb) {
            const unidadeNome =
                c.unidade?.nome?.trim() || "SEM_UNIDADE";

            const fornecedorNome =
                c.fornecedorExterno?.nomeEmpresa?.trim() ||
                c.fornecedorInterno?.nome?.trim() ||
                "SEM_FORNECEDOR";

            const chave = `${unidadeNome} - ${fornecedorNome}`;
            contratoMap[chave] = c.id;
        }

        // ===== 7. FORNECEDOR ITEMS (Itens dos Contratos) =====
        console.log("7. Criando itens dos contratos...");
        const insumosContratosItens = [
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Culturas lácteas (starter) - pacote",
                categoria: ["Insumo", "Laticínios", "Culturas"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020", // 20 g por pacote
                quantidade: "10", // antes: 20
                precoUnitario: "45.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Embalagem PET 1L (unidade)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.035", // ~35 g por garrafa vazia
                quantidade: "100", // antes: 500
                precoUnitario: "0.85",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                raca: null,
                nome: "Etiquetas / rótulos (pacote 1000 uni)",
                categoria: ["Insumo", "Embalagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500", // 0.5 kg por pacote 1000 uni
                quantidade: "10", // antes: 20
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2024-07-15")
            },

            // ---------------- Fazenda Beta <- Lácteos & Tecnologia Ltda ----------------
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Filtro micro/ultra para pasteurização (unidade)",
                categoria: ["Insumo", "Equipamento", "Processamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.800", // 800 g
                quantidade: "1", // antes: 2
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Produto de limpeza CIP (litro)",
                categoria: ["Insumo", "Higiene"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1", // 1 kg por litro aproximado
                quantidade: "20", // antes: 50
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                raca: null,
                nome: "Kits de calibragem Válvulas / sensores (unidade)",
                categoria: ["Insumo", "Manutenção", "Peças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500", // 500 g
                quantidade: "2", // antes: 5
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2024-07-20")
            },

            // ---------------- Fazenda Beta <- AgroBov Genetics (genética) ----------------
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Sêmen congelado Holandês (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.005", // 5 g por ampola (aprox.)
                quantidade: "6", // antes: 12
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Embrião (Holandês) - unidade",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.002", // 2 g (conteúdo criogênico leve)
                quantidade: "1", // antes: 3
                precoUnitario: "420.00",
                ativo: true,
                criadoEm: new Date("2024-09-01")
            },

            // ---------------- Fazenda Beta <- VetBov Serviços e Insumos ----------------
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Vacina contra brucelose (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020", // 20 g por dose (frasco/seringa)
                quantidade: "20", // antes: 50
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Antibiótico injetável (frasco)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.200", // 200 g
                quantidade: "8", // antes: 20
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                raca: null,
                nome: "Seringas agulha (pacote 100 uni)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.200", // 200 g por pacote
                quantidade: "5", // antes: 10
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2024-08-01")
            },

            // ---------------- Fazenda Teste <- PastosVerde Nutrição Animal ----------------
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Feno (fardo 20kg)",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "20", // 20 kg por fardo
                quantidade: "400", // antes: 2000
                precoUnitario: "0.18",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Silagem",
                categoria: ["Insumo", "Forragem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "10",
                quantidade: "800", // antes: 5000
                precoUnitario: "0.08",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                raca: null,
                nome: "Suplemento mineral (kg)",
                categoria: ["Insumo", "Suplemento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "5",
                quantidade: "1", // antes: 2
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2024-10-01")
            },

            // ---------------- Fazenda Teste <- GenBov Melhoramento Genético ----------------
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Sêmen congelado Angus (ampola)",
                categoria: ["Animal", "Reprodutor", "MaterialGenético"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.005",
                quantidade: "1", // antes: 6
                precoUnitario: "75.00",
                ativo: true,
                criadoEm: new Date("2024-11-01")
            },

            // ---------------- Fazenda Teste <- AgroVet Saúde Animal ----------------
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Vacina múltipla (dose)",
                categoria: ["Insumo", "Sanidade", "Vacina"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.020",
                quantidade: "3", // antes: 6
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Antiparasitário oral (unidade embalagem)",
                categoria: ["Insumo", "Sanidade", "Medicamento"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.100",
                quantidade: "3", // antes: 6
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                raca: null,
                nome: "Kits de primeiros socorros (unidade)",
                categoria: ["Insumo", "Sanidade", "Materiais"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500",
                quantidade: "1", // antes: 2
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2024-12-01")
            },

            // ---------------- Fazenda Teste <- CampoForte Equipamentos ----------------
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Balança de piso animal (unidade)",
                categoria: ["Equipamento", "Pesagem"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "120", // kg aproximado
                quantidade: "1", // antes: 1 (reduzido anteriormente)
                precoUnitario: "7200.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Tronco / brete de contenção (unidade)",
                categoria: ["Equipamento", "Handling"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "200",
                quantidade: "1", // antes: 1
                precoUnitario: "2500.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            },
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                raca: null,
                nome: "Bebedouro automático (unidade)",
                categoria: ["Equipamento", "Água"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "15.000",
                quantidade: "1", // antes: 1
                precoUnitario: "520.00",
                ativo: true,
                criadoEm: new Date("2025-01-10")
            }
        ];

        await prisma.contratoItens.createMany({ data: insumosContratosItens, skipDuplicates: true });

        const animaisContratosItens = [
            // --------------------------------------------------------
            // BovinoPrime Reprodutores — Fazenda Alpha
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Touro reprodutor Nelore (adulto)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "850",   // peso médio de um touro Nelore adulto
                quantidade: "2",          // antes: 8
                precoUnitario: "3200.00",
                ativo: true,
                criadoEm: new Date("2025-09-01")
            },
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Vaca reprodutora Nelore (multipar)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "550",   // vaca adulta
                quantidade: "6",          // antes: 25
                precoUnitario: "2100.00",
                ativo: true,
                criadoEm: new Date("2025-09-02")
            },
            {
                contratoId: contratoMap["Fazenda Alpha - BovinoPrime Reprodutores"],
                raca: "Nelore",
                nome: "Bezerro reprodutor (macho, desmama)",
                categoria: ["Animal", "Reprodutor", "Bovino"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "180",   // peso médio bezerro desmama
                quantidade: "4",          // antes: 12
                precoUnitario: "850.00",
                ativo: true,
                criadoEm: new Date("2025-09-03")
            },

            // --------------------------------------------------------
            // AgroBov Genetics — Fazenda Beta
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Touro reprodutor Holandês",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "900",   // touro Holandês adulto
                quantidade: "2",          // antes: 6
                precoUnitario: "4200.00",
                ativo: true,
                criadoEm: new Date("2025-09-04")
            },
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                raca: "Holandês",
                nome: "Vaca reprodutora Holandesa",
                categoria: ["Animal", "Reprodutor", "Leiteiro"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "650",
                quantidade: "5",          // antes: 18
                precoUnitario: "2400.00",
                ativo: true,
                criadoEm: new Date("2025-09-05")
            },

            // --------------------------------------------------------
            // GenBov Melhoramento Genético — Fazenda Teste
            // --------------------------------------------------------
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Touro reprodutor Angus (adulto, PO)",
                categoria: ["Animal", "Reprodutor", "Bovino", "Genética"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "950",   // touro PO Angus adulto
                quantidade: "1",          // antes: 5
                precoUnitario: "5500.00",
                ativo: true,
                criadoEm: new Date("2025-09-07")
            },
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                raca: "Angus",
                nome: "Vaca reprodutora Angus (multipar, PO)",
                categoria: ["Animal", "Reprodutor", "Bovino", "Genética"],
                unidadeMedida: UMED.CABECA,
                pesoUnidade: "600", //KG
                quantidade: "4",          // antes: 15
                precoUnitario: "3200.00",
                ativo: true,
                criadoEm: new Date("2025-09-08")
            },
        ];

        await prisma.contratoItens.createMany({ data: animaisContratosItens, skipDuplicates: true });

        const produtosContratosItens = [
            // ----------------- AgroBoi - Fazenda Alpha -----------------
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Gado bovino vivo (cabeça)",
                categoria: ["Pecuária"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "450.000",   // peso médio por cabeça (kg)
                quantidade: "5",          // antes: 20
                precoUnitario: "950.00",
                ativo: true,
                criadoEm: new Date("2025-06-01")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carcaça bovina inteira (kg)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "120",        // antes: 500
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-02")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Miúdos bovinos (kg)",
                categoria: ["Carne", "Miúdos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",         // antes: 40
                precoUnitario: "10.00",
                ativo: true,
                criadoEm: new Date("2025-06-03")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro bovino cru (unidade)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "12.000",
                quantidade: "5",          // antes: 20
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-06-04")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Ossos bovinos (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",         // antes: 80
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-06-05")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo bovino bruto (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "15",         // antes: 60
                precoUnitario: "6.00",
                ativo: true,
                criadoEm: new Date("2025-06-06")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sangue bovino para subprodutos (L)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "30",         // antes: 120
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-06-07")
            },

            // cortes
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Coxão mole (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",         // antes: 70
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-06-08")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Alcatra (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",         // antes: 44
                precoUnitario: "55.00",
                ativo: true,
                criadoEm: new Date("2025-06-09")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Contrafilé (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "15",         // antes: 52
                precoUnitario: "60.00",
                ativo: true,
                criadoEm: new Date("2025-06-10")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Costela ripa (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "8",          // antes: 36
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-06-11")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Maminha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "10",         // antes: 28
                precoUnitario: "47.00",
                ativo: true,
                criadoEm: new Date("2025-06-12")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Picanha (kg)",
                categoria: ["Carne", "Cortes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",          // antes: 20
                precoUnitario: "85.00",
                ativo: true,
                criadoEm: new Date("2025-06-13")
            },

            // processados / industrializados
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne moída (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "40",         // antes: 160
                precoUnitario: "25.00",
                ativo: true,
                criadoEm: new Date("2025-06-14")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne para hambúrguer (mistura 80/20) (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "20",         // antes: 80
                precoUnitario: "23.00",
                ativo: true,
                criadoEm: new Date("2025-06-15")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Hambúrguer congelado 120g (caixa)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.120",
                quantidade: "50",         // antes: 240
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-16")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Linguiça bovina artesanal (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",         // antes: 50
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-06-17")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Charque (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "4",          // antes: 18
                precoUnitario: "32.00",
                ativo: true,
                criadoEm: new Date("2025-06-18")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Carne desidratada (kg)",
                categoria: ["Carne", "Processados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "2",          // antes: 12
                precoUnitario: "120.00",
                ativo: true,
                criadoEm: new Date("2025-06-19")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Sebo industrializado (kg)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "8",          // antes: 36
                precoUnitario: "9.00",
                ativo: true,
                criadoEm: new Date("2025-06-20")
            },
            {
                contratoId: contratoMap["AgroBoi - Fazenda Alpha"],
                nome: "Couro curtido (m²)",
                categoria: ["Subprodutos", "Industrializados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "2.500",
                quantidade: "3",          // antes: 12
                precoUnitario: "150.00",
                ativo: true,
                criadoEm: new Date("2025-06-21")
            },

            // ----------------- Casa Útil Mercado - Fazenda Gamma -----------------
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Soja grão (saca 60kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "60.000",
                quantidade: "40",         // antes: 160
                precoUnitario: "185.00",
                ativo: true,
                criadoEm: new Date("2025-06-22")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho grão (saca 60kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "60.000",
                quantidade: "35",         // antes: 140
                precoUnitario: "155.00",
                ativo: true,
                criadoEm: new Date("2025-06-23")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Trigo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "50.000",
                quantidade: "15",         // antes: 60
                precoUnitario: "162.00",
                ativo: true,
                criadoEm: new Date("2025-06-24")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão carioca (saca 30kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "30.000",
                quantidade: "9",          // antes: 36
                precoUnitario: "225.00",
                ativo: true,
                criadoEm: new Date("2025-06-25")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Sorgo (saca 50kg)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "50.000",
                quantidade: "7",          // antes: 28
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-06-26")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Casca de soja (subproduto) (kg)",
                categoria: ["Subprodutos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "80",         // antes: 400
                precoUnitario: "0.80",
                ativo: true,
                criadoEm: new Date("2025-06-27")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de soja bruto (saca 40kg)",
                categoria: ["Derivados", "Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "40.000",
                quantidade: "24",         // antes: 120
                precoUnitario: "100.00",
                ativo: true,
                criadoEm: new Date("2025-06-28")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja bruto (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "120",        // antes: 600
                precoUnitario: "5.50",
                ativo: true,
                criadoEm: new Date("2025-06-29")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Óleo de soja refinado (L)",
                categoria: ["Derivados", "Óleos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "100",        // antes: 500
                precoUnitario: "7.00",
                ativo: true,
                criadoEm: new Date("2025-06-30")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "160",        // antes: 800
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-01")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Fubá de milho 5kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "5.000",
                quantidade: "48",         // antes: 240
                precoUnitario: "14.00",
                ativo: true,
                criadoEm: new Date("2025-07-02")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Milho triturado (ração) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "32",         // antes: 160
                precoUnitario: "78.00",
                ativo: true,
                criadoEm: new Date("2025-07-03")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Ração de engorda (mistura milho+farelo) 25kg",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "28",         // antes: 140
                precoUnitario: "92.00",
                ativo: true,
                criadoEm: new Date("2025-07-04")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farinha de trigo 1kg (pacote)",
                categoria: ["Grãos", "Farinha"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "100",        // antes: 500
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-05")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Farelo de trigo (saca 25kg)",
                categoria: ["Rações"],
                unidadeMedida: UMED.SACA,
                pesoUnidade: "25.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "68.00",
                ativo: true,
                criadoEm: new Date("2025-07-06")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Feijão limpo e selecionado 1kg (pacote)",
                categoria: ["Grãos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "72",         // antes: 360
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-07")
            },
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                nome: "Grãos embalados a vácuo (diversos) (unidade)",
                categoria: ["Grãos", "Embalados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.500",
                quantidade: "48",         // antes: 240
                precoUnitario: "6.00",
                ativo: true,
                criadoEm: new Date("2025-07-08")
            },

            // ----------------- Sabor do Campo Laticínios - Fazenda Beta -----------------
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite cru tipo A (L)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "200",        // antes: 1000
                precoUnitario: "1.20",
                ativo: true,
                criadoEm: new Date("2025-07-09")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite cru tipo B (L)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "80",         // antes: 400
                precoUnitario: "0.95",
                ativo: true,
                criadoEm: new Date("2025-07-10")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Nata / creme do leite (kg)",
                categoria: ["Laticínios", "Crú"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",         // antes: 60
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-07-11")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Soro de leite (L)",
                categoria: ["Laticínios", "Subprodutos"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "48",         // antes: 240
                precoUnitario: "0.30",
                ativo: true,
                criadoEm: new Date("2025-07-12")
            },

            // beneficiados / embalagens
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "140",        // antes: 700
                precoUnitario: "4.50",
                ativo: true,
                criadoEm: new Date("2025-07-13")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite pasteurizado 2L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "2.000",
                quantidade: "48",         // antes: 240
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-14")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite UHT 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "80",         // antes: 400
                precoUnitario: "4.20",
                ativo: true,
                criadoEm: new Date("2025-07-15")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite integral 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "72",         // antes: 360
                precoUnitario: "4.80",
                ativo: true,
                criadoEm: new Date("2025-07-16")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite desnatado 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "36",         // antes: 180
                precoUnitario: "4.60",
                ativo: true,
                criadoEm: new Date("2025-07-17")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Leite sem lactose 1L",
                categoria: ["Laticínios", "Processados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-07-18")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Creme de leite 200ml",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",         // antes: 180
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-07-19")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "28",         // antes: 140
                precoUnitario: "12.00",
                ativo: true,
                criadoEm: new Date("2025-07-20")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Manteiga 500g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.500",
                quantidade: "12",         // antes: 64
                precoUnitario: "28.00",
                ativo: true,
                criadoEm: new Date("2025-07-21")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Ricota fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",          // antes: 24
                precoUnitario: "26.00",
                ativo: true,
                criadoEm: new Date("2025-07-22")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Minas padrão (kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "12",         // antes: 50
                precoUnitario: "30.00",
                ativo: true,
                criadoEm: new Date("2025-07-23")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (peça 3kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "3.000",
                quantidade: "4",          // antes: 16
                precoUnitario: "110.00",
                ativo: true,
                criadoEm: new Date("2025-07-24")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo mussarela (barra 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "11",         // antes: 44
                precoUnitario: "38.00",
                ativo: true,
                criadoEm: new Date("2025-07-25")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Queijo parmesão (peça 1kg)",
                categoria: ["Laticínios", "Queijos"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "1.000",
                quantidade: "3",          // antes: 12
                precoUnitario: "95.00",
                ativo: true,
                criadoEm: new Date("2025-07-26")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte natural 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "64",         // antes: 320
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-07-27")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor morango 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "48",         // antes: 240
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-28")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte sabor coco 170g",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.170",
                quantidade: "32",         // antes: 160
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-07-29")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Iogurte garrafa 1L",
                categoria: ["Laticínios", "Iogurtes"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "9.50",
                ativo: true,
                criadoEm: new Date("2025-07-30")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Requeijão cremoso 200g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",         // antes: 180
                precoUnitario: "8.50",
                ativo: true,
                criadoEm: new Date("2025-07-31")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite pastoso 400g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.400",
                quantidade: "17",         // antes: 84
                precoUnitario: "18.00",
                ativo: true,
                criadoEm: new Date("2025-08-01")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Doce de leite em barra 300g",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.300",
                quantidade: "10",         // antes: 52
                precoUnitario: "15.00",
                ativo: true,
                criadoEm: new Date("2025-08-02")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Kefir líquido 1L",
                categoria: ["Laticínios", "Fermentados"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "9",          // antes: 44
                precoUnitario: "7.50",
                ativo: true,
                criadoEm: new Date("2025-08-03")
            },
            {
                contratoId: contratoMap["Sabor do Campo Laticínios - Fazenda Beta"],
                nome: "Coalhada fresca (kg)",
                categoria: ["Laticínios", "Derivados"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "6",          // antes: 28
                precoUnitario: "20.00",
                ativo: true,
                criadoEm: new Date("2025-08-04")
            },

            // ----------------- VerdeFresco Hortaliças - Fazenda Delta -----------------
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface crespa (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "100",        // antes: 500
                precoUnitario: "2.50",
                ativo: true,
                criadoEm: new Date("2025-08-05")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface americana (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.250",
                quantidade: "48",         // antes: 240
                precoUnitario: "3.00",
                ativo: true,
                criadoEm: new Date("2025-08-06")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Alface roxa (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.220",
                quantidade: "24",         // antes: 120
                precoUnitario: "3.50",
                ativo: true,
                criadoEm: new Date("2025-08-07")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Rúcula (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.150",
                quantidade: "32",         // antes: 160
                precoUnitario: "2.80",
                ativo: true,
                criadoEm: new Date("2025-08-08")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Couve manteiga (maço)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.250",
                quantidade: "28",         // antes: 140
                precoUnitario: "2.20",
                ativo: true,
                criadoEm: new Date("2025-08-09")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate caixa 20kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "20.000",
                quantidade: "24",         // antes: 120
                precoUnitario: "80.00",
                ativo: true,
                criadoEm: new Date("2025-08-10")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Tomate cereja caixa 5kg",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "5.000",
                quantidade: "8",          // antes: 40
                precoUnitario: "65.00",
                ativo: true,
                criadoEm: new Date("2025-08-11")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Pepino japonês (unidade)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.UNIDADE,
                pesoUnidade: "0.200",
                quantidade: "36",         // antes: 180
                precoUnitario: "3.80",
                ativo: true,
                criadoEm: new Date("2025-08-12")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Abobrinha italiana (kg)",
                categoria: ["Hortaliças"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "16",         // antes: 80
                precoUnitario: "6.50",
                ativo: true,
                criadoEm: new Date("2025-08-13")
            },
            {
                contratoId: contratoMap["VerdeFresco Hortaliças - Fazenda Delta"],
                nome: "Cenoura (kg)",
                categoria: ["Hortaliças", "Raízes"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1.000",
                quantidade: "28",         // antes: 140
                precoUnitario: "3.20",
                ativo: true,
                criadoEm: new Date("2025-08-14")
            },

            // ----------------- Loja Teste - Fazenda Teste (manter itens de teste completos) -----------------
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Leite pasteurizado 1L (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.LITRO,
                pesoUnidade: "1.000",
                quantidade: "20",         // antes: 100
                precoUnitario: "4.00",
                ativo: true,
                criadoEm: new Date("2025-08-15")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Queijo fresco 500g (teste)",
                categoria: ["Laticínios"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "0.500",
                quantidade: "4",          // antes: 20
                precoUnitario: "22.00",
                ativo: true,
                criadoEm: new Date("2025-08-16")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte dianteiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1",
                quantidade: "10",         // antes: 40
                precoUnitario: "40.00",
                ativo: true,
                criadoEm: new Date("2025-08-17")
            },
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                nome: "Carne bovina corte traseiro (teste)",
                categoria: ["Carne"],
                unidadeMedida: UMED.KG,
                pesoUnidade: "1",
                quantidade: "8",          // antes: 30
                precoUnitario: "48.00",
                ativo: true,
                criadoEm: new Date("2025-08-18")
            }
        ];
        await prisma.contratoItens.createMany({ data: produtosContratosItens, skipDuplicates: true });
        const fornecedorItemsDb = await prisma.contratoItens.findMany();

        // ===== 8. PEDIDOS BASEADOS NOS CONTRATOS =====
        const pedidosSeed = [
            // Fazenda Beta <- AgroBov Genetics (frequencia: TRIMESTRAL)
            {
                contratoId: contratoMap["Fazenda Beta - AgroBov Genetics"],
                origemFornecedorExternoId: fornecedorMap["AgroBov Genetics"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // Próximo envio = dataEnvio base 2024-09-03T06:00:00Z + 3 meses => 2024-12-03T06:00:00Z
                dataPedido: new Date("2024-12-01T09:00:00.000Z"),
                dataEnvio: new Date("2024-12-03T06:00:00.000Z"),
                dataRecebimento: new Date("2024-12-04T06:00:00.000Z"),
                documentoReferencia: "Romaneio-AGB-20241203",
                observacoes: "Pedido automático gerado pelo seed — genética (touro/vacas/embriões).",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- VetBov Serviços e Insumos (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - VetBov Serviços e Insumos"],
                origemFornecedorExternoId: fornecedorMap["VetBov Serviços e Insumos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-08-05T07:00:00Z + 1 mês => 2024-09-05T07:00:00Z
                dataPedido: new Date("2024-09-03T09:00:00.000Z"),
                dataEnvio: new Date("2024-09-05T07:00:00.000Z"),
                dataRecebimento: new Date("2024-09-06T07:00:00.000Z"),
                documentoReferencia: "Nota-VET-20240905",
                observacoes: "Vacinas e medicamentos mensais",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- AgroLácteos Suprimentos (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - AgroLácteos Suprimentos"],
                origemFornecedorExternoId: fornecedorMap["AgroLácteos Suprimentos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-07-18T08:00:00Z + 1 mês => 2024-08-18T08:00:00Z
                dataPedido: new Date("2024-08-15T09:00:00.000Z"),
                dataEnvio: new Date("2024-08-18T08:00:00.000Z"),
                dataRecebimento: new Date("2024-08-19T08:00:00.000Z"),
                documentoReferencia: "Romaneio-AGL-20240818",
                observacoes: "Insumos para laticínios (culturas, embalagens)",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Beta <- Lácteos & Tecnologia Ltda (MENSAL)
            {
                contratoId: contratoMap["Fazenda Beta - Lácteos & Tecnologia Ltda"],
                origemFornecedorExternoId: fornecedorMap["Lácteos & Tecnologia Ltda"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Beta"],
                criadoPorId: usuarioMap["Richard Souza"],

                // base 2024-07-22T07:30:00Z + 1 mês => 2024-08-22T07:30:00Z
                dataPedido: new Date("2024-08-20T09:00:00.000Z"),
                dataEnvio: new Date("2024-08-22T07:30:00.000Z"),
                dataRecebimento: new Date("2024-08-23T07:30:00.000Z"),
                documentoReferencia: "Romaneio-LAT-20240822",
                observacoes: "Equipamentos / starters / enzimas",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- PastosVerde Nutrição Animal (MENSAL)
            {
                contratoId: contratoMap["Fazenda Teste - PastosVerde Nutrição Animal"],
                origemFornecedorExternoId: fornecedorMap["PastosVerde Nutrição Animal"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-10-03T09:00:00Z + 1 mês => 2024-11-03T09:00:00Z
                dataPedido: new Date("2024-11-01T09:00:00.000Z"),
                dataEnvio: new Date("2024-11-03T09:00:00.000Z"),
                dataRecebimento: new Date("2024-11-04T09:00:00.000Z"),
                documentoReferencia: "Romaneio-PVS-20241103",
                observacoes: "Silagem / feno mensais",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- GenBov Melhoramento Genético (TRIMESTRAL)
            {
                contratoId: contratoMap["Fazenda Teste - GenBov Melhoramento Genético"],
                origemFornecedorExternoId: fornecedorMap["GenBov Melhoramento Genético"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-11-04T08:30:00Z + 3 meses => 2025-02-04T08:30:00Z
                dataPedido: new Date("2025-02-02T09:00:00.000Z"),
                dataEnvio: new Date("2025-02-04T08:30:00.000Z"),
                dataRecebimento: new Date("2025-02-05T08:30:00.000Z"),
                documentoReferencia: "Romaneio-GEN-20250204",
                observacoes: "Inseminação / material genético (trimestral)",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- AgroVet Saúde Animal (MENSAL)
            {
                contratoId: contratoMap["Fazenda Teste - AgroVet Saúde Animal"],
                origemFornecedorExternoId: fornecedorMap["AgroVet Saúde Animal"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2024-12-05T07:45:00Z + 1 mês => 2025-01-05T07:45:00Z
                dataPedido: new Date("2024-12-30T09:00:00.000Z"),
                dataEnvio: new Date("2025-01-05T07:45:00.000Z"),
                dataRecebimento: new Date("2025-01-06T07:45:00.000Z"),
                documentoReferencia: "Romaneio-AGV-20250105",
                observacoes: "Vacinas e medicamentos",
                status: SPEDIDO.ENTREGUE,
            },

            // Fazenda Teste <- CampoForte Equipamentos (SEMESTRAL)
            {
                contratoId: contratoMap["Fazenda Teste - CampoForte Equipamentos"],
                origemFornecedorExternoId: fornecedorMap["CampoForte Equipamentos"],
                origemUnidadeId: null,
                destinoUnidadeId: unidadeMap["Fazenda Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base 2025-01-12T10:00:00Z + 6 meses => 2025-07-12T10:00:00Z
                dataPedido: new Date("2025-07-10T09:00:00.000Z"),
                dataEnvio: new Date("2025-07-12T10:00:00.000Z"),
                dataRecebimento: new Date("2025-07-13T10:00:00.000Z"),
                documentoReferencia: "Romaneio-CFE-20250712",
                status: SPEDIDO.ENTREGUE,
                observacoes: "Equipamentos (entrega semestral)"
            },

            // === PEDIDOS: Loja Teste (recebe de Fazenda Teste) ===
            {
                contratoId: contratoMap["Loja Teste - Fazenda Teste"],
                origemFornecedorExternoId: null,
                origemUnidadeId: unidadeMap["Fazenda Teste"],   // fornecedor é unidade Fazenda Teste
                destinoUnidadeId: unidadeMap["Loja Teste"],
                criadoPorId: usuarioMap["Usuario Ficticio"],

                // base: entrega mensal configurada em contratosData (envio 2025-06-03T10:00:00Z)
                dataPedido: new Date("2025-06-01T09:00:00.000Z"),
                dataEnvio: new Date("2025-06-03T10:00:00.000Z"),
                dataRecebimento: new Date("2025-06-03T12:30:00.000Z"),
                documentoReferencia: "Romaneio-LOJA-20250603",
                observacoes: "Pedido mensal para Loja Teste — laticínios e cortes (seed).",
                status: SPEDIDO.ENTREGUE,
            },

            // === PEDIDO: Casa Útil Mercado (recebe de Fazenda Gamma) ===
            {
                contratoId: contratoMap["Casa Útil Mercado - Fazenda Gamma"],
                origemFornecedorExternoId: null,
                origemUnidadeId: unidadeMap["Fazenda Gamma"],
                destinoUnidadeId: unidadeMap["Casa Útil Mercado"], // ou "Casa Útil Mercado" conforme seu mapa
                criadoPorId: usuarioMap["Maria Del Rey"],

                // base: contratosData mostra envio em 2025-04-18T09:00:00Z
                dataPedido: new Date("2025-04-16T09:00:00.000Z"),
                dataEnvio: new Date("2025-04-18T09:00:00.000Z"),
                dataRecebimento: new Date("2025-04-18T11:45:00.000Z"),
                documentoReferencia: "Romaneio-CU-20250418",
                observacoes: "Pedido seed para Casa Útil Mercado — grãos e derivados.",
                status: SPEDIDO.ENTREGUE,
            }

        ];
        await prisma.pedido.createMany({ data: pedidosSeed, skipDuplicates: true });

        async function seedPedidoItems(prisma) {
            // helper: encontra pedido pelo documentoReferencia
            async function findPedidoByDoc(docRef) {
                return prisma.pedido.findFirst({ where: { documentoReferencia: docRef } });
            }

            // helper: encontra fornecedor/contrato item pelo nome exato
            // Busca robusta por nome de contratoItem
            async function findContratoItemByName(nome) {
                if (!nome) return null;
                const raw = nome.trim();

                // 1) tentativa exata case-insensitive
                let r = await prisma.contratoItens.findFirst({
                    where: { nome: { equals: raw, mode: "insensitive" } }
                });
                if (r) return r;

                // 2) tentativa contains (parte do texto) - útil para "Touro reprodutor Holandês (adulto)"
                r = await prisma.contratoItens.findFirst({
                    where: { nome: { contains: raw, mode: "insensitive" } }
                });
                if (r) return r;

                // 3) tentativa invertida: procura itens cujo nome contém a palavra-chave principal (ex.: 'Touro', 'Silagem')
                const keywords = raw.split(/\s+/).filter(Boolean).slice(0, 3);
                for (const kw of keywords) {
                    const cand = await prisma.contratoItens.findFirst({
                        where: { nome: { contains: kw, mode: "insensitive" } }
                    });
                    if (cand) return cand;
                }

                // DEBUG: lista os primeiros candidatos parecidos (ajuda a ver por quê não encontrou)
                const candidates = await prisma.contratoItens.findMany({
                    where: { nome: { contains: raw.split(/\s+/)[0], mode: "insensitive" } },
                    take: 10
                });
                console.warn("findContratoItemByName: nenhum match exato para:", nome, "— candidatos:", candidates.map(c => c.nome));
                return null;
            }


            // resolvemos os pedidos existentes pelo documentoReferencia
            const pedidoAgroBov = await findPedidoByDoc("Romaneio-AGB-20241203");
            const pedidoVetBov = await findPedidoByDoc("Nota-VET-20240905");
            const pedidoAgroLacteos = await findPedidoByDoc("Romaneio-AGL-20240818");
            const pedidoLaticosTec = await findPedidoByDoc("Romaneio-LAT-20240822");
            const pedidoPastosVerde = await findPedidoByDoc("Romaneio-PVS-20241103");
            const pedidoGenBov = await findPedidoByDoc("Romaneio-GEN-20250204");
            const pedidoAgroVet = await findPedidoByDoc("Romaneio-AGV-20250105");
            const pedidoCampoForte = await findPedidoByDoc("Romaneio-CFE-20250712");
            const pedidoLoja = await findPedidoByDoc("Romaneio-LOJA-20250603");
            const pedidoCasa = await findPedidoByDoc("Romaneio-CU-20250418");

            // checagem rápida
            const missing = [
                ["AGROBOV", pedidoAgroBov],
                ["VETBOV", pedidoVetBov],
                ["AGROLÁCTEOS", pedidoAgroLacteos],
                ["LÁCTEOS TEC", pedidoLaticosTec],
                ["PASTOSVERDE", pedidoPastosVerde],
                ["GENBOV", pedidoGenBov],
                ["AGROVET", pedidoAgroVet],
                ["CAMPOFORTE", pedidoCampoForte],
                ["LOJA", pedidoLoja],
                ["CASA", pedidoCasa]
            ].filter(([k, v]) => !v).map(([k]) => k);

            if (missing.length) {
                console.warn("Aviso: não encontrou pedidos para:", missing.join(", "),
                    "\nVerifique documentoReferencia nos pedidos antes de criar itens.");
                // continuação permitida — itens ligados a pedidos não encontrados serão omitidos
            }

            // utilitário para criar entrada de item (busca contratoItem para pegar id)
            async function makeItem(pedido, itemNome, quantidade, unidadeMedida, precoUnitario, observacoes = null) {
                if (!pedido) return null;
                const contratoItem = await findContratoItemByName(itemNome);
                if (!contratoItem) {
                    console.warn("ContratoItem não encontrado para:", itemNome);
                    return null;
                }
                const custoTotal = (Number(quantidade) * Number(precoUnitario)).toFixed(2);
                return {
                    pedidoId: pedido.id,
                    fornecedorItemId: contratoItem.id,
                    quantidade: String(quantidade),
                    unidadeMedida,
                    precoUnitario: String(precoUnitario),
                    custoTotal: String(custoTotal),
                    observacoes
                };
            }

            // === Itens por pedido (quantidades ajustadas para NÃO ULTRAPASSAR contrato) ===
            const itensPromises = [

                // --- AgroBov Genetics (Fazenda Beta) - animais/genética ---
                // observação: quantidades reduzidas para os valores acordados em ContratoItens
                makeItem(pedidoAgroBov, "Touro reprodutor Holandês", 2, UMED.CABECA, "4200.00"), // antes:2
                makeItem(pedidoAgroBov, "Vaca reprodutora Holandesa", 5, UMED.CABECA, "2400.00"),   // antes:5
                makeItem(pedidoAgroBov, "Sêmen congelado Holandês (ampola)", 6, UMED.UNIDADE, "85.00"),       // antes:20 -> ajustado para contrato:6
                makeItem(pedidoAgroBov, "Embrião (Holandês) - unidade", 1, UMED.UNIDADE, "420.00"),          // antes:5 -> ajustado para contrato:1
                // removed "Sessão de inseminação / consultoria" — não havia ContratoItem claro com esse nome

                // --- VetBov Serviços e Insumos (Fazenda Beta) - sanidade ---
                makeItem(pedidoVetBov, "Vacina contra brucelose (dose)", 20, UMED.UNIDADE, "6.50"),        // antes:100 -> ajustado para contrato:20
                makeItem(pedidoVetBov, "Antibiótico injetável (frasco)", 8, UMED.UNIDADE, "28.00"),      // antes:20 -> ajustado para contrato:8
                makeItem(pedidoVetBov, "Seringas agulha (pacote 100 uni)", 5, UMED.UNIDADE, "12.00"),     // antes:10 -> ajustado para contrato:5

                // --- AgroLácteos Suprimentos (Fazenda Beta) - insumos laticínios ---
                makeItem(pedidoAgroLacteos, "Culturas lácteas (starter) - pacote", 10, UMED.UNIDADE, "45.00"),   // antes:50 -> contrato:10
                makeItem(pedidoAgroLacteos, "Embalagem PET 1L (unidade)", 100, UMED.UNIDADE, "0.85"),            // antes:1000 -> contrato:100
                makeItem(pedidoAgroLacteos, "Etiquetas / rótulos (pacote 1000 uni)", 10, UMED.UNIDADE, "30.00"),  // antes:2 -> contrato:10 (optei por pedir o total do contrato)

                // --- Lácteos & Tecnologia Ltda (Fazenda Beta) - equipamentos / consumíveis ---
                makeItem(pedidoLaticosTec, "Filtro micro/ultra para pasteurização (unidade)", 1, UMED.UNIDADE, "420.00"), // antes:1
                makeItem(pedidoLaticosTec, "Produto de limpeza CIP (litro)", 20, UMED.LITRO, "6.50"),                     // antes:50 -> contrato:20
                makeItem(pedidoLaticosTec, "Kits de calibragem Válvulas / sensores (unidade)", 2, UMED.UNIDADE, "95.00"),   // antes:2

                // --- PastosVerde (Fazenda Teste) - forragem ---
                makeItem(pedidoPastosVerde, "Silagem", 800, UMED.KG, "0.08"),              // antes:5000 -> contrato:800
                makeItem(pedidoPastosVerde, "Feno (fardo 20kg)", 400, UMED.UNIDADE, "95.00"),  // antes:300 -> contrato:400 (pedi total do contrato)
                makeItem(pedidoPastosVerde, "Suplemento mineral (kg)", 1, UMED.KG, "3.20"),    // antes:500 -> contrato:1

                // --- GenBov Melhoramento Genético (Fazenda Teste) - genética ---
                // existe duplicidade entre "insumos" e "animais" para sêmen; aqui usei a quantidade maior acordada (animals array)
                makeItem(pedidoGenBov, "Sêmen congelado Angus (ampola)", 20, UMED.UNIDADE, "75.00"), // antes:30 -> ajustado para contrato (20)
                // removed session item if not present explicitamente

                // --- AgroVet Saúde Animal (Fazenda Teste) - sanidade ---
                makeItem(pedidoAgroVet, "Vacina múltipla (dose)", 3, UMED.UNIDADE, "5.50"),               // antes:100 -> contrato:3
                makeItem(pedidoAgroVet, "Antiparasitário oral (unidade embalagem)", 3, UMED.UNIDADE, "22.00"), // antes:50 -> contrato:3
                makeItem(pedidoAgroVet, "Kits de primeiros socorros (unidade)", 1, UMED.UNIDADE, "48.00"), // antes:5 -> contrato:1

                // --- CampoForte Equipamentos (Fazenda Teste) - equipamentos (semestre) ---
                makeItem(pedidoCampoForte, "Balança de piso animal (unidade)", 1, UMED.UNIDADE, "7200.00"),  // antes:1
                makeItem(pedidoCampoForte, "Tronco / brete de contenção (unidade)", 1, UMED.UNIDADE, "2500.00"), // antes:1
                makeItem(pedidoCampoForte, "Bebedouro automático (unidade)", 1, UMED.UNIDADE, "520.00"), // antes:4 -> ajustado para contrato:1

                // === Itens para Loja Teste (usando exatamente os itens do seu produtosContratosItens para Loja Teste) ===
                makeItem(pedidoLoja, "Leite pasteurizado 1L (teste)", "20", UMED.LITRO, "4.00"),
                makeItem(pedidoLoja, "Queijo fresco 500g (teste)", "4", UMED.KG, "22.00"),
                makeItem(pedidoLoja, "Carne bovina corte dianteiro (teste)", "10", UMED.KG, "40.00"),
                makeItem(pedidoLoja, "Carne bovina corte traseiro (teste)", "8", UMED.KG, "48.00"),

                // === Itens para Casa Útil Mercado (escolha representativa; quantidades não ultrapassam contratos) ===
                makeItem(pedidoCasa, "Soja grão (saca 60kg)", "10", UMED.SACA, "185.00"),
                makeItem(pedidoCasa, "Milho grão (saca 60kg)", "8", UMED.SACA, "155.00"),
                makeItem(pedidoCasa, "Trigo (saca 50kg)", "4", UMED.SACA, "162.00"),
                makeItem(pedidoCasa, "Feijão carioca (saca 30kg)", "2", UMED.SACA, "225.00"),
                makeItem(pedidoCasa, "Óleo de soja refinado (L)", "20", UMED.LITRO, "7.00"),
                makeItem(pedidoCasa, "Farelo de soja bruto (saca 40kg)", "6", UMED.SACA, "100.00"),
                makeItem(pedidoCasa, "Fubá de milho 1kg (pacote)", "20", UMED.UNIDADE, "3.20"),
                makeItem(pedidoCasa, "Milho triturado (ração) 25kg", "5", UMED.SACA, "78.00"),

            ];

            // resolve todas as promises (algumas podem retornar null se pedido/item não encontrado)
            const itensResolved = (await Promise.all(itensPromises)).filter(Boolean);

            if (!itensResolved.length) {
                console.warn("Nenhum PedidoItem a inserir (verifique pedidos / nomes dos ContratoItens).");
                return;
            }

            // Inserir os itens com createMany (skip duplicates)
            await prisma.pedidoItem.createMany({
                data: itensResolved,
                skipDuplicates: true
            });

            console.log("PedidoItems inseridos:", itensResolved.length);
        }

        await seedPedidoItems(prisma);

        // === ESTOQUES DAS UNIDADES ===
        const estoques = [
            {

                unidadeId: unidadeMap["Fazenda Beta"],
                descricao: "Estoque principal - Fazenda Beta",
                qntdItens: 0,
            },
            {
                unidadeId: unidadeMap["Fazenda Teste"],
                descricao: "Estoque principal - Fazenda Teste",
                qntdItens: 0,
            },
            {

                unidadeId: unidadeMap["Loja Teste"],
                descricao: "Estoque principal - Loja Teste",
                qntdItens: 0,
            },
            {

                unidadeId: unidadeMap["Casa Útil Mercado"],
                descricao: "Estoque principal - Casa Útil Mercado",
                qntdItens: 0,

            },
        ];

        await prisma.estoque.createMany({ data: estoques, skipDuplicates: true })

        // Assuma import prisma já feito acima do seed

        // util: transforma nomes em slugs para sku (simples)
        function slugifyForSku(text) {
            return String(text || '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        /**
         * Gera um array de objetos prontos para inserir em EstoqueProduto a partir de
         * um pedidoItem. Ajuste campos extras conforme seu model.
         */
        function gerarEntradasDeEstoqueParaPedidoItem({ pedido, pedidoItem, estoqueId, prefixo = '', dataEntrada = new Date() }) {
            // nome, sku, marca, quantidade, precoUnitario, pedidoId, pedidoItemId, estoqueId, dataEntrada, unidadeBase
            const nome = pedidoItem.fornecedorItem?.nome ?? pedidoItem.produto?.nome ?? pedidoItem.observacoes ?? `PedidoItem-${pedidoItem.id}`;
            const sku = `${prefixo}-${pedidoItem.produtoId ?? pedidoItem.fornecedorItemId ?? pedidoItem.id}`.slice(0, 100);
            const marca = pedidoItem.produto?.marca ?? null;

            const quantidadeRaw = pedidoItem.quantidade ?? 0;
            // converte decimal-string para integer onde fizer sentido; aqui guardamos como INT truncado
            const quantidade = Math.max(0, Math.floor(Number(quantidadeRaw)));

            const precoUnitario = pedidoItem.precoUnitario ? Number(pedidoItem.precoUnitario) : 0;

            return {
                nome,
                sku,
                marca,
                quantidade,
                estoqueId: Number(estoqueId),
                produtoId: pedidoItem.produtoId ?? null,
                loteId: pedidoItem.loteId ?? null,
                precoUnitario: precoUnitario || null,
                unidadeBase: pedidoItem.unidadeMedida ?? undefined,
                pedidoId: pedido.id,
                pedidoItemId: pedidoItem.id,
                fornecedorUnidadeId: null,
                fornecedorExternoId: pedido.fornecedorExternoId ?? null,
                dataEntrada: dataEntrada instanceof Date ? dataEntrada : new Date(dataEntrada)
            };
        }

        async function seedEstoqueProdutosFromDeliveredPedidos(prisma) {
            const docRefs = [
                "Romaneio-AGB-20241203",
                "Nota-VET-20240905",
                "Romaneio-AGL-20240818",
                "Romaneio-LAT-20240822",
                "Romaneio-PVS-20241103",
                "Romaneio-GEN-20250204",
                "Romaneio-AGV-20250105",
                "Romaneio-CFE-20250712",
                "Romaneio-LOJA-20250603",
                "Romaneio-CU-20250418"
            ];

            // Busca os pedidos com os itens (observe include: { itens: true })
            const pedidos = await prisma.pedido.findMany({
                where: { documentoReferencia: { in: docRefs } },
                include: {
                    itens: { include: { fornecedorItem: true, produto: true, lote: true } },
                    destinoUnidade: true,
                    fornecedorExterno: true
                }
            });

            if (!pedidos || pedidos.length === 0) {
                console.warn("Nenhum pedido encontrado para as referências informadas.");
                return;
            }

            const created = [];
            for (const pedido of pedidos) {
                const destinoUnidadeId = pedido.destinoUnidadeId ?? pedido.destinoUnidade?.id;
                if (!destinoUnidadeId) {
                    console.warn("Pedido sem destinoUnidadeId:", pedido.documentoReferencia);
                    continue;
                }

                const estoque = await prisma.estoque.findFirst({ where: { unidadeId: Number(destinoUnidadeId) } });
                if (!estoque) {
                    console.warn("Estoque não encontrado para unidadeId:", destinoUnidadeId, "(pedido)", pedido.documentoReferencia);
                    continue;
                }

                const items = pedido.itens ?? [];
                if (!items.length) {
                    console.warn("Pedido sem itens:", pedido.documentoReferencia);
                    continue;
                }

                // Inserir um a um para garantir vinculações e capturar erros
                for (const pi of items) {
                    // valida qtd
                    const qtd = Number(pi.quantidade ?? 0);
                    if (!qtd || isNaN(qtd) || qtd <= 0) {
                        console.warn("Quantidade inválida em pedidoItem:", pi.id, "pedido", pedido.documentoReferencia);
                        continue;
                    }

                    const prefix = slugifyForSku(pi.fornecedorItem?.nome ?? pi.produto?.nome ?? `PED${pedido.id}-ITEM${pi.id}`);
                    const entrada = gerarEntradasDeEstoqueParaPedidoItem({
                        pedido,
                        pedidoItem: pi,
                        estoqueId: estoque.id,
                        prefixo: prefix,
                        dataEntrada: pedido.dataRecebimento ?? new Date()
                    });

                    // Atenção: create pode falhar devido a unique constraint (estoqueId+produtoId). Tratamos com try/catch.
                    try {
                        const novo = await prisma.estoqueProduto.create({ data: entrada });
                        created.push(novo);
                    } catch (err) {
                        // se houver constraint, logamos e pulamos
                        console.warn("Falha ao criar EstoqueProduto para pedidoItem", pi.id, "erro:", err.message);
                    }
                }
            }

            console.log("Finalizado seedEstoqueProdutosFromDeliveredPedidos — criados:", created.length);
            return created.length;
        }

        await seedEstoqueProdutosFromDeliveredPedidos(prisma);

        const animals = [
            // Fazenda Beta: 4 vacas Holandesas (agreguei 4 registros repetidos em 1)
            {
                animal: "Vaca reprodutora Holandesa",
                raca: "Holandês",
                sku: "ANM-FAZ8-HOL-0001",
                dataEntrada: new Date("2025-09-05T00:00:00.000Z"),
                fornecedorId: null,
                quantidade: 5,
                tipo: TAN.REPRODUCAO,    // ver nota sobre enums
                custo: 2400.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },

            // Fazenda Beta: (se houver um touro Holandês separado) ex.: 1 touro
            // (se você não tinha o touro aqui, remova este bloco)
            {
                animal: "Touro reprodutor Holandês",
                raca: "Holandês",
                sku: "ANM-FAZ8-HOL-0002",
                dataEntrada: new Date("2025-09-01T00:00:00.000Z"),
                fornecedorId: null,
                quantidade: 2,
                tipo: TAN.REPRODUCAO,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Beta'],
                loteId: null
            },

            // Fazenda Teste: 1 touro Angus (carne bovina )
            {
                animal: "Touro reprodutor Angus (adulto, PO)",
                raca: "Angus",
                sku: "ANM-FAZ10-ANG-0001",
                dataEntrada: new Date("2025-09-07T00:00:00.000Z"),
                fornecedorId: null,
                quantidade: 1,
                tipo: TAN.ABATE,
                custo: 5500.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            },

            // Fazenda Teste: 5 vacas Angus (agreguei os 5 registros idênticos) (leite e queijo)
            {
                animal: "Vaca reprodutora Angus (multipar, PO)",
                raca: "Angus",
                sku: "ANM-FAZ10-ANG-0002",
                dataEntrada: new Date("2025-09-08T00:00:00.000Z"),
                fornecedorId: null,
                quantidade: 5,
                tipo: TAN.REPRODUCAO,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            }
        ];

        await prisma.animal.createMany({ data: animals, skipDuplicates: true });


        // // criar lote
        // // --- 1) Fazenda Beta -> contrato "Sabor do Campo Laticínios - Fazenda Beta" ---
        // const contratoBetaKey = "Sabor do Campo Laticínios - Fazenda Beta";
        // const contratoBetaId = contratoMap[contratoBetaKey];
        // if (!contratoBetaId) throw new Error(`contratoMap faltando: ${contratoBetaKey}`);

        // // buscar todos itens do contrato Beta para mapear por nome (lowercase)
        // const itensContratoBeta = await prisma.contratoItens.findMany({ where: { contratoId: contratoBetaId } });
        // const mapItensBeta = {};
        // itensContratoBeta.forEach(i => { mapItensBeta[(i.nome || "").toLowerCase()] = i; });

        // const produtosBeta = [
        //     { nome: "Leite cru tipo A (L)", quantidadeEsperada: 200, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite cru tipo B (L)", quantidadeEsperada: 80, unidadeMedida: UMED.LITRO },
        //     { nome: "Nata / creme do leite (kg)", quantidadeEsperada: 12, unidadeMedida: UMED.KG },
        //     { nome: "Soro de leite (L)", quantidadeEsperada: 48, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite pasteurizado 1L", quantidadeEsperada: 140, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite pasteurizado 2L", quantidadeEsperada: 48, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite UHT 1L", quantidadeEsperada: 80, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite integral 1L", quantidadeEsperada: 72, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite desnatado 1L", quantidadeEsperada: 36, unidadeMedida: UMED.LITRO },
        //     { nome: "Leite sem lactose 1L", quantidadeEsperada: 16, unidadeMedida: UMED.LITRO },
        //     { nome: "Creme de leite 200ml", quantidadeEsperada: 36, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Manteiga 200g", quantidadeEsperada: 28, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Manteiga 500g", quantidadeEsperada: 12, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Ricota fresca (kg)", quantidadeEsperada: 6, unidadeMedida: UMED.KG },
        //     { nome: "Minas padrão (kg)", quantidadeEsperada: 12, unidadeMedida: UMED.KG },
        //     { nome: "Queijo mussarela (peça 3kg)", quantidadeEsperada: 4, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Queijo mussarela (barra 1kg)", quantidadeEsperada: 11, unidadeMedida: UMED.KG },
        //     { nome: "Queijo parmesão (peça 1kg)", quantidadeEsperada: 3, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Iogurte natural 170g", quantidadeEsperada: 64, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Iogurte sabor morango 170g", quantidadeEsperada: 48, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Iogurte sabor coco 170g", quantidadeEsperada: 32, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Iogurte garrafa 1L", quantidadeEsperada: 16, unidadeMedida: UMED.LITRO },
        //     { nome: "Requeijão cremoso 200g", quantidadeEsperada: 36, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Doce de leite pastoso 400g", quantidadeEsperada: 17, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Doce de leite em barra 300g", quantidadeEsperada: 10, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Kefir líquido 1L", quantidadeEsperada: 9, unidadeMedida: UMED.LITRO },
        //     { nome: "Coalhada fresca (kg)", quantidadeEsperada: 6, unidadeMedida: UMED.KG }
        // ];

        // const itensEsperadosBeta = produtosBeta.map(p => {
        //     const encontrado = mapItensBeta[(p.nome || "").toLowerCase()];
        //     return {
        //         contratoItemId: encontrado ? encontrado.id : null,
        //         contratoItemNome: p.nome,
        //         produtoId: encontrado && encontrado.produtoId ? encontrado.produtoId : null,
        //         quantidadeEsperada: p.quantidadeEsperada,
        //         unidadeMedida: p.unidadeMedida,
        //         dataEnvioReferencia: "2025-05-06T07:30:00.000Z"
        //     };
        // });

        // const loteBeta = await prisma.lote.create({
        //     data: {
        //         unidadeId: unidadeMap["Fazenda Beta"],
        //         responsavelId: usuarioMap["Richard Souza"] || usuarioMap["Admin"] || 1,
        //         nome: "Lote Completo - Sabor do Campo - 2025-05-06",
        //         tipo: TL.LEITE,
        //         qntdItens: produtosBeta.length,
        //         preco: 0,
        //         unidadeMedida: UMED.UNIDADE,
        //         observacoes: "Lote completo com todos os produtos combinados no contrato Sabor do Campo - Fazenda Beta",
        //         status: SLOTE.PENDENTE,
        //         contratoId: contratoBetaId,
        //         dataEnvioReferencia: new Date("2025-05-06T07:30:00.000Z"),
        //         itensEsperados: itensEsperadosBeta
        //     }
        // });

        // console.log("Lote criado (Fazenda Beta):", loteBeta.id);

        // // --- 2) Fazenda Teste -> contrato "Loja Teste - Fazenda Teste" ---
        // const contratoLojaKey = "Loja Teste - Fazenda Teste";
        // const contratoLojaId = contratoMap[contratoLojaKey];
        // if (!contratoLojaId) throw new Error(`contratoMap faltando: ${contratoLojaKey}`);

        // const itensContratoLoja = await prisma.contratoItens.findMany({ where: { contratoId: contratoLojaId } });
        // const mapItensLoja = {};
        // itensContratoLoja.forEach(i => { mapItensLoja[(i.nome || "").toLowerCase()] = i; });

        // const produtosLoja = [
        //     { nome: "Leite pasteurizado 1L (teste)", quantidadeEsperada: 20, unidadeMedida: UMED.LITRO },
        //     { nome: "Queijo fresco 500g (teste)", quantidadeEsperada: 4, unidadeMedida: UMED.UNIDADE },
        //     { nome: "Carne bovina corte dianteiro (teste)", quantidadeEsperada: 10, unidadeMedida: UMED.KG },
        //     { nome: "Carne bovina corte traseiro (teste)", quantidadeEsperada: 8, unidadeMedida: UMED.KG }
        // ];

        // const itensEsperadosLoja = produtosLoja.map(p => {
        //     const encontrado = mapItensLoja[(p.nome || "").toLowerCase()];
        //     return {
        //         contratoItemId: encontrado ? encontrado.id : null,
        //         contratoItemNome: p.nome,
        //         produtoId: encontrado && encontrado.produtoId ? encontrado.produtoId : null,
        //         quantidadeEsperada: p.quantidadeEsperada,
        //         unidadeMedida: p.unidadeMedida,
        //         dataEnvioReferencia: "2025-06-03T10:00:00.000Z"
        //     };
        // });

        // const loteLoja = await prisma.lote.create({
        //     data: {
        //         unidadeId: unidadeMap["Fazenda Teste"],
        //         responsavelId: usuarioMap["Usuario Ficticio"] || 1,
        //         nome: "Lote Completo - Loja Teste - 2025-06-03",
        //         tipo: TL.OUTRO,
        //         qntdItens: produtosLoja.length,
        //         preco: 0,
        //         unidadeMedida: UMED.UNIDADE,
        //         observacoes: "Lote completo com itens combinados no contrato Loja Teste - Fazenda Teste",
        //         status: SLOTE.PENDENTE,
        //         contratoId: contratoLojaId,
        //         dataEnvioReferencia: new Date("2025-06-03T10:00:00.000Z"),
        //         itensEsperados: itensEsperadosLoja
        //     }
        // });

        // console.log("Lote criado (Fazenda Teste - Loja Teste):", loteLoja.id);

        // // --- 3) Fazenda Teste -> contrato "Casa Útil Mercado - Fazenda Teste" (sem produtos listados) ---
        // const contratoCasaKey = "Casa Útil Mercado - Fazenda Teste";
        // const contratoCasaId = contratoMap[contratoCasaKey];

        // if (contratoCasaId) {
        //     const loteCasa = await prisma.lote.create({
        //         data: {
        //             unidadeId: unidadeMap["Fazenda Teste"],
        //             responsavelId: usuarioMap["Usuario Ficticio"],
        //             nome: "Lote - Casa Útil Mercado - 2025-03-02",
        //             tipo: TL.OUTRO,
        //             qntdItens: 0,
        //             preco: 0,
        //             unidadeMedida: UMED.UNIDADE,
        //             observacoes: "Lote criado (sem itens explícitos no seed) para contrato Casa Útil Mercado - preencha itensEsperados se desejar",
        //             status: SLOTE.PENDENTE,
        //             contratoId: contratoCasaId,
        //             dataEnvioReferencia: new Date("2025-03-02T09:00:00.000Z"),
        //             itensEsperados: []
        //         }
        //     });
        //     console.log("Lote criado (Fazenda Teste - Casa Útil Mercado):", loteCasa.id);
        // } else {
        //     console.log("Contrato Casa Útil Mercado - Fazenda Teste não encontrado no contratoMap; pulei criação do lote correspondente.");
        // }

        // ===== CRIAR LOTES DE ANIMAIS AUTOMATICAMENTE =====
        console.log("Criando lotes automáticos de animais recebidos...");

        // Buscar todos os animais criados
        const animaisCriados = await prisma.animal.findMany({
            include: { unidade: true }
        });

        // Agrupar animais por: unidadeId + dataEntrada + raça
        const gruposAnimais = {};

        animaisCriados.forEach(animal => {
            // Normalizar data (apenas dia, sem hora)
            const dataKey = animal.dataEntrada
                ? new Date(animal.dataEntrada).toISOString().split('T')[0]
                : 'sem-data';

            const chave = `${animal.unidadeId}-${dataKey}-${animal.raca}`;

            if (!gruposAnimais[chave]) {
                gruposAnimais[chave] = {
                    unidadeId: animal.unidadeId,
                    dataEntrada: animal.dataEntrada,
                    raca: animal.raca,
                    animais: [],
                    tipo: animal.tipo
                };
            }

            gruposAnimais[chave].animais.push(animal);
        });

        // Criar um lote para cada grupo
        const lotesAnimaisCriados = [];

        for (const [chave, grupo] of Object.entries(gruposAnimais)) {
            // Buscar responsável da unidade (gerente ou primeiro usuário)
            const responsavel = await prisma.usuario.findFirst({
                where: {
                    unidadeId: grupo.unidadeId,
                    OR: [
                        { perfilId: perfilMap["GERENTE_FAZENDA"] },
                        { unidadeId: grupo.unidadeId }
                    ]
                }
            });

            if (!responsavel) {
                console.warn(`Responsável não encontrado para unidade ${grupo.unidadeId}`);
                continue;
            }

            // Buscar contrato onde esta fazenda é fornecedora
            const contratoRelacionado = await prisma.contrato.findFirst({
                where: {
                    fornecedorUnidadeId: grupo.unidadeId,
                    status: SCON.ATIVO
                },
                include: { unidade: true }
            });

            const dataFormatada = grupo.dataEntrada
                ? new Date(grupo.dataEntrada).toLocaleDateString('pt-BR')
                : 'Data não definida';

            const lote = await prisma.lote.create({
                data: {
                    unidadeId: grupo.unidadeId,
                    responsavelId: responsavel.id,
                    nome: `Lote ${grupo.raca} - Recebimento ${dataFormatada}`,
                    tipo: TL.GADO, // Ajustar conforme necessário
                    qntdItens: grupo.animais.reduce((sum, a) => sum + a.quantidade, 0),
                    preco: grupo.animais.reduce((sum, a) => sum + (a.custo * a.quantidade), 0),
                    unidadeMedida: UMED.CABECA,
                    observacoes: `Lote automático criado com ${grupo.animais.length} registros de animais da raça ${grupo.raca}. ${contratoRelacionado ? `Destinado ao contrato com ${contratoRelacionado.unidade.nome}` : 'Sem contrato vinculado.'}`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PRONTO,
                    contratoId: contratoRelacionado?.id || null,
                    dataEnvioReferencia: contratoRelacionado?.dataEnvio || null,
                    itensEsperados: grupo.animais.map(a => ({
                        animalId: a.id,
                        raca: a.raca,
                        quantidade: a.quantidade,
                        custo: a.custo
                    }))
                }
            });

            lotesAnimaisCriados.push(lote);

            // Atualizar animais com o loteId
            for (const animal of grupo.animais) {
                await prisma.animal.update({
                    where: { id: animal.id },
                    data: { loteId: lote.id }
                });
            }

            console.log(`✓ Lote criado: ${lote.nome} (${lote.qntdItens} cabeças)`);
        }

        console.log(`Total de lotes de animais criados: ${lotesAnimaisCriados.length}`);

        // ===== CRIAR PLANTIOS NAS FAZENDAS =====
        console.log("\nCriando plantios nas fazendas...");

        const plantiosData = [
            // Fazenda Gamma - Grãos e cereais
            {
                categoria: "Soja",
                areaHectares: 200,
                dataPlantio: new Date("2024-10-01"),
                dataColheitaEstimativa: new Date("2025-02-15"),
                custo: 50000,
                unidadeId: unidadeMap["Fazenda Gamma"]
            },
            {
                categoria: "Milho",
                areaHectares: 150,
                dataPlantio: new Date("2024-09-15"),
                dataColheitaEstimativa: new Date("2025-01-30"),
                custo: 35000,
                unidadeId: unidadeMap["Fazenda Gamma"]
            },
            {
                categoria: "Trigo",
                areaHectares: 100,
                dataPlantio: new Date("2024-11-01"),
                dataColheitaEstimativa: new Date("2025-03-20"),
                custo: 28000,
                unidadeId: unidadeMap["Fazenda Gamma"]
            },

            // Fazenda Delta - Hortaliças e vegetais
            {
                categoria: "Alface",
                areaHectares: 5,
                dataPlantio: new Date("2025-01-10"),
                dataColheitaEstimativa: new Date("2025-03-01"),
                custo: 3000,
                unidadeId: unidadeMap["Fazenda Delta"]
            },
            {
                categoria: "Tomate",
                areaHectares: 10,
                dataPlantio: new Date("2024-12-01"),
                dataColheitaEstimativa: new Date("2025-04-15"),
                custo: 8000,
                unidadeId: unidadeMap["Fazenda Delta"]
            },
            {
                categoria: "Cenoura",
                areaHectares: 8,
                dataPlantio: new Date("2024-11-15"),
                dataColheitaEstimativa: new Date("2025-03-10"),
                custo: 5000,
                unidadeId: unidadeMap["Fazenda Delta"]
            },
            {
                categoria: "Pepino",
                areaHectares: 6,
                dataPlantio: new Date("2025-01-05"),
                dataColheitaEstimativa: new Date("2025-03-25"),
                custo: 4500,
                unidadeId: unidadeMap["Fazenda Delta"]
            }
        ];

        await prisma.plantio.createMany({
            data: plantiosData,
            skipDuplicates: true
        });

        console.log(`✓ ${plantiosData.length} plantios criados`);

        // ===== CRIAR LOTES DE PLANTIOS =====
        console.log("\nCriando lotes de plantios...");

        const plantiosCriados = await prisma.plantio.findMany({
            include: { unidade: true }
        });

        const lotesPlantiosCriados = [];

        for (const plantio of plantiosCriados) {
            // Buscar responsável da unidade
            const responsavel = await prisma.usuario.findFirst({
                where: {
                    unidadeId: plantio.unidadeId,
                    OR: [
                        { perfilId: perfilMap["GERENTE_FAZENDA"] },
                        { unidadeId: plantio.unidadeId }
                    ]
                }
            });

            if (!responsavel) continue;

            // Buscar contrato relacionado
            const contratoRelacionado = await prisma.contrato.findFirst({
                where: {
                    fornecedorUnidadeId: plantio.unidadeId,
                    status: SCON.ATIVO
                },
                include: { unidade: true }
            });

            // Determinar tipo de lote baseado na categoria
            let tipoLote = TL.PLANTIO;
            if (['Soja', 'Milho', 'Trigo'].includes(plantio.categoria)) {
                tipoLote = TL.SOJA; // Ou criar um tipo específico para grãos
            }

            const dataPlantioFormatada = plantio.dataPlantio
                ? new Date(plantio.dataPlantio).toLocaleDateString('pt-BR')
                : 'Data não definida';

            const lote = await prisma.lote.create({
                data: {
                    unidadeId: plantio.unidadeId,
                    responsavelId: responsavel.id,
                    nome: `Lote ${plantio.categoria} - Plantio ${dataPlantioFormatada}`,
                    tipo: tipoLote,
                    qntdItens: 1, // 1 talhão/área de plantio
                    preco: plantio.custo || 0,
                    unidadeMedida: UMED.SACA, // Ajustar conforme produto final
                    observacoes: `Lote de plantio de ${plantio.categoria} em ${plantio.areaHectares} hectares. Colheita prevista: ${plantio.dataColheitaEstimativa?.toLocaleDateString('pt-BR') || 'Não definida'}. ${contratoRelacionado ? `Destinado ao contrato com ${contratoRelacionado.unidade.nome}` : ''}`,
                    statusQualidade: SQ.PROPRIO,
                    status: SLOTE.PENDENTE, // Aguardando colheita
                    contratoId: contratoRelacionado?.id || null,
                    dataEnvioReferencia: plantio.dataColheitaEstimativa || null,
                    itensEsperados: [{
                        plantioId: plantio.id,
                        categoria: plantio.categoria,
                        areaHectares: plantio.areaHectares,
                        dataColheitaEstimativa: plantio.dataColheitaEstimativa
                    }]
                }
            });

            lotesPlantiosCriados.push(lote);

            // Atualizar plantio com loteId
            await prisma.plantio.update({
                where: { id: plantio.id },
                data: { loteId: lote.id }
            });

            console.log(`✓ Lote de plantio criado: ${lote.nome}`);
        }

        console.log(`Total de lotes de plantios criados: ${lotesPlantiosCriados.length}`);
        console.log(`\n📦 Resumo: ${lotesAnimaisCriados.length} lotes de animais + ${lotesPlantiosCriados.length} lotes de plantios = ${lotesAnimaisCriados.length + lotesPlantiosCriados.length} lotes totais\n`);

        // ===== CRIAR ATIVIDADES PARA ANIMAIS (AtvdAnimalia) =====
        console.log("\n🐄 Criando atividades de manejo animal...");

        const tiposAnimais = [
            TL.GADO,
            TL.BOVINOS,
            TL.SUINOS,
            TL.OVINOS,
            TL.AVES,
            TL.EQUINO,
            TL.CAPRINOS
        ].filter(Boolean); // remove todos os undefined automaticamente

        const lotesAnimais = await prisma.lote.findMany({
            where: {
                tipo: { in: tiposAnimais }
            },
            include: {
                animals: true,
                responsavel: true
            }
        });

        const atividadesAnimaisCriadas = [];

        for (const lote of lotesAnimais) {
            if (!lote.animals || lote.animals.length === 0) continue;

            for (const animal of lote.animals) {
                const atividadesParaAnimal = [
                    {
                        tipo: TANIMALIA.RECEBIMENTO,
                        descricao: `Recebimento e registro de ${animal.animal} ${animal.raca}`,
                        dataInicio: animal.dataEntrada || new Date("2025-09-01"),
                        dataFim: animal.dataEntrada || new Date("2025-09-01"),
                        status: SATVDA.CONCLUIDA
                    },
                    {
                        tipo: TANIMALIA.VACINACAO,
                        descricao: `Vacinação inicial contra doenças comuns - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 2 * 24 * 60 * 60 * 1000) : new Date("2025-09-03"),
                        dataFim: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 2 * 24 * 60 * 60 * 1000) : new Date("2025-09-03"),
                        status: SATVDA.CONCLUIDA
                    },
                    {
                        tipo: TANIMALIA.VERMIFUGACAO,
                        descricao: `Vermifugação de rotina - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 7 * 24 * 60 * 60 * 1000) : new Date("2025-09-08"),
                        dataFim: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 7 * 24 * 60 * 60 * 1000) : new Date("2025-09-08"),
                        status: SATVDA.CONCLUIDA
                    },
                    {
                        tipo: TANIMALIA.MANEJO_PESAGEM,
                        descricao: `Pesagem e avaliação de ganho de peso - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 15 * 24 * 60 * 60 * 1000) : new Date("2025-09-16"),
                        dataFim: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 15 * 24 * 60 * 60 * 1000) : new Date("2025-09-16"),
                        status: SATVDA.CONCLUIDA
                    },
                    {
                        tipo: TANIMALIA.NUTRICAO,
                        descricao: `Ajuste de dieta nutricional - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 20 * 24 * 60 * 60 * 1000) : new Date("2025-09-21"),
                        dataFim: null,
                        status: SATVDA.ATIVA
                    }
                ];

                if (animal.tipo === TAN.ORDENHA) {
                    atividadesParaAnimal.push({
                        tipo: TANIMALIA.ORDENHA_DIARIA,
                        descricao: `Ordenha diária - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 10 * 24 * 60 * 60 * 1000) : new Date("2025-09-11"),
                        dataFim: null,
                        status: SATVDA.ATIVA
                    });
                }

                if (animal.tipo === TAN.REPRODUCAO) {
                    atividadesParaAnimal.push({
                        tipo: TANIMALIA.MONITORAMENTO_CIO,
                        descricao: `Monitoramento de cio - ${animal.raca}`,
                        dataInicio: animal.dataEntrada ? new Date(new Date(animal.dataEntrada).getTime() + 30 * 24 * 60 * 60 * 1000) : new Date("2025-10-01"),
                        dataFim: null,
                        status: SATVDA.ATIVA
                    });
                }

                for (const atvd of atividadesParaAnimal) {
                    const atividade = await prisma.atvdAnimalia.create({
                        data: {
                            animalId: animal.id,
                            loteId: lote.id,
                            responsavelId: lote.responsavelId,
                            descricao: atvd.descricao,
                            tipo: atvd.tipo,
                            dataInicio: atvd.dataInicio,
                            dataFim: atvd.dataFim,
                            status: atvd.status,
                            anexos: null
                        }
                    });
                    atividadesAnimaisCriadas.push(atividade);
                }
            }
        }

        console.log(`✓ ${atividadesAnimaisCriadas.length} atividades de manejo animal criadas`);

        // ===== CRIAR ATIVIDADES AGRÍCOLAS (AtvdAgricola) =====
        console.log("\n🌾 Criando atividades agrícolas...");

        const lotesPlantios = await prisma.lote.findMany({
            where: {
                tipo: { in: [TL.PLANTIO, TL.SOJA] }
            },
            include: {
                plantios: true,
                responsavel: true
            }
        });

        const atividadesAgricolasCriadas = [];

        for (const lote of lotesPlantios) {
            if (!lote.plantios || lote.plantios.length === 0) continue;

            for (const plantio of lote.plantios) {
                const dataPlantio = plantio.dataPlantio || new Date("2024-10-01");
                const dataColheita = plantio.dataColheitaEstimativa || new Date("2025-02-01");

                const atividadesParaPlantio = [
                    {
                        tipo: TATV.PLANTIO,
                        descricao: `Plantio de ${plantio.categoria} - ${plantio.areaHectares} hectares`,
                        dataInicio: dataPlantio,
                        dataFim: new Date(dataPlantio.getTime() + 2 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.IRRIGACAO,
                        descricao: `Sistema de irrigação - ${plantio.categoria}`,
                        dataInicio: new Date(dataPlantio.getTime() + 5 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(dataPlantio.getTime() + 60 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.ADUBACAO,
                        descricao: `Adubação de cobertura - ${plantio.categoria}`,
                        dataInicio: new Date(dataPlantio.getTime() + 30 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(dataPlantio.getTime() + 32 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.USO_AGROTOXICO,
                        descricao: `Aplicação de defensivos agrícolas - ${plantio.categoria}`,
                        dataInicio: new Date(dataPlantio.getTime() + 45 * 24 * 60 * 60 * 1000),
                        dataFim: new Date(dataPlantio.getTime() + 45 * 24 * 60 * 60 * 1000),
                        status: SPLANT.COLHIDO
                    },
                    {
                        tipo: TATV.COLHEITA,
                        descricao: `Colheita de ${plantio.categoria}`,
                        dataInicio: new Date(dataColheita.getTime() - 5 * 24 * 60 * 60 * 1000),
                        dataFim: dataColheita,
                        status: plantio.dataColheitaEstimativa < new Date() ? SPLANT.COLHIDO : SPLANT.EM_DESENVOLVIMENTO
                    }
                ];

                for (const atvd of atividadesParaPlantio) {
                    const atividade = await prisma.atvdAgricola.create({
                        data: {
                            loteId: lote.id,
                            responsavelId: lote.responsavelId,
                            descricao: atvd.descricao,
                            tipo: atvd.tipo,
                            dataInicio: atvd.dataInicio,
                            dataFim: atvd.dataFim,
                            status: atvd.status
                        }
                    });
                    atividadesAgricolasCriadas.push(atividade);
                }
            }
        }

        console.log(`✓ ${atividadesAgricolasCriadas.length} atividades agrícolas criadas`);

        // ===== CRIAR PRODUÇÕES BASEADAS NOS CONTRATOS COM LOJAS =====
        console.log("\n📊 Criando produções baseadas nos contratos...");

        const producoesGeradas = [];

        // === FAZENDA BETA -> SABOR DO CAMPO LATICÍNIOS ===
        console.log("Processando: Fazenda Beta -> Sabor do Campo Laticínios");

        const contratoBetaSabor = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Beta"],
                unidadeId: unidadeMap["Sabor do Campo Laticínios"]
            },
            include: {
                itens: true
            }
        });

        if (contratoBetaSabor) {
            const loteBeta = await prisma.lote.findFirst({
                where: {
                    unidadeId: unidadeMap["Fazenda Beta"],
                    contratoId: contratoBetaSabor.id
                },
                include: { responsavel: true, animals: true }
            });

            if (loteBeta) {
                // Para cada item do contrato, criar uma produção
                for (const itemContrato of contratoBetaSabor.itens) {
                    const quantidadeContratada = Number(itemContrato.quantidade);
                    const precoUnit = Number(itemContrato.precoUnitario);

                    const producao = await prisma.producao.create({
                        data: {
                            loteId: loteBeta.id,
                            animalId: loteBeta.animals[0]?.id || null,
                            tipoProduto: itemContrato.nome,
                            quantidadeBruta: quantidadeContratada * 1.05, // 5% a mais na produção bruta
                            quantidadeLiquida: quantidadeContratada,
                            unidadeMedida: itemContrato.unidadeMedida,
                            perdaPercent: 5.0,
                            custoMaoObra: quantidadeContratada * precoUnit * 0.15,
                            outrosCustos: quantidadeContratada * precoUnit * 0.10,
                            custoTotal: quantidadeContratada * precoUnit * 0.75, // 75% do preço de venda
                            custoUnitario: precoUnit * 0.75,
                            dataInicio: new Date("2025-05-01"),
                            dataFim: new Date("2025-05-05"),
                            dataColheita: new Date("2025-05-05"),
                            dataRegistro: new Date(),
                            status: SPROD.FINALIZADA,
                            responsavelId: loteBeta.responsavelId,
                            destinoUnidadeId: unidadeMap["Sabor do Campo Laticínios"],
                            observacoes: `Produção de ${itemContrato.nome} para contrato com Sabor do Campo Laticínios`
                        }
                    });
                    producoesGeradas.push(producao);
                }
            }
        }

        // === FAZENDA TESTE -> LOJA TESTE ===
        console.log("Processando: Fazenda Teste -> Loja Teste");

        const contratoTesteLoja = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Teste"],
                unidadeId: unidadeMap["Loja Teste"]
            },
            include: {
                itens: true
            }
        });

        if (contratoTesteLoja) {
            const loteTeste = await prisma.lote.findFirst({
                where: {
                    unidadeId: unidadeMap["Fazenda Teste"],
                    contratoId: contratoTesteLoja.id
                },
                include: { responsavel: true, animals: true }
            });

            if (loteTeste) {
                for (const itemContrato of contratoTesteLoja.itens) {
                    const quantidadeContratada = Number(itemContrato.quantidade);
                    const precoUnit = Number(itemContrato.precoUnitario);

                    const producao = await prisma.producao.create({
                        data: {
                            loteId: loteTeste.id,
                            animalId: loteTeste.animals[0]?.id || null,
                            tipoProduto: itemContrato.nome,
                            quantidadeBruta: quantidadeContratada * 1.08,
                            quantidadeLiquida: quantidadeContratada,
                            unidadeMedida: itemContrato.unidadeMedida,
                            perdaPercent: 8.0,
                            custoMaoObra: quantidadeContratada * precoUnit * 0.20,
                            outrosCustos: quantidadeContratada * precoUnit * 0.12,
                            custoTotal: quantidadeContratada * precoUnit * 0.70,
                            custoUnitario: precoUnit * 0.70,
                            dataInicio: new Date("2025-06-01"),
                            dataFim: new Date("2025-06-02"),
                            dataColheita: new Date("2025-06-02"),
                            dataRegistro: new Date(),
                            status: SPROD.FINALIZADA,
                            responsavelId: loteTeste.responsavelId,
                            destinoUnidadeId: unidadeMap["Loja Teste"],
                            observacoes: `Produção de ${itemContrato.nome} para contrato com Loja Teste`
                        }
                    });
                    producoesGeradas.push(producao);
                }
            }
        }

        // === FAZENDA GAMMA -> CASA ÚTIL MERCADO ===
        console.log("Processando: Fazenda Gamma -> Casa Útil Mercado");

        const contratoGammaCasa = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Gamma"],
                unidadeId: unidadeMap["Casa Útil Mercado"]
            },
            include: {
                itens: true
            }
        });

        if (contratoGammaCasa) {
            const loteGamma = await prisma.lote.findFirst({
                where: {
                    unidadeId: unidadeMap["Fazenda Gamma"],
                    contratoId: contratoGammaCasa.id
                },
                include: { responsavel: true, plantios: true }
            });

            if (loteGamma) {
                for (const itemContrato of contratoGammaCasa.itens) {
                    const quantidadeContratada = Number(itemContrato.quantidade);
                    const precoUnit = Number(itemContrato.precoUnitario);

                    const producao = await prisma.producao.create({
                        data: {
                            loteId: loteGamma.id,
                            plantioId: loteGamma.plantios[0]?.id || null,
                            tipoProduto: itemContrato.nome,
                            quantidadeBruta: quantidadeContratada * 1.10,
                            quantidadeLiquida: quantidadeContratada,
                            unidadeMedida: itemContrato.unidadeMedida,
                            perdaPercent: 10.0,
                            rendimentoPorHa: 3000, // exemplo: soja
                            custoMaoObra: quantidadeContratada * precoUnit * 0.25,
                            outrosCustos: quantidadeContratada * precoUnit * 0.15,
                            custoTotal: quantidadeContratada * precoUnit * 0.65,
                            custoUnitario: precoUnit * 0.65,
                            dataInicio: new Date("2025-04-10"),
                            dataFim: new Date("2025-04-17"),
                            dataColheita: new Date("2025-04-17"),
                            dataRegistro: new Date(),
                            status: SPROD.FINALIZADA,
                            metodo: "MECANIZADA",
                            responsavelId: loteGamma.responsavelId,
                            destinoUnidadeId: unidadeMap["Casa Útil Mercado"],
                            observacoes: `Produção de ${itemContrato.nome} para contrato com Casa Útil Mercado`
                        }
                    });
                    producoesGeradas.push(producao);
                }
            }
        }

        // === FAZENDA DELTA -> VERDEFRESCO HORTALIÇAS ===
        console.log("Processando: Fazenda Delta -> VerdeFresco Hortaliças");

        const contratoDeltaVerde = await prisma.contrato.findFirst({
            where: {
                fornecedorUnidadeId: unidadeMap["Fazenda Delta"],
                unidadeId: unidadeMap["VerdeFresco Hortaliças"]
            },
            include: {
                itens: true
            }
        });

        if (contratoDeltaVerde) {
            const loteDelta = await prisma.lote.findFirst({
                where: {
                    unidadeId: unidadeMap["Fazenda Delta"],
                    contratoId: contratoDeltaVerde.id
                },
                include: { responsavel: true, plantios: true }
            });

            if (loteDelta) {
                for (const itemContrato of contratoDeltaVerde.itens) {
                    const quantidadeContratada = Number(itemContrato.quantidade);
                    const precoUnit = Number(itemContrato.precoUnitario);

                    const producao = await prisma.producao.create({
                        data: {
                            loteId: loteDelta.id,
                            plantioId: loteDelta.plantios[0]?.id || null,
                            tipoProduto: itemContrato.nome,
                            quantidadeBruta: quantidadeContratada * 1.12,
                            quantidadeLiquida: quantidadeContratada,
                            unidadeMedida: itemContrato.unidadeMedida,
                            perdaPercent: 12.0,
                            rendimentoPorHa: 15000, // hortaliças
                            custoMaoObra: quantidadeContratada * precoUnit * 0.30,
                            outrosCustos: quantidadeContratada * precoUnit * 0.18,
                            custoTotal: quantidadeContratada * precoUnit * 0.60,
                            custoUnitario: precoUnit * 0.60,
                            dataInicio: new Date("2025-05-01"),
                            dataFim: new Date("2025-05-02"),
                            dataColheita: new Date("2025-05-02"),
                            dataRegistro: new Date(),
                            status: SPROD.FINALIZADA,
                            metodo: "MANUAL",
                            responsavelId: loteDelta.responsavelId,
                            destinoUnidadeId: unidadeMap["VerdeFresco Hortaliças"],
                            observacoes: `Produção de ${itemContrato.nome} para contrato com VerdeFresco Hortaliças`
                        }
                    });
                    producoesGeradas.push(producao);
                }
            }
        }

        console.log(`✓ ${producoesGeradas.length} produções criadas baseadas nos contratos com lojas`);
        console.log(`\n📦 Resumo completo:`);
        console.log(`   - ${atividadesAnimaisCriadas.length} atividades animais`);
        console.log(`   - ${atividadesAgricolasCriadas.length} atividades agrícolas`);
        console.log(`   - ${producoesGeradas.length} produções finalizadas\n`);

        // pedidos loja

        // estoque loja

        // ===== CRIAR PRODUTOS PARA VENDA NAS LOJAS =====
        console.log("\n🛒 Criando produtos para venda nas lojas...");

        const produtosParaVenda = [];

        // === SABOR DO CAMPO LATICÍNIOS ===
        console.log("Criando produtos: Sabor do Campo Laticínios");

        const estoquesSaborCampo = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Sabor do Campo Laticínios"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesSaborCampo) {
            // Pegar 50% do estoque para transformar em produtos à venda
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.5);

            if (qtdParaVenda > 0) {
                // Criar produtos individuais
                for (let i = 0; i < Math.min(qtdParaVenda, 10); i++) { // Limitar a 10 produtos por item
                    const markup = 1.25; // 25% de margem
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    // Validade baseada no tipo de produto
                    if (estoqueItem.nome.includes("Leite")) {
                        dataValidade.setDate(dataValidade.getDate() + 7); // 7 dias
                    } else if (estoqueItem.nome.includes("Queijo") || estoqueItem.nome.includes("Manteiga")) {
                        dataValidade.setDate(dataValidade.getDate() + 30); // 30 dias
                    } else if (estoqueItem.nome.includes("Iogurte")) {
                        dataValidade.setDate(dataValidade.getDate() + 15); // 15 dias
                    } else {
                        dataValidade.setDate(dataValidade.getDate() + 20); // padrão 20 dias
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                            origemUnidadeId: unidadeMap["Fazenda Beta"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-SCL-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: "Laticínios",
                            descricao: `${estoqueItem.nome} - Produto pronto para venda`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === LOJA TESTE ===
        console.log("Criando produtos: Loja Teste");

        const estoquesLojaTeste = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Loja Teste"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesLojaTeste) {
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.4); // 40% para venda

            if (qtdParaVenda > 0) {
                for (let i = 0; i < Math.min(qtdParaVenda, 8); i++) {
                    const markup = 1.30; // 30% de margem
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    if (estoqueItem.nome.includes("Leite")) {
                        dataValidade.setDate(dataValidade.getDate() + 7);
                    } else if (estoqueItem.nome.includes("Queijo")) {
                        dataValidade.setDate(dataValidade.getDate() + 25);
                    } else if (estoqueItem.nome.includes("Carne")) {
                        dataValidade.setDate(dataValidade.getDate() + 5);
                    } else {
                        dataValidade.setDate(dataValidade.getDate() + 15);
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Loja Teste"],
                            origemUnidadeId: unidadeMap["Fazenda Teste"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-LT-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: estoqueItem.nome.includes("Leite") || estoqueItem.nome.includes("Queijo") ? "Laticínios" : "Açougue",
                            descricao: `${estoqueItem.nome} - Disponível para venda`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === CASA ÚTIL MERCADO ===
        console.log("Criando produtos: Casa Útil Mercado");

        const estoquesCasaUtil = await prisma.estoqueProduto.findMany({
            where: {
                estoque: {
                    unidadeId: unidadeMap["Casa Útil Mercado"]
                }
            },
            include: {
                estoque: true
            }
        });

        for (const estoqueItem of estoquesCasaUtil) {
            const qtdParaVenda = Math.floor(estoqueItem.quantidade * 0.6); // 60% para venda

            if (qtdParaVenda > 0) {
                for (let i = 0; i < Math.min(qtdParaVenda, 15); i++) {
                    const markup = 1.20; // 20% de margem (grãos têm margem menor)
                    const precoCusto = Number(estoqueItem.precoUnitario || 0);
                    const precoVenda = precoCusto * markup;

                    const dataFabricacao = new Date();
                    const dataValidade = new Date();

                    // Grãos têm validade maior
                    if (estoqueItem.nome.includes("Soja") || estoqueItem.nome.includes("Milho") || estoqueItem.nome.includes("Trigo")) {
                        dataValidade.setFullYear(dataValidade.getFullYear() + 1); // 1 ano
                    } else if (estoqueItem.nome.includes("Óleo")) {
                        dataValidade.setMonth(dataValidade.getMonth() + 6); // 6 meses
                    } else {
                        dataValidade.setMonth(dataValidade.getMonth() + 3); // 3 meses
                    }

                    const produto = await prisma.produto.create({
                        data: {
                            unidadeId: unidadeMap["Casa Útil Mercado"],
                            origemUnidadeId: unidadeMap["Fazenda Gamma"],
                            loteId: estoqueItem.loteId,
                            nome: estoqueItem.nome,
                            sku: `VENDA-CUM-${estoqueItem.id}-${i}-${Date.now()}`,
                            categoria: "Grãos e Cereais",
                            descricao: `${estoqueItem.nome} - Produto de qualidade premium`,
                            preco: precoVenda,
                            dataFabricacao: dataFabricacao,
                            dataValidade: dataValidade,
                            unidadeMedida: estoqueItem.unidadeBase,
                            pesoUnidade: estoqueItem.pesoUnidade,
                            isForSale: true,
                            tags: ["orgânico", "premium", "selecionado"]
                        }
                    });
                    produtosParaVenda.push(produto);
                }
            }
        }

        // === VERDEFRESCO HORTALIÇAS ===
        console.log("Criando produtos: VerdeFresco Hortaliças");

        // Como VerdeFresco não tem estoque criado ainda, vamos criar alguns produtos manualmente
        const produtosVerdeFresco = [
            { nome: "Alface Crespa", preco: 3.50, validade: 3, peso: 0.200, un: UMED.UNIDADE },
            { nome: "Alface Americana", preco: 4.20, validade: 3, peso: 0.250, un: UMED.UNIDADE },
            { nome: "Rúcula Fresca", preco: 3.80, validade: 2, peso: 0.150, un: UMED.UNIDADE },
            { nome: "Couve Manteiga", preco: 3.00, validade: 4, peso: 0.250, un: UMED.UNIDADE },
            { nome: "Tomate Caixa", preco: 8.50, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Pepino Japonês", preco: 5.00, validade: 5, peso: 0.200, un: UMED.UNIDADE },
            { nome: "Cenoura", preco: 4.50, validade: 10, peso: 1.000, un: UMED.KG }
        ];

        for (const item of produtosVerdeFresco) {
            const qtd = Math.floor(Math.random() * 20) + 10; // Entre 10 e 30 unidades

            for (let i = 0; i < qtd; i++) {
                const dataFabricacao = new Date();
                const dataValidade = new Date();
                dataValidade.setDate(dataValidade.getDate() + item.validade);

                const produto = await prisma.produto.create({
                    data: {
                        unidadeId: unidadeMap["VerdeFresco Hortaliças"],
                        origemUnidadeId: unidadeMap["Fazenda Delta"],
                        nome: item.nome,
                        sku: `VENDA-VFH-${item.nome.replace(/\s+/g, '')}-${i}-${Date.now()}`,
                        categoria: "Hortaliças",
                        descricao: `${item.nome} - Fresco e orgânico`,
                        preco: item.preco,
                        dataFabricacao: dataFabricacao,
                        dataValidade: dataValidade,
                        unidadeMedida: item.un,
                        pesoUnidade: item.peso,
                        isForSale: true,
                        tags: ["fresco", "orgânico", "local"]
                    }
                });
                produtosParaVenda.push(produto);
            }
        }

        // === AGROBOI ===
        console.log("Criando produtos: AgroBoi");

        const produtosAgroBoi = [
            { nome: "Coxão Mole", preco: 52.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Alcatra", preco: 72.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Contrafilé", preco: 78.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Picanha", preco: 110.00, validade: 5, peso: 1.000, un: UMED.KG },
            { nome: "Costela Ripa", preco: 36.00, validade: 7, peso: 1.000, un: UMED.KG },
            { nome: "Maminha", preco: 62.00, validade: 6, peso: 1.000, un: UMED.KG },
            { nome: "Carne Moída", preco: 32.00, validade: 3, peso: 1.000, un: UMED.KG },
            { nome: "Hambúrguer Artesanal 120g", preco: 7.50, validade: 30, peso: 0.120, un: UMED.UNIDADE },
            { nome: "Linguiça Bovina", preco: 38.00, validade: 20, peso: 1.000, un: UMED.KG }
        ];

        for (const item of produtosAgroBoi) {
            const qtd = Math.floor(Math.random() * 15) + 8; // Entre 8 e 23 unidades

            for (let i = 0; i < qtd; i++) {
                const dataFabricacao = new Date();
                const dataValidade = new Date();
                dataValidade.setDate(dataValidade.getDate() + item.validade);

                const produto = await prisma.produto.create({
                    data: {
                        unidadeId: unidadeMap["AgroBoi"],
                        origemUnidadeId: unidadeMap["Fazenda Alpha"],
                        nome: item.nome,
                        sku: `VENDA-AB-${item.nome.replace(/\s+/g, '')}-${i}-${Date.now()}`,
                        categoria: "Carnes",
                        descricao: `${item.nome} - Carne de qualidade certificada`,
                        preco: item.preco,
                        dataFabricacao: dataFabricacao,
                        dataValidade: dataValidade,
                        unidadeMedida: item.un,
                        pesoUnidade: item.peso,
                        isForSale: true,
                        tags: ["premium", "certificado", "rastreável"]
                    }
                });
                produtosParaVenda.push(produto);
            }
        }

        console.log(`✓ ${produtosParaVenda.length} produtos criados e disponíveis para venda nas lojas`);

        // Estatísticas por loja
        const estatisticas = {
            "Sabor do Campo Laticínios": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Sabor do Campo Laticínios"]).length,
            "Loja Teste": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Loja Teste"]).length,
            "Casa Útil Mercado": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["Casa Útil Mercado"]).length,
            "VerdeFresco Hortaliças": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["VerdeFresco Hortaliças"]).length,
            "AgroBoi": produtosParaVenda.filter(p => p.unidadeId === unidadeMap["AgroBoi"]).length
        };

        console.log("\n📊 Produtos por loja:");
        for (const [loja, qtd] of Object.entries(estatisticas)) {
            console.log(`   - ${loja}: ${qtd} produtos`);
        }
        console.log("");

        // CAIXAS
        const lojas = unidades.filter(u => u.tipo === TU.LOJA);

        for (const loja of lojas) {
            const gerenteLoja = await prisma.usuario.findFirst({
                where: {
                    unidadeId: loja.id,
                    perfilId: perfilMap["GERENTE_LOJA"]
                }
            });

            if (gerenteLoja) {
                await prisma.caixa.create({
                    data: {
                        unidadeId: loja.id,
                        usuarioId: gerenteLoja.id,
                        status: true, // Aberto
                        saldoInicial: 1000.00, // Saldo inicial padrão
                        abertoEm: new Date()
                    }
                });
            }
        }

        // venda

        // itens venda
        // ===== CRIAR VENDAS E ITENS DE VENDA =====
        console.log("\n💰 Criando vendas nas lojas...");

        const vendasCriadas = [];

        // Buscar todos os caixas abertos
        const caixasAbertas = await prisma.caixa.findMany({
            where: { status: true },
            include: { unidade: true, usuario: true }
        });

        for (const caixa of caixasAbertas) {
            // Buscar produtos disponíveis para venda nesta loja
            const produtosDisponiveis = await prisma.produto.findMany({
                where: {
                    unidadeId: caixa.unidadeId,
                    isForSale: true
                },
                take: 50 // Limitar para performance
            });

            if (produtosDisponiveis.length === 0) {
                console.log(`⚠️  Nenhum produto disponível para ${caixa.unidade.nome}`);
                continue;
            }

            // Criar entre 5 e 15 vendas por loja
            const numVendas = Math.floor(Math.random() * 11) + 5;

            for (let i = 0; i < numVendas; i++) {
                // Selecionar entre 1 e 5 produtos aleatórios
                const numItens = Math.floor(Math.random() * 5) + 1;
                const produtosSelecionados = [];

                for (let j = 0; j < numItens; j++) {
                    const produtoAleatorio = produtosDisponiveis[Math.floor(Math.random() * produtosDisponiveis.length)];
                    produtosSelecionados.push(produtoAleatorio);
                }

                // Calcular total da venda
                let totalVenda = 0;
                const itensVenda = [];

                for (const produto of produtosSelecionados) {
                    const quantidade = Math.floor(Math.random() * 3) + 1; // 1 a 3 unidades
                    const precoUnitario = Number(produto.preco);
                    const desconto = Math.random() < 0.3 ? (precoUnitario * 0.05 * quantidade) : 0; // 30% chance de 5% desconto
                    const subtotal = (precoUnitario * quantidade) - desconto;

                    totalVenda += subtotal;

                    itensVenda.push({
                        produtoId: produto.id,
                        quantidade: quantidade,
                        precoUnitario: precoUnitario,
                        desconto: desconto,
                        subtotal: subtotal
                    });
                }

                // Definir forma de pagamento aleatória
                const formasPagamento = [TPAG.DINHEIRO, TPAG.CARTAO, TPAG.PIX];
                const formaPagamento = formasPagamento[Math.floor(Math.random() * formasPagamento.length)];

                // Data da venda (últimos 30 dias)
                const dataVenda = new Date();
                // dataVenda.setDate(dataVenda.getDate() - Math.floor(Math.random() * 30));

                // Criar a venda
                const venda = await prisma.venda.create({
                    data: {
                        caixaId: caixa.id,
                        usuarioId: caixa.usuarioId,
                        unidadeId: caixa.unidadeId,
                        total: totalVenda,
                        pagamento: formaPagamento,
                        status: TS.OK,
                        criadoEm: dataVenda,
                        itens: {
                            create: itensVenda
                        }
                    },
                    include: {
                        itens: true
                    }
                });

                vendasCriadas.push(venda);
            }

            console.log(`✓ ${numVendas} vendas criadas para ${caixa.unidade.nome}`);
        }

        console.log(`\n✅ Total de ${vendasCriadas.length} vendas criadas com sucesso!`);

        // Estatísticas de vendas por loja
        console.log("\n📊 Vendas por loja:");
        for (const caixa of caixasAbertas) {
            const vendasDaLoja = vendasCriadas.filter(v => v.unidadeId === caixa.unidadeId);
            const totalVendido = vendasDaLoja.reduce((sum, v) => sum + Number(v.total), 0);
            const totalItens = vendasDaLoja.reduce((sum, v) => sum + v.itens.length, 0);

            console.log(`   - ${caixa.unidade.nome}:`);
            console.log(`      • ${vendasDaLoja.length} vendas`);
            console.log(`      • ${totalItens} itens vendidos`);
            console.log(`      • R$ ${totalVendido.toFixed(2)} em vendas`);
        }
        console.log("");

        // --- Seed financeiro: criar lançamentos de exemplo para matriz, fazendas e lojas ---
        // colocar abaixo de onde unidadeMap e usuarioMap já existem (após criar unidades/usuarios)
        async function seedFinanceiro(prisma, unidadeMap, usuarioMap) {
            // helpers de data
            const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
            const firstOfMonth = (y, m) => new Date(y, m - 1, 1); // ex: (2025,11) -> 2025-11-01

            const dados = [
                // MATRIZ (RuralTech) - despesas fixas + receita interna
                {
                    usuarioId: usuarioMap["Julia Alves"],
                    unidadeId: unidadeMap["RuralTech"],
                    descricao: "Folha de pagamento - Novembro/2025",
                    tipoMovimento: TM.SAIDA,
                    categoria: "Folha",
                    formaPagamento: TPAG.PIX,
                    valor: 12000,
                    valorPago: null,
                    competencia: firstOfMonth(2025, 11),
                    vencimento: new Date("2025-11-30"),
                    parcela: 1,
                    totalParcelas: 1,
                    status: SCONTA.PENDENTE,
                    documento: "FOLHA-202511"
                },
                {
                    usuarioId: usuarioMap["Julia Alves"],
                    unidadeId: unidadeMap["RuralTech"],
                    descricao: "Receita venda institucional (remessa interna)",
                    tipoMovimento: TM.ENTRADA,
                    categoria: "Receita",
                    formaPagamento: TPAG.PIX,
                    valor: 3500,
                    valorPago: 3500,
                    competencia: firstOfMonth(2025, 11),
                    vencimento: daysFromNow(-10),
                    dataPagamento: daysFromNow(-10),
                    status: SCONTA.PAGA,
                    documento: "REC-MATRIZ-202511"
                },

                // FAZENDAS (exemplos)
                {
                    usuarioId: usuarioMap["Usuario Ficticio"], // gerente fazenda teste
                    unidadeId: unidadeMap["Fazenda Teste"],
                    descricao: "Compra de medicamentos veterinários",
                    tipoMovimento: TM.SAIDA,
                    categoria: "Sanidade",
                    formaPagamento: TPAG.PIX,
                    valor: 1800,
                    vencimento: daysFromNow(7),
                    status: SCONTA.PENDENTE,
                    documento: "NFVET-FT-202511"
                },
                {
                    usuarioId: usuarioMap["Richard Souza"],
                    unidadeId: unidadeMap["Fazenda Beta"],
                    descricao: "Venda de leite cru - remessa para Sabor do Campo",
                    tipoMovimento: TM.ENTRADA,
                    categoria: "Venda",
                    formaPagamento: TPAG.PIX,
                    valor: 4200,
                    valorPago: 4200,
                    competencia: firstOfMonth(2025, 11),
                    vencimento: daysFromNow(-5),
                    dataPagamento: daysFromNow(-5),
                    status: SCONTA.PAGA,
                    documento: "NFV-FAZB-202511"
                },

                // LOJAS (exemplos)
                {
                    usuarioId: usuarioMap["Renato Martins"],
                    unidadeId: unidadeMap["Sabor do Campo Laticínios"],
                    descricao: "Pagamento a fornecedor (Fazenda Beta) - romaneio 202511",
                    tipoMovimento: TM.SAIDA,
                    categoria: "Compras",
                    formaPagamento: TPAG.PIX,
                    valor: 2600,
                    vencimento: daysFromNow(3),
                    status: SCONTA.PENDENTE,
                    documento: "PAG-FB-202511"
                },
                {
                    usuarioId: usuarioMap["Lorena Oshiro"],
                    unidadeId: unidadeMap["Loja Teste"],
                    descricao: "Recebimento venda - vendas em caixa (sintético)",
                    tipoMovimento: TM.ENTRADA,
                    categoria: "Vendas",
                    formaPagamento: TPAG.CARTAO,
                    valor: 1800,
                    valorPago: 1800,
                    competencia: firstOfMonth(2025, 11),
                    vencimento: daysFromNow(-2),
                    dataPagamento: daysFromNow(-2),
                    status: SCONTA.PAGA,
                    documento: "REC-LT-202511"
                },

                // exemplo de parcela
                {
                    usuarioId: usuarioMap["Juliana Correia"],
                    unidadeId: unidadeMap["Fazenda Alpha"],
                    descricao: "Parcelamento equipamento - parcela 2/12",
                    tipoMovimento: TM.SAIDA,
                    categoria: "Equipamentos",
                    formaPagamento: TPAG.PIX,
                    valor: 500,
                    parcela: 2,
                    totalParcelas: 12,
                    vencimento: daysFromNow(15),
                    status: SCONTA.PENDENTE,
                    documento: "EQP-ALPHA-202511"
                }
            ];

            // cria registros (skipDuplicates evita duplicações se rodar o seed várias vezes)
            await prisma.financeiro.createMany({
                data: dados.map(d => ({
                    ...d,
                    // garantir campos obrigatórios presenciais (nos casos omissos):
                    competencia: d.competencia || null,
                    dataPagamento: d.dataPagamento || null,
                    valorPago: d.valorPago || null
                })),
                skipDuplicates: true
            });

            console.log("Seed financeiro: criados/existentes lançamentos para unidades.");
        }

        // Chame dentro do main depois que unidadeMap e usuarioMap existirem:
        await seedFinanceiro(prisma, unidadeMap, usuarioMap);

        console.log(" SEED CONCLUÍDO COM SUCESSO! Todas as etapas foram executadas na ordem correta.");

    } catch (error) {
        console.error(" Erro durante seed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log("Desconectado do banco.");
    }
}

main();