import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  getResumoVendasController,
  getTopFazendasProducaoController,
  exportDashboardPdfController,
  getDashboardKpisController,
  getResumoFinanceiroMatrizController,
} from "../controllers/MatrizController.js";

const router = express.Router();

router.get("/dashboard/vendas", auth(), getResumoVendasController);
router.get("/dashboard/producao", auth(), getTopFazendasProducaoController);
router.get("/dashboard/pdf", auth(), exportDashboardPdfController);
router.get("/dashboard/kpis", auth(), getDashboardKpisController);
router.get("/dashboard/financeiro", auth(), getResumoFinanceiroMatrizController);

export default router;




