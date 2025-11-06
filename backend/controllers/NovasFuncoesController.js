import { mostrarSaldoF, buscarProdutoMaisVendido, listarProdutos,contarVendasPorMesUltimos6Meses, criarVenda } from "../models/Loja";
import { calcularFornecedores } from "../models/fornecedores";
import { somarQtdTotalEstoque, calcularSaldoLiquido, getEstoque, listarUsuariosPorUnidade, listarSaidasPorUnidade } from "../models/funcoes_gerais";


export async function criarVendaController(req, res) {
  try {
    const { caixaId, usuarioId, unidadeId, pagamento, total, itens } = userShema.partial().parse(req.body);
    const id = req.usuario.id

    if (!nome || !email || !senha) { return res.status(400).json({ error: "Preencha todos os campos obrigatórios" }); }

    // Verifica se email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) { return res.status(400).json({ error: "Email já cadastrado" }); }

    const user = await cadastrarSe({ nome, email, senha });

    res.status(201).json({ message: "Usuário criado com sucesso", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}