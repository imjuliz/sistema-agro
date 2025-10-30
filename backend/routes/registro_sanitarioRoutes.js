import { getRegistroSanitarioController, getRegistroSanitarioPorIdController, createRegistroSanitarioController, deleteRegistroSanitarioController } from "../controllers/RegistroSanitarioController.js";
import express from "express";

const router = express.Router();

router.get("/", getRegistroSanitarioController);
router.get("/:id", getRegistroSanitarioPorIdController);
router.post("/", createRegistroSanitarioController);
router.delete("/:id", deleteRegistroSanitarioController);

export default router;