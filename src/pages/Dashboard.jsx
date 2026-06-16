const Dashboard = () => {
  const metricas = [
    { label: "Produtos", valor: "247", delta: "+12 este mês", positivo: true },
    { label: "Estoque baixo", valor: "8", delta: "Atenção necessária", positivo: false },
    { label: "Baixas (mês)", valor: "94", delta: "+7% vs anterior", positivo: true },
    { label: "Usuários", valor: "12", delta: "+2 convidados", positivo: true },
  ];
  const alertas = [
    { produto: "Cabo USB-C 2m", qtd: 2, tipo: "Crítico" },
    { produto: "Papel A4 resma", qtd: 5, tipo: "Baixo" },
    { produto: "Caneta azul cx", qtd: 3, tipo: "Crítico" },
    { produto: "Grampeador med.", qtd: 7, tipo: "Baixo" },
  ];
  const ultimasMovimentacoes = [
    { produto: "Monitor 24\" Full HD", tipo: "Entrada", qtd: 5, data: "20/05/2026", usuario: "Admin" },
    { produto: "Teclado mecânico", tipo: "Saída", qtd: 2, data: "19/05/2026", usuario: "João" },
    { produto: "Cadeira ergonômica", tipo: "Entrada", qtd: 10, data: "18/05/2026", usuario: "Admin" },
    { produto: "Cabo HDMI 2m", tipo: "Saída", qtd: 4, data: "17/05/2026", usuario: "João" },
  ];

  return (
    <div>
      <h1 className="pagina-titulo">Dashboard</h1>
      <p className="pagina-subtitulo">Visão geral do sistema — maio 2026</p>

      <div className="metricas-grid">
        {metricas.map((m, i) => (
          <div key={i} className="card-metrica">
            <div className="card-metrica-label">{m.label}</div>
            <div className="card-metrica-valor">{m.valor}</div>
            <div className={`card-metrica-delta ${m.positivo ? "delta-positivo" : "delta-negativo"}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Alertas de estoque</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertas.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < alertas.length - 1 ? "1px solid #f0ede6" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{a.produto}</div>
                  <div style={{ fontSize: 11, color: "#9b9989" }}>{a.qtd} unidades</div>
                </div>
                <span className={`badge ${a.tipo === "Crítico" ? "badge-vermelho" : "badge-amarelo"}`}>{a.tipo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Últimas movimentações</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ultimasMovimentacoes.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < ultimasMovimentacoes.length - 1 ? "1px solid #f0ede6" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{m.produto}</div>
                  <div style={{ fontSize: 11, color: "#9b9989" }}>{m.data} · {m.usuario}</div>
                </div>
                <span className={`badge ${m.tipo === "Entrada" ? "badge-verde" : "badge-azul"}`}>{m.tipo} {m.qtd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;