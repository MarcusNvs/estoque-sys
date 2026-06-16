const Sobre = ({ setPaginaAtual }) => {
  const stats = [
    { label: "Produtos rastreados", valor: "10.000+" },
    { label: "Usuários ativos", valor: "320+" },
    { label: "Movimentações/mês", valor: "50k+" },
    { label: "Uptime garantido", valor: "99,9%" },
  ];
  return (
    <div className="main-conteudo">
      <div className="sobre-hero">
        <h1 className="sobre-titulo">Sobre o Sistema</h1>
        <p className="sobre-desc">
          O Estoque.sys é uma plataforma desenvolvida como projeto acadêmico, aplicando
          componentização, hooks, gerenciamento de estado e navegação entre telas.
          Projetado para ser integrado a um back-end em etapas futuras.
        </p>
      </div>
      <div className="sobre-grid">
        {stats.map((s, i) => (
          <div key={i} className="card-metrica">
            <div className="card-metrica-label">{s.label}</div>
            <div className="card-metrica-valor">{s.valor}</div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div style={{ background: "#fff", border: "1px solid #e2e0d8", borderRadius: 12, padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#7c7b6e", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Stack técnica</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["React", "TypeScript", "Tailwind CSS", "Hooks", "Context API", "Vite"].map(t => (
            <span key={t} className="badge badge-cinza" style={{ padding: "5px 12px", fontSize: 12 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button className="btn-hero-primario" onClick={() => setPaginaAtual("contato")}>Entre em contato →</button>
      </div>
    </div>
  );
};

export default Sobre;