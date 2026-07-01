export function montarResposta({ dados, total, page, limit }) {
  const totalPaginas = Math.max(1, Math.ceil(total / limit));
  return {
    dados,
    paginacao: {
      total,
      page,
      limit,
      totalPaginas,
      temProxima: page < totalPaginas,
      temAnterior: page > 1,
    },
  };
}
