import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {return res.status(401).json({ mensagem:'Não autorizado: Token não fornecido' });}

//   const [ , token] = authHeader.split(' ');

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.usuarioId = decoded.id;
//     next();
//   } catch (error) {return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' }); }
// };

// Middleware que verifica token e opcionalmente perfis permitidos
export const auth = (perfisPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensagem: "Não autorizado: Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Adiciona dados do usuário na requisição
      req.usuario = decoded;
      // Se foram especificados perfis permitidos, verifica se o usuário está autorizado
      if (perfisPermitidos.length > 0 && !perfisPermitidos.includes(decoded.perfil)) {
        return res.status(403).json({ mensagem: "Acesso negado para este perfil" });
      }

      next();
    } catch (error) {
      return res.status(403).json({ mensagem: "Não autorizado: Token inválido" });
    }
  };
};
