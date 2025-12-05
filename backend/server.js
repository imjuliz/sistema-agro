import app from "./app.js";

const PORT = Number(process.env.PORT || 8080);

const server = app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});

server.on('error', (err) => {
	console.error('Falha ao iniciar o servidor:', err && err.code ? `${err.code} - ${err.message}` : err);
	// Se for EACCES (permissão) ou EADDRINUSE (porta em uso), sair com erro
	process.exit(1);
});