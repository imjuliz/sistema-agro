import prisma from "../prisma/client";

export async function getPlantio() {
  try {
    const plantio = await prisma.plantio.findMany();
    return {
      sucesso: true,
      plantio,
      message: "Plantios listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar plantio.",
    };
  }
}

export async function getPlantioCategoria(categoria) {
  try {
    const plantioCategoria = await prisma.plantio.findMany({
      where: { categoria: categoria },
    });
    if(!catPlantio) {
      return res.status(400).json({erro: "Categoria de plantio nao encontrada."})
    }

    return {
      sucesso: true,
      plantioCategoria,
      message: "Categoria de plantio listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar categoria de plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createPlantio(data, unidadeId, loteId) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: unidadeId } });
    if(!unidade) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    const lote = await prisma.lote.findUnique({ where: { id: loteId } });
    if(!lote) {
      return res.status(400).json({erro: "Lote nao encontrado."})
    }

    const plantio = await prisma.plantio.create({
      data: {
        unidadeId: unidadeId,
        loteId: loteId,
        ...data
      },
    });

    return {
      sucesso: true,
      plantio,
      message: "Plantio criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function updatePlantio(id, data, unidadeId, loteId) {
  try {
    const plantio = await prisma.plantio.findUnique({ where: { id } });
    if(!plantio) {
      return res.status(400).json({erro: "Plantio nao encontrado."})
    }

    const unidade = await prisma.unidade.findUnique({ where: { id: unidadeId } });
    if(!unidade) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    const lote = await prisma.lote.findUnique({ where: { id: loteId } });
    if(!lote) {
      return res.status(400).json({erro: "Lote nao encontrado."})
    }

    const Plantio = await prisma.plantio.update({
      where: { id },
      data: {
        unidadeId: unidadeId,
        loteId: loteId,
        ...data
      },
    })

    return {
      sucesso: true,
      Plantio,
      message: "Plantio atualizado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao atualizar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deletePlantio(id) {
  try {
    const plantio = await prisma.plantio.findUnique({ where: { id } });
    if(!plantio) {
      return res.status(400).json({erro: "Plantio nao encontrado."})
    }

    const Plantio = await prisma.plantio.delete({ where: { id } });
    
    return {
      sucesso: true,
      Plantio,
      message: "Plantio deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao deletar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
