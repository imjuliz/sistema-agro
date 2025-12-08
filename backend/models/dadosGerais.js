import prisma from "../prisma/client.js";

export async function listarDadosGerais(unidadeId) {
  return prisma.dadoGeralUnidade.findMany({
    where: { unidadeId: Number(unidadeId) },
    orderBy: { criadoEm: "desc" },
  });
}

export async function criarDadoGeral(unidadeId, { dado, valor, descricao }) {
  if (!dado || !valor) {
    throw new Error("Campos 'dado' e 'valor' são obrigatórios");
  }
  return prisma.dadoGeralUnidade.create({
    data: {
      unidadeId: Number(unidadeId),
      dado: String(dado),
      valor: String(valor),
      descricao: descricao ? String(descricao) : null,
    },
  });
}

export async function atualizarDadoGeral(id, unidadeId, { dado, valor, descricao }) {
  const data = {};
  if (dado !== undefined) data.dado = String(dado);
  if (valor !== undefined) data.valor = String(valor);
  if (descricao !== undefined) data.descricao = descricao ? String(descricao) : null;

  if (!Object.keys(data).length) {
    throw new Error("Nenhum campo para atualizar");
  }

  return prisma.dadoGeralUnidade.update({
    where: { id: Number(id), unidadeId: Number(unidadeId) },
    data,
  });
}

export async function deletarDadoGeral(id, unidadeId) {
  await prisma.dadoGeralUnidade.delete({
    where: { id: Number(id), unidadeId: Number(unidadeId) },
  });
  return true;
}

