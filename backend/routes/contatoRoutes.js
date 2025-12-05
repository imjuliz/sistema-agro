import express from "express";
import { enviarContatoController } from "../controllers/ContatoController.js";

const router = express.Router();

// Rota pública para enviar contato (não precisa autenticação)
router.post("/", enviarContatoController);

export default router;
