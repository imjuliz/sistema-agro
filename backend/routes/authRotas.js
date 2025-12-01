import express from "express";
import { cadastrarSeController, loginController, refreshController, logoutController, esqSenhaController, codigoController, updateSenhaController, meController, updateUsuarioController } from "../controllers/UserController.js";
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/cadastrar", cadastrarSeController);

router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

router.get('/me', auth(), meController); // retorna dados públicos do usuário autenticado
router.put('/me', auth(), updateUsuarioController); // Novo: atualiza dados do usuário autenticado

router.post("/esqSenha", esqSenhaController);

router.post("/codigo", codigoController);

router.put("/updateSenha/:codigo", updateSenhaController);

router.get("/teste", (req, res) => {res.json({ message: "Rota /auth/teste funcionando!" });});

export default router;
