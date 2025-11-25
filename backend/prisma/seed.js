import bcrypt from "bcryptjs";
import 'dotenv/config'
import { configDotenv } from "dotenv";
configDotenv();
import prisma from "./client.js";
import * as pkg from "./generated/client.ts";

// Extrai enums
const { TipoPerfil, TipoUnidade, TipoLote, TipoRegistroSanitario, TipoPagamento, TipoSaida, AtividadesEnum, StatusContrato, FrequenciaEnum, UnidadesDeMedida, tipoTransporte, StatusUnidade, StatusFornecedor, StatusQualidade, TipoMovimento, TipoAtvd, TipoAnimais, StatusVenda, StatusAtvdAnimalia, TipoAnimalia, StatusPedido, StatusProducao, StatusPlantacao, CategoriaInsumo } = pkg;

// Fallbacks para enums
const TP = TipoPerfil ?? {
    GERENTE_MATRIZ: "GERENTE_MATRIZ",
    GERENTE_FAZENDA: "GERENTE_FAZENDA",
    GERENTE_LOJA: "GERENTE_LOJA",
    FUNCIONARIO_LOJA: "FUNCIONARIO_LOJA",
    FUNCIONARIO_FAZENDA: "FUNCIONARIO_FAZENDA"
};

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
const CtgInsumo = CategoriaInsumo ?? {
    SEMENTE: "SEMENTE",
    FERTILIZANTE: "FERTILIZANTE",
    DEFENSIVO: "DEFENSIVO",
    RACAO: "RACAO",
    MEDICAMENTO: "MEDICAMENTO",
    SUPLEMENTO: "SUPLEMENTO",
    VACINA: "VACINA",
    OUTROS: "OUTROS",
    LATICINIOS: "LATICINIOS"
};

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
            { nome: "Lorena Oshiroo", email: "renato.martins@gmail.com", senha: senhaHash, telefone: "11987652001", perfilId: perfilMap["GERENTE_LOJA"], unidadeId: unidadeMap["Sabor do Campo Laticínios"], status: true },
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
            data: { gerenteId: usuarioMap["Lorena Oshiroo"], matrizId: unidadeMap["RuralTech"] },
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


        // Assumo: existe `prisma` instanciado e constantes UMED (UnidadesDeMedida) já disponíveis.
        // adapte nomes/enum se necessário.

        function slugifyForSku(text) {
            return String(text || "ITEM")
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
                .slice(0, 30);
        }

        /**
         * Gera um array de objetos prontos para inserir em estoque_produto
         * a partir de um pedidoItem (1 registro por unidade recebida).
         */
        function gerarEntradasDeEstoqueParaPedidoItem({
            pedido,
            pedidoItem,
            estoqueId,
            prefixo = null,
            dataEntrada = null
        }) {
            const qty = Number(pedidoItem.quantidade ?? pedidoItem.quantidade) || 0;
            if (qty <= 0) return [];

            const baseNome =
                (pedidoItem.fornecedorItem && pedidoItem.fornecedorItem.nome) ||
                pedidoItem.nome ||
                "Item do pedido";

            const pesoUnidade =
                pedidoItem.fornecedorItem?.pesoUnidade ?? pedidoItem.pesoUnidade ?? null;

            const precoUnitario =
                pedidoItem.precoUnitario ??
                pedidoItem.fornecedorItem?.precoUnitario ??
                null;

            // unidadeBase (enum) — tente pegar do pedidoItem, se não existir use do fornecedorItem,
            // ou fallback para 'UNIDADE' (adeque conforme seu enum).
            const unidadeBase =
                pedidoItem.unidadeMedida ??
                pedidoItem.fornecedorItem?.unidadeMedida ??
                "UNIDADE";

            const fornecedorUnidadeId = pedido.origemUnidadeId ?? null;
            const fornecedorExternoId = pedido.origemFornecedorExternoId ?? null;

            const prefix = prefixo || slugifyForSku(baseNome);

            const entries = [];
            for (let i = 1; i <= qty; i++) {
                entries.push({
                    nome: baseNome,
                    sku: `${prefix}-${String(i).padStart(4, "0")}`,
                    marca: null,
                    estoqueId,
                    produtoId: null,
                    producaoId: null,
                    loteId: null,
                    precoUnitario: precoUnitario !== null ? String(precoUnitario) : null,
                    pesoUnidade: pesoUnidade !== undefined && pesoUnidade !== null ? String(pesoUnidade) : null,
                    validade: null,
                    unidadeBase,
                    pedidoId: pedido.id,
                    pedidoItemId: pedidoItem.id,
                    fornecedorUnidadeId,
                    fornecedorExternoId,
                    dataEntrada: dataEntrada ?? pedido.dataRecebimento ?? new Date(),
                    dataSaida: null
                });
            }
            return entries;
        }

        /**
         * Main: cria registros em estoque_produto a partir dos pedidos entregues (documentoReferences listados).
         */
        async function seedEstoqueProdutosFromDeliveredPedidos(prisma) {
            // lista dos documentos de pedido que você usou no seed (adapte se houver mais)
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

            // puxa pedidos e itens. Ajuste include se seus nomes de relação forem diferentes.
            const pedidos = await prisma.pedido.findMany({
                where: { documentoReferencia: { in: docRefs } },
                include: {
                    // ajuste para o nome exato da relação em seu schema: aqui uso 'itens' (visto em model Pedido: itens PedidoItem[])
                    itens: { include: { fornecedorItem: true } },
                    contrato: true,
                    fornecedorExterno: true,
                    origemUnidade: true,
                    destinoUnidade: true,
                    criadoPor: true
                }
            });

            if (!pedidos || pedidos.length === 0) {
                console.warn("Nenhum pedido encontrado para as referências informadas.");
                return;
            }

            const allEntries = [];

            for (const pedido of pedidos) {
                // determine destino: ache o Estoque da unidade destino
                const destinoUnidadeId = pedido.destinoUnidadeId ?? (pedido.destinoUnidade ? pedido.destinoUnidade.id : null);
                if (!destinoUnidadeId) {
                    console.warn("Pedido sem destinoUnidadeId:", pedido.documentoReferencia);
                    continue;
                }

                const estoque = await prisma.estoque.findFirst({ where: { unidadeId: destinoUnidadeId } });
                if (!estoque) {
                    console.warn("Estoque não encontrado para unidadeId:", destinoUnidadeId, " (pedido)", pedido.documentoReferencia);
                    continue;
                }

                // Relação/shape de pedidoItem pode variar (pedido.pedidoItem ou pedido.pedidoItems)
                const items = pedido.pedidoItem ?? pedido.pedidoItems ?? [];
                if (!items.length) {
                    console.warn("Pedido sem itens:", pedido.documentoReferencia);
                    continue;
                }

                for (const pi of items) {
                    // normalizar campo quantidade (string ou number)
                    const qtd = Number(pi.quantidade ?? pi.quantidadeSolicitada ?? 0);
                    if (isNaN(qtd) || qtd <= 0) {
                        console.warn("Quantidade inválida em pedidoItem:", pi.id, "do pedido", pedido.documentoReferencia);
                        continue;
                    }

                    // prefixo sku baseado no nome do item e id do pedido para evitar colisões
                    const prefix = slugifyForSku((pi.fornecedorItem && pi.fornecedorItem.nome) || pi.nome || `PED${pedido.id}-ITEM${pi.id}`);

                    const entradas = gerarEntradasDeEstoqueParaPedidoItem({
                        pedido,
                        pedidoItem: pi,
                        estoqueId: estoque.id,
                        prefixo: prefix,
                        dataEntrada: pedido.dataRecebimento ?? new Date()
                    });

                    // opcional: limite máximo por item pra evitar criar milhões acidentalmente
                    // se quiser habilitar, descomente a próxima linha e ajuste o limite.
                    // if (entradas.length > 5000) entradas.length = 5000;

                    allEntries.push(...entradas);
                }
            }

            if (!allEntries.length) {
                console.warn("Nenhuma entrada de estoque a criar a partir dos pedidos consultados.");
                return;
            }

            // Inserir em lotes para não exceder limites
            const BATCH = 1000;
            for (let i = 0; i < allEntries.length; i += BATCH) {
                const batch = allEntries.slice(i, i + BATCH);
                // Ajuste: createMany espera os nomes exatos das colunas — use exatamente os campos do seu model.
                await prisma.estoqueProduto.createMany({
                    data: batch,
                    skipDuplicates: true
                });
                console.log(`Inseridos ${batch.length} registros de estoque_produto (batch ${Math.floor(i / BATCH) + 1}).`);
            }

            console.log("Finalizado: total de entradas criadas:", allEntries.length);
        }

        // Exemplo de chamada:
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
                tipo: TAN.ORDENHA,
                custo: 3200.00,
                unidadeId: unidadeMap['Fazenda Teste'],
                loteId: null
            }
        ];

        await prisma.animal.createMany({ data: animals, skipDuplicates: true });


        // criar lote

        // atvd animalia + producao

        // pedidos loja

        // estoque loja

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

        // produtos a venda

        // venda

        // itens venda


        // // ===== 10. ESTOQUE E MOVIMENTAÇÃO (Entrada de insumos/animais) =====
        // console.log("10. Registrando entrada no estoque...");

        // for (const pedido of pedidosDb) {
        //     const pedidoItems = await prisma.pedidoItem.findMany({
        //         where: { pedidoId: pedido.id },
        //         include: { fornecedorItem: true }
        //     });

        //     for (const item of pedidoItems) {
        //         const fornecedorItem = item.fornecedorItem;

        //         // Verificar se é animal, insumo ou produto
        //         if (fornecedorItem.categoria?.includes("Animal")) {
        //             // ===== ANIMAIS =====
        //             console.log("10.1. Criando animais...");
        //             const quantidade = parseInt(fornecedorItem.quantidade);

        //             for (let i = 0; i < quantidade; i++) {
        //                 await prisma.animal.create({
        //                     data: {
        //                         animal: fornecedorItem.nome,
        //                         raca: fornecedorItem.raca || "Indefinida",
        //                         sku: `ANI-${fornecedorItem.id}-${i}-${Date.now()}`,
        //                         dataEntrada: pedido.dataRecebimento,
        //                         fornecedorId: pedido.origemFornecedorExternoId,
        //                         quantidade: 1,
        //                         tipo: TAN.ABATE,
        //                         custo: parseFloat(fornecedorItem.precoUnitario),
        //                         unidadeId: pedido.destinoUnidadeId
        //                     }
        //                 });
        //             }

        //         } else if (fornecedorItem.categoria?.some(cat =>
        //             ["Ração", "Suplemento", "Coagulação", "Fermento"].includes(cat))) {
        //             // ===== INSUMOS NO ESTOQUE =====
        //             const insumo = insumosDb.find(i => i.nome === fornecedorItem.nome);
        //             if (insumo) {
        //                 let estoque = await prisma.estoque.findFirst({
        //                     where: {
        //                         unidadeId: pedido.destinoUnidadeId,
        //                         insumoId: insumo.id
        //                     }
        //                 });

        //                 if (!estoque) {
        //                     estoque = await prisma.estoque.create({
        //                         data: {
        //                             unidadeId: pedido.destinoUnidadeId,
        //                             insumoId: insumo.id,
        //                             quantidade: parseInt(fornecedorItem.quantidade),
        //                             estoqueMinimo: 10
        //                         }
        //                     });
        //                 } else {
        //                     await prisma.estoque.update({
        //                         where: { id: estoque.id },
        //                         data: {
        //                             quantidade: {
        //                                 increment: parseInt(fornecedorItem.quantidade)
        //                             }
        //                         }
        //                     });
        //                 }

        //                 // Registrar movimento de entrada
        //                 await prisma.estoqueMovimento.create({
        //                     data: {
        //                         estoqueId: estoque.id,
        //                         tipoMovimento: TM.ENTRADA,
        //                         quantidade: parseInt(fornecedorItem.quantidade),
        //                         pedidoId: pedido.id,
        //                         origemUnidadeId: pedido.origemUnidadeId,
        //                         destinoUnidadeId: pedido.destinoUnidadeId,
        //                         data: pedido.dataRecebimento
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // }

        // // ===== 11. LOTES =====
        // console.log("11. Criando lotes...");

        // // Buscar animais criados
        // const animaisDb = await prisma.animal.findMany();

        // // Agrupar animais por unidade e tipo para criar lotes
        // const animaisPorUnidade = {};
        // animaisDb.forEach(animal => {
        //     const key = `${animal.unidadeId}-${animal.raca}`;
        //     if (!animaisPorUnidade[key]) {
        //         animaisPorUnidade[key] = [];
        //     }
        //     animaisPorUnidade[key].push(animal);
        // });

        // const lotesData = [];
        // const loteMap = {};

        // for (const [key, animais] of Object.entries(animaisPorUnidade)) {
        //     const [unidadeId, raca] = key.split('-');
        //     const responsavel = await prisma.usuario.findFirst({
        //         where: { unidadeId: parseInt(unidadeId) }
        //     });

        //     const lote = await prisma.lote.create({
        //         data: {
        //             nome: `Lote ${raca} - ${new Date().toISOString().split('T')[0]}`,
        //             unidadeId: parseInt(unidadeId),
        //             responsavelId: responsavel.id,
        //             tipo: TL.GADO,
        //             qntdItens: animais.length,
        //             preco: 0,
        //             unidadeMedida: UMED.CABECA,
        //             dataCriacao: new Date(),
        //             statusQualidade: SQ.PROPRIO
        //         }
        //     });

        //     loteMap[key] = lote.id;
        //     lotesData.push(lote);

        //     // Associar animais ao lote
        //     for (const animal of animais) {
        //         await prisma.animal.update({
        //             where: { id: animal.id },
        //             data: { loteId: lote.id }
        //         });
        //     }
        // }

        // // ===== 12. ATIVIDADES ANIMALIA =====
        // console.log("12. Criando atividades animalia...");

        // for (const lote of lotesData) {
        //     const animaisDoLote = await prisma.animal.findMany({
        //         where: { loteId: lote.id }
        //     });

        //     // Buscar insumos disponíveis na unidade
        //     const estoqueUnidade = await prisma.estoque.findMany({
        //         where: { unidadeId: lote.unidadeId },
        //         include: { insumo: true }
        //     });

        //     for (const animal of animaisDoLote) {
        //         // Para cada animal no lote, criar a mesma atividade
        //         if (estoqueUnidade.length > 0) {
        //             const insumoAleatorio = estoqueUnidade[Math.floor(Math.random() * estoqueUnidade.length)];

        //             await prisma.atvdAnimalia.create({
        //                 data: {
        //                     animalId: animal.id,
        //                     insumoId: insumoAleatorio.insumoId,
        //                     descricao: `Atividade de manejo para ${animal.animal} ${animal.raca}`,
        //                     tipo: TANIMALIA.VACINACAO,
        //                     loteId: lote.id,
        //                     dataInicio: new Date(),
        //                     responsavelId: lote.responsavelId,
        //                     status: SATVDA.CONCLUIDA
        //                 }
        //             });

        //             // Registrar saída do insumo usado
        //             if (insumoAleatorio) {
        //                 await prisma.estoque.update({
        //                     where: { id: insumoAleatorio.id },
        //                     data: { quantidade: { decrement: 1 } }
        //                 });

        //                 await prisma.estoqueMovimento.create({
        //                     data: {
        //                         estoqueId: insumoAleatorio.id,
        //                         tipoMovimento: TM.SAIDA,
        //                         quantidade: 1,
        //                         origemUnidadeId: lote.unidadeId,
        //                         data: new Date()
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // }

        // // ===== 13. PRODUÇÃO =====
        // console.log("13. Criando produções...");

        // // Buscar contratos onde a unidade é fornecedora (fazenda fornecendo para lojas)
        // const contratosFornecedores = await prisma.contrato.findMany({
        //     where: { fornecedorUnidadeId: { not: null } },
        //     include: { fornecedorInterno: true, itens: true }
        // });

        // for (const contrato of contratosFornecedores) {
        //     const fazenda = contrato.fornecedorInterno;
        //     const lotesFazenda = await prisma.lote.findMany({
        //         where: { unidadeId: fazenda.id }
        //     });

        //     for (const itemContrato of contrato.itens) {
        //         // Criar produção baseada nos itens do contrato
        //         if (lotesFazenda.length > 0) {
        //             const lote = lotesFazenda[0]; // Usar primeiro lote disponível

        //             const producao = await prisma.producao.create({
        //                 data: {
        //                     loteId: lote.id,
        //                     tipoProduto: itemContrato.nome,
        //                     quantidadeBruta: parseFloat(itemContrato.quantidade),
        //                     quantidadeLiquida: parseFloat(itemContrato.quantidade) * 0.95, // 5% de perda
        //                     unidadeMedida: itemContrato.unidadeMedida,
        //                     dataInicio: new Date(),
        //                     dataFim: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 dia
        //                     status: SPROD.FINALIZADA,
        //                     responsavelId: lote.responsavelId,
        //                     destinoUnidadeId: contrato.unidadeId, // Loja destino
        //                     observacoes: `Produção baseada no contrato ${contrato.id}`
        //                 }
        //             });

        //             // Registrar no estoque da fazenda
        //             let estoqueProducao = await prisma.estoque.findFirst({
        //                 where: {
        //                     unidadeId: fazenda.id,
        //                     loteId: lote.id
        //                 }
        //             });

        //             if (!estoqueProducao) {
        //                 estoqueProducao = await prisma.estoque.create({
        //                     data: {
        //                         unidadeId: fazenda.id,
        //                         loteId: lote.id,
        //                         quantidade: parseInt(producao.quantidadeLiquida),
        //                         estoqueMinimo: 0
        //                     }
        //                 });
        //             }

        //             // Movimento de entrada da produção
        //             await prisma.estoqueMovimento.create({
        //                 data: {
        //                     estoqueId: estoqueProducao.id,
        //                     tipoMovimento: TM.ENTRADA,
        //                     quantidade: parseInt(producao.quantidadeLiquida),
        //                     producaoId: producao.id,
        //                     origemUnidadeId: fazenda.id,
        //                     data: new Date()
        //                 }
        //             });
        //         }
        //     }
        // }

        // // ===== 14. PEDIDOS DAS PRODUÇÕES =====
        // console.log("14. Criando pedidos das produções...");

        // for (const contrato of contratosFornecedores) {
        //     const proximaDataEnvio = calcularProximaData(contrato.dataEnvio, contrato.frequenciaEntregas);
        //     const proximaDataRecebimento = new Date(proximaDataEnvio);
        //     proximaDataRecebimento.setDate(proximaDataRecebimento.getDate() + 1);

        //     // Criar pedido
        //     const pedidoProducao = await prisma.pedido.create({
        //         data: {
        //             contratoId: contrato.id,
        //             origemUnidadeId: contrato.fornecedorUnidadeId,
        //             destinoUnidadeId: contrato.unidadeId,
        //             criadoPorId: usuarioMap["Julia Alves"],
        //             dataPedido: new Date(),
        //             dataEnvio: proximaDataEnvio,
        //             dataRecebimento: proximaDataRecebimento,
        //             status: SPEDIDO.ENTREGUE,
        //             documentoReferencia: `PED-PROD-${contrato.id}-${Date.now()}`,
        //             tipoTransporte: TTRANS.RODOVIARIO
        //         }
        //     });

        //     let valorTotalProducao = 0;

        //     // Criar itens do pedido baseados na produção
        //     for (const itemContrato of contrato.itens) {
        //         const quantidade = parseFloat(itemContrato.quantidade);
        //         const precoUnitario = parseFloat(itemContrato.precoUnitario);
        //         const custoTotal = quantidade * precoUnitario;
        //         valorTotalProducao += custoTotal;

        //         await prisma.pedidoItem.create({
        //             data: {
        //                 pedidoId: pedidoProducao.id,
        //                 fornecedorItemId: itemContrato.id,
        //                 quantidade: quantidade.toString(),
        //                 unidadeMedida: itemContrato.unidadeMedida,
        //                 precoUnitario: precoUnitario.toString(),
        //                 custoTotal: custoTotal.toString()
        //             }
        //         });
        //     }

        //     // Atualizar valor total
        //     await prisma.pedido.update({
        //         where: { id: pedidoProducao.id },
        //         data: { valorTotal: valorTotalProducao.toString() }
        //     });

        //     // ===== 15. ESTOQUE DAS LOJAS =====
        //     console.log("15. Registrando estoque nas lojas...");

        //     for (const itemContrato of contrato.itens) {
        //         // Buscar ou criar estoque na loja
        //         let estoqueLoja = await prisma.estoque.findFirst({
        //             where: {
        //                 unidadeId: contrato.unidadeId, // ID da loja
        //                 loteId: null // Produto final, não insumo
        //             }
        //         });

        //         if (!estoqueLoja) {
        //             estoqueLoja = await prisma.estoque.create({
        //                 data: {
        //                     unidadeId: contrato.unidadeId,
        //                     loteId: null,
        //                     quantidade: parseInt(itemContrato.quantidade),
        //                     estoqueMinimo: 10
        //                 }
        //             });
        //         }

        //         // Movimento de entrada na loja
        //         await prisma.estoqueMovimento.create({
        //             data: {
        //                 estoqueId: estoqueLoja.id,
        //                 tipoMovimento: TM.ENTRADA,
        //                 quantidade: parseInt(itemContrato.quantidade),
        //                 pedidoId: pedidoProducao.id,
        //                 origemUnidadeId: contrato.fornecedorUnidadeId,
        //                 destinoUnidadeId: contrato.unidadeId,
        //                 data: proximaDataRecebimento
        //             }
        //         });

        //         // ===== 16. RETIRAR METADE DO ESTOQUE E CRIAR PRODUTOS =====
        //         console.log("16. Retirando metade do estoque e criando produtos...");

        //         const quantidadeRetirada = Math.floor(parseInt(itemContrato.quantidade) / 2);

        //         if (quantidadeRetirada > 0) {
        //             // Atualizar estoque da loja
        //             await prisma.estoque.update({
        //                 where: { id: estoqueLoja.id },
        //                 data: { quantidade: { decrement: quantidadeRetirada } }
        //             });

        //             // Movimento de saída (venda/consumo)
        //             await prisma.estoqueMovimento.create({
        //                 data: {
        //                     estoqueId: estoqueLoja.id,
        //                     tipoMovimento: TM.SAIDA,
        //                     quantidade: quantidadeRetirada,
        //                     origemUnidadeId: contrato.unidadeId,
        //                     data: new Date()
        //                 }
        //             });

        //             // Criar produtos para venda (metade da quantidade)
        //             for (let i = 0; i < quantidadeRetirada; i++) {
        //                 await prisma.produto.create({
        //                     data: {
        //                         unidadeId: contrato.unidadeId,
        //                         origemUnidadeId: contrato.fornecedorUnidadeId,
        //                         nome: itemContrato.nome,
        //                         sku: `VENDA-${itemContrato.id}-${i}-${Date.now()}`,
        //                         categoria: itemContrato.categoria?.[0] || "Geral",
        //                         descricao: `Produto para venda - ${itemContrato.nome}`,
        //                         preco: parseFloat(itemContrato.precoUnitario) * 1.2, // 20% markup
        //                         dataFabricacao: new Date(),
        //                         dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //                         unidadeMedida: itemContrato.unidadeMedida,
        //                         isForSale: true
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // }

        // // ===== 17. CAIXAS =====
        // console.log("17. Criando caixas...");

        // const lojas = unidades.filter(u => u.tipo === TU.LOJA);

        // for (const loja of lojas) {
        //     const gerenteLoja = await prisma.usuario.findFirst({
        //         where: {
        //             unidadeId: loja.id,
        //             perfilId: perfilMap["GERENTE_LOJA"]
        //         }
        //     });

        //     if (gerenteLoja) {
        //         await prisma.caixa.create({
        //             data: {
        //                 unidadeId: loja.id,
        //                 usuarioId: gerenteLoja.id,
        //                 status: true, // Aberto
        //                 saldoInicial: 1000.00, // Saldo inicial padrão
        //                 abertoEm: new Date()
        //             }
        //         });
        //     }
        // }

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