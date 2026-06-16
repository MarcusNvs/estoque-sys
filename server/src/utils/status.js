// Calcula o status do produto a partir da quantidade em estoque
export function calcularStatus(qtd) {
  if (qtd <= 0) return "Crítico";
  if (qtd <= 5) return "Baixo";
  return "Normal";
}

// Adiciona o campo virtual "status" a um produto vindo do banco
export function comStatus(produto) {
  return { ...produto, status: calcularStatus(produto.qtd) };
}
