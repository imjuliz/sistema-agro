import express from "express";
import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController, contarFazendasController, getFazendasController, getLojaController, getMatrizController, getUsuariosPorUnidadeController, getUsuarioPorIdController, contarLojasController, buscarCepController, atualizarFotoUnidadeController, removerFotoUnidadeController, getCitySuggestionsController } from "../controllers/UnidadesController.js";
import { listarCaixasController } from "../controllers/FinanceiroController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ROTAS NÃO-DINÂMICAS PRIMEIRO (antes de /:id)
router.get("/", auth(["gerente_matriz"]), getUnidadesController);
router.post("/", auth(), createUnidadeController);

router.get('/fazendas', auth(["gerente_matriz"]), getFazendasController);
router.get('/cidades', auth(), getCitySuggestionsController);
router.get('/contar-fazendas', auth(["gerente_matriz"]), contarFazendasController);

router.get('/lojas', auth(), getLojaController);
router.get('/contar-lojas', auth(["gerente_matriz"]), contarLojasController);

router.get('/matrizes', auth(), getMatrizController);

router.get("/unidades-medida/opcoes", (req, res) => {
  const opcoes = [
    { valor: "QUILOGRAMA", label: "Quilograma (kg)" },
    { valor: "GRAMA", label: "Grama (g)" },
    { valor: "TONELADA", label: "Tonelada (t)" },
    { valor: "LITRO", label: "Litro (L)" },
    { valor: "MILILITRO", label: "Mililitro (ml)" },
    { valor: "METRO", label: "Metro (m)" },
    { valor: "METRO_QUADRADO", label: "Metro Quadrado (m²)" },
    { valor: "METRO_CUBICO", label: "Metro Cúbico (m³)" },
    { valor: "UNIDADE", label: "Unidade" },
    { valor: "DUZIA", label: "Dúzia" },
    { valor: "CAIXA", label: "Caixa" },
    { valor: "SACO", label: "Saco" },
    { valor: "LATA", label: "Lata" },
    { valor: "FRASCO", label: "Frasco" },
    { valor: "POTE", label: "Pote" }
  ];
  return res.json({ sucesso: true, opcoes });
});

router.get("/cep/:cep", buscarCepController);
router.get("/cep", buscarCepController);

router.get("/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);

// ROTAS DINÂMICAS COM SUBROTAS (:id/...)
// Foto DEVE vir antes de :id para não ser interceptada
router.post("/:id/foto", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), upload.single('foto'), atualizarFotoUnidadeController);
router.delete("/:id/foto", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), removerFotoUnidadeController);

router.get("/:unidadeId/caixas", auth(), listarCaixasController);
router.get("/:unidadeId/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);
router.get("/usuarios/:id", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuarioPorIdController);

// ROTAS DINÂMICAS :id (por último para não interceptar subrotas)
router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);

export default router;