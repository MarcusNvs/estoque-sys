export function calcularStatus(qtd, estoqueMinimo = 5) {
  if (qtd <= 0) return "Crítico";
  if (qtd <= estoqueMinimo) return "Baixo";
  return "Normal";
}

export function comStatus(produto) {
  return {
    ...produto,
    status: calcularStatus(produto.qtd, produto.estoqueMinimo),
    abaixoDoMinimo: produto.qtd <= produto.estoqueMinimo,
  };
}
