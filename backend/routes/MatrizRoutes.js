import express from "express";
const router = express.Router();
// middlewares 
import { auth } from '../middlewares/authMiddleware.js'

import { getUnidadesController, getUnidadePorIdController, getFazendasController, getLojaController, contarFazendasController, createUnidadeController, updateUnidadeController, deleteUnidadeController, updateStatusUnidadeController, getMatrizController } from '../controllers/MatrizController.js'

router.get('/unidades', auth(), getUnidadesController);
router.get('/unidades/:id', auth(), getUnidadePorIdController);


router.get('/fazendas', auth(), getFazendasController);
router.get('/contar-fazendas', contarFazendasController);


router.get('/lojas', auth(), getLojaController);
router.get('/matrizes', auth(), getMatrizController)

export default router;