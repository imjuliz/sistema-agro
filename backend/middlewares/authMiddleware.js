// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config/jwt.js"; // Importar a chave secreta

// import prisma from "../prisma/client.js";
// import dotenv from "dotenv";
// dotenv.config();

// export const auth = (perfisPermitidos = []) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : null;
//     if (!token)
//       return res
//         .status(401)
//         .json({ mensagem: "Não autorizado: Token não fornecido" });

//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       const user = await prisma.usuario.findUnique({
//         where: { id: decoded.id },
//         include: { perfil: true },
//       });
//       if (!user)
//         return res.status(401).json({ mensagem: "Usuário não encontrado" });

//       if (decoded.tokenVersion !== user.tokenVersion) {
//         return res.status(401).json({ mensagem: "Token inválido (revogado)" });
//       }

//       if (
//         perfisPermitidos.length > 0 &&
//         !perfisPermitidos.includes(user.perfil.nome)
//       ) {
//         return res
//           .status(403)
//           .json({ mensagem: "Acesso negado para este perfil" });
//       }

//       req.usuario = { id: user.id, email: user.email, perfil: user.perfil };
//       next();
//     } catch (err) {
//       return res.status(403).json({ mensagem: "Token inválido" });
//     }
//   };
// };
// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

export const auth = (perfisPermitidos = []) => {
  return async (req, res, next) => {
    try {
      // 1) Tenta extrair token Bearer do header Authorization
      const authHeader = req.headers.authorization || "";
      const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

      // 2) Tenta extrair token do cookie (opcional) — se vocë usa cookie JWT
      const tokenFromCookie = req.cookies?.token ?? null;

      // 3) Decide token a usar (header tem prioridade)
      const token = tokenFromHeader || tokenFromCookie || null;

      let user = null;

      if (token) {
        // valida JWT
        let decoded;
        try {
          decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
          console.debug("[auth] token inválido:", err?.message ?? err);
          return res.status(403).json({ mensagem: "Token inválido" });
        }

        // busca usuário no DB com perfil
        user = await prisma.usuario.findUnique({
          where: { id: decoded.id },
          include: { perfil: true },
        });

        if (!user) {
          console.debug("[auth] usuário do token não encontrado:", decoded.id);
          return res.status(401).json({ mensagem: "Usuário não encontrado" });
        }

        // token version (revogação)
        if (decoded.tokenVersion !== user.tokenVersion) {
          console.debug("[auth] tokenVersion mismatch (revogado?)", { tokenVersionDecoded: decoded.tokenVersion, userTokenVersion: user.tokenVersion });
          return res.status(401).json({ mensagem: "Token inválido (revogado)" });
        }
      } else if (req.session?.user) {
        // fallback: autenticação por sessão (express-session)
        user = req.session.user;
        // se user da sessão não vier com perfil populado, tente buscar no DB
        if (user?.id && !user?.perfil) {
          const dbUser = await prisma.usuario.findUnique({
            where: { id: user.id },
            include: { perfil: true },
          });
          if (dbUser) user = dbUser;
        }
      } else {
        // sem token e sem sessão => não autorizado
        return res.status(401).json({ mensagem: "Não autorizado: Token não fornecido" });
      }

      // se por algum motivo user ainda não possui perfil, erro
      if (!user || !user.perfil) {
        console.debug("[auth] usuário sem perfil:", user);
        return res.status(401).json({ mensagem: "Usuário não encontrado" });
      }

      // normaliza valores para comparação case-insensitive
      const userPerfilNome = String(user.perfil.funcao ?? "").toLowerCase();
      const allowed = (perfisPermitidos || []).map(p => String(p).toLowerCase());

      console.debug("[auth] verificando perfil", { userId: user.id ?? userIdFromSession, userPerfilNome, allowed });

      if (allowed.length > 0 && !allowed.includes(userPerfilNome)) {
        // acesso negado por perfil
        return res.status(403).json({ mensagem: "Acesso negado para este perfil" });
      }

      // anexa um objeto uniforme req.usuario para handlers posteriores
      req.usuario = {
        id: user.id,
        email: user.email ?? user?.email,
        perfil: { nome: user.perfil.funcao, id: user.perfil.id ?? null },
        unidadeId: user.unidadeId ?? user.unidade?.id ?? null,
        raw: user // opcional, para debug
      };

      return next();
    } catch (err) {
      console.error("[auth] erro inesperado:", err);
      return res.status(500).json({ mensagem: "Erro interno de autenticação" });
    }
  };
};
