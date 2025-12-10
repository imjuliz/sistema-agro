import express from "express";
import { dashboardResumoController } from "../controllers/LojaDashboardController.js";

const router = express.Router();

router.get("/resumo/:unidadeId", dashboardResumoController);

export default router;



