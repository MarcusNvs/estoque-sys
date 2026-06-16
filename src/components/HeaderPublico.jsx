import { useAuth } from "../contexts/AuthContext";

const HeaderPublico = ({ paginaAtual, setPaginaAtual }) => {
  const { usuarioLogado } = useAuth();
  const paginasNav = [
    { id: "home", label: "Home" },
    { id: "sobre", label: "Sobre" },
    { id: "contato", label: "Contato" },
  ];
  return (
    <header className="header-publico">
      <div className="header-logo">
        Estoque<span>.sys</span>
      </div>
      <nav className="header-nav">
        {paginasNav.map(p => (
          <button
            key={p.id}
            className={`nav-btn ${paginaAtual === p.id ? "ativo" : ""}`}
            onClick={() => setPaginaAtual(p.id)}
          >
            {p.label}
          </button>
        ))}
        {usuarioLogado ? (
          <button className="nav-btn-cta" onClick={() => setPaginaAtual("admin")}>
            Painel →
          </button>
        ) : (
          <button className="nav-btn-cta" onClick={() => setPaginaAtual("login")}>
            Entrar →
          </button>
        )}
      </nav>
    </header>
  );
};

export default HeaderPublico;