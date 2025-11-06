import prisma from '../../prisma/client.js';

//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) =>{
    try{
        const saidas = await prisma.Saidas.findMany({
            where: {unidadeId: Number(unidadeId)},
        })
        return ({
            sucesso: true,
            saidas,
            message: "Saidas listadas com sucesso!!"
        })
    }

    catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar saidas",
            detalhes: error.message
        }
    }
}

// Função que soma as vendas do dia atual
export const somarDiaria = async (unidadeId) => {
  const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "Vendas"
    WHERE DATE("criado_em") = CURRENT_DATE
      AND "unidadeId" = ${unidadeId}
  `;

  // Prisma retorna um array de objetos, então pegamos o primeiro
  return result[0]?.total ?? 0;
};

export const somarSaidas = async (unidadeId) =>{
    const result = await prisma.$queryRaw`
    SELECT COALESCE (SUM(valor), 0) AS total
    from "Saídas"
    where date("data") = CURRENT_DATE
    and "unidadeId" = ${unidadeId}`;

return result[0]?.total ?? 0;

}

export const calcularLucro = async (unidadeId) =>{

  const result = await prisma.$queryRaw`

    SELECT
      COALESCE((SELECT SUM(valor)
        FROM "Vendas"
        WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND "unidadeId" = ${unidadeId}), 0) AS total_vendas,
      
      COALESCE((SELECT SUM(valor)
        FROM "Saidas"
        WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND "unidadeId" = ${unidadeId}), 0) AS total_saidas,
      
      (
        COALESCE((SELECT SUM(valor)
          FROM "Vendas"
          WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            AND "unidadeId" = ${unidadeId}), 0)
        -
        COALESCE((SELECT SUM(valor)
          FROM "Saidas"
          WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            AND "unidadeId" = ${unidadeId}), 0)
      ) AS lucro;
  `;

  return result[0];
}


