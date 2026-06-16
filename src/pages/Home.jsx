const Home = ({ setPaginaAtual }) => {
  const features = [
    { icone: "📦", titulo: "Controle de Estoque", desc: "Visualize, cadastre e gerencie todos os itens em tempo real." },
    { icone: "📊", titulo: "Métricas & Relatórios", desc: "Dashboards com indicadores de desempenho e saídas." },
    { icone: "👥", titulo: "Gestão de Usuários", desc: "Controle de acessos com convite por e-mail." },
    { icone: "🔒", titulo: "Área Protegida", desc: "Autenticação com rotas privadas e controle de sessão." },
  ];
  return (
    <>
      <div className="hero">
        <span className="hero-tag">Sistema de Gestão</span>
        <h1 className="hero-titulo">
          Controle seu<br />
          <span>estoque com</span><br />
          precisão.
        </h1>
        <p className="hero-subtitulo">
          Uma plataforma completa para gerenciar produtos, usuários e movimentações — tudo em um só lugar.
        </p>
        <div className="hero-botoes">
          <button className="btn-hero-primario" onClick={() => setPaginaAtual("cadastro")}>
            Criar conta grátis
          </button>
          <button className="btn-hero-secundario" onClick={() => setPaginaAtual("sobre")}>
            Saiba mais
          </button>
        </div>
      </div>
      <div className="main-conteudo">
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icone">{f.icone}</div>
              <div className="feature-titulo">{f.titulo}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;