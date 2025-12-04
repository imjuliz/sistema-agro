import express from 'express';
import {
  criarPlanoProducaoController,
  criarPlanoProducaoParaLoteController,
  obterPlanoProducaoController,
  listarPlanosPorContratoController,
  listarPlanosPorLoteController,
  listarPlanosPorItemController,
  atualizarPlanoProducaoController,
  atualizarEtapasPlanoController,
  confirmarPlanoProducaoController,
  deletarPlanoProducaoController,
  listarPlanosController,
} from '../controllers/PlanoProducaoController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(auth());

/**
 * POST /plano-producao
 * Criar um novo plano de produção
 */
router.post('/', criarPlanoProducaoController);

/**
 * POST /plano-producao/lote
 * Criar vários planos para um lote (batch)
 */
router.post('/lote', criarPlanoProducaoParaLoteController);

/**
 * GET /plano-producao
 * Listar planos com filtros opcionais
 * Query params: contratoId, loteId, itemId, usuarioId, status
 */
router.get('/', listarPlanosController);

/**
 * GET /plano-producao/:id
 * Obter plano específico
 */
router.get('/:id', obterPlanoProducaoController);

/**
 * GET /plano-producao/contrato/:contratoId
 * Listar planos por contrato
 */
router.get('/contrato/:contratoId', listarPlanosPorContratoController);

/**
 * GET /plano-producao/lote/:loteId
 * Listar planos por lote
 */
router.get('/lote/:loteId', listarPlanosPorLoteController);

/**
 * GET /plano-producao/item/:itemId
 * Listar planos por item
 */
router.get('/item/:itemId', listarPlanosPorItemController);

/**
 * PUT /plano-producao/:id
 * Atualizar plano
 */
router.put('/:id', atualizarPlanoProducaoController);

/**
 * PUT /plano-producao/:id/etapas
 * Atualizar etapas de um plano
 */
router.put('/:id/etapas', atualizarEtapasPlanoController);

/**
 * POST /plano-producao/:id/confirmar
 * Confirmar plano (mudar status de RASCUNHO para CONFIRMADO)
 */
router.post('/:id/confirmar', confirmarPlanoProducaoController);

/**
 * DELETE /plano-producao/:id
 * Deletar plano
 */
router.delete('/:id', deletarPlanoProducaoController);

export default router;
