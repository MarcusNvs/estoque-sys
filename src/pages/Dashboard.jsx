import { useState, useEffect } from "react";
import { api } from "../services/api";

const Dashboard = () => {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then(setDados)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p style={{ color: "#9b9989", fontSize: 14 }}>Carregando...</p>;
  if (erro) return <div className="alerta alerta-erro">{erro}</div>;

  const m = dados.metricas;
  const valorFormatado = m.valorTotalEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const metricas = [
    { label: "Produtos", valor: m.totalProdutos, delta: `${m.criticos} em nível crítico`, positivo: m.criticos === 0 },
    { label: "Estoque baixo", valor: m.estoqueBaixo, delta: m.estoqueBaixo > 0 ? "Atenção necessária" : "Tudo em ordem", positivo: m.estoqueBaixo === 0 },
    { label: "Baixas (mês)", valor: m.baixasMes, delta: "Movimentações registradas", positivo: true },
    { label: "Usuários", valor: m.totalUsuarios, delta: `${m.convitesPendentes} convite(s) pendente(s)`, positivo: true },
  ];

  return (
    <div>
      <h1 className="pagina-titulo">Dashboard</h1>
      <p className="pagina-subtitulo">Visão geral do sistema · valor em estoque R$ {valorFormatado}</p>

      <div className="metricas-grid">
        {metricas.map((item, i) => (
          <div key={i} className="card-metrica">
            <div className="card-metrica-label">{item.label}</div>
            <div className="card-metrica-valor">{item.valor}</div>
            <div className={`card-metrica-delta ${item.positivo ? "delta-positivo" : "delta-negativo"}`}>{item.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Alertas de estoque</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dados.alertas.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9b9989", fontStyle: "italic" }}>Nenhum produto abaixo do mínimo.</p>
            ) : dados.alertas.map((a, i) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < dados.alertas.length - 1 ? "1px solid #f0ede6" : "none" }}>
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
            {dados.ultimasMovimentacoes.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9b9989", fontStyle: "italic" }}>Nenhuma baixa registrada ainda.</p>
            ) : dados.ultimasMovimentacoes.map((mov, i) => (
              <div key={mov.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < dados.ultimasMovimentacoes.length - 1 ? "1px solid #f0ede6" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{mov.produto}</div>
                  <div style={{ fontSize: 11, color: "#9b9989" }}>{mov.data} · {mov.usuario}</div>
                </div>
                <span className="badge badge-azul">Baixa {mov.qtd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
