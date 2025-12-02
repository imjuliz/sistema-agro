import {getAnimaisController, getAnimaisPelaRacaController, calcularRentabilidadeAnimalController, getAnimaisPorIdController, createAnimaisController,  updateAnimaisController, deleteAnimaisController } from "../controllers/AnimaisController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getAnimaisController);
router.get("/raca", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getAnimaisPelaRacaController); // http://localhost:8080/animais/raca?raca=Holand%C3%AAs
router.get("/rentabilidade/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), calcularRentabilidadeAnimalController);
router.get("/:id", auth(["GERENTE_FAZENDA"]), getAnimaisPorIdController);
router.post("/", auth(["GERENTE_FAZENDA"]), createAnimaisController);
router.put("/:id", auth(["GERENTE_FAZENDA"]), updateAnimaisController);
router.delete("/:id", auth(["GERENTE_FAZENDA"]), deleteAnimaisController);

export default router;
