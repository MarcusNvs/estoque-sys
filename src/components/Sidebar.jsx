import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ abaAtual, setAbaAtual, setPaginaAtual }) => {
  const { usuarioLogado, logout } = useAuth();

  const itensGeral = [
    { id: "dashboard", label: "Dashboard", icone: "⊞" },
  ];
  const itensUsuarios = [
    { id: "gerenc-usuarios", label: "Gerenc. Usuários", icone: "◎" },
    { id: "invite-user", label: "Invite User", icone: "+" },
  ];
  const itensEstoque = [
    { id: "estoque", label: "Estoque", icone: "▣" },
  ];

  const renderItem = (item) => (
    <button
      key={item.id}
      className={`sidebar-item ${abaAtual === item.id ? "ativo" : ""}`}
      onClick={() => setAbaAtual(item.id)}
    >
      <span className="sidebar-item-icone">{item.icone}</span>
      {item.label}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-texto">Estoque<span>.sys</span></div>
      </div>
      <div className="sidebar-usuario">
        <div className="sidebar-usuario-nome">{usuarioLogado?.nome}</div>
        <div className="sidebar-usuario-papel">{usuarioLogado?.papel}</div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-secao-titulo">Geral</div>
        {itensGeral.map(renderItem)}
        
        {usuarioLogado?.papel === "admin" && (
          <>
            <div className="sidebar-secao-titulo" style={{ marginTop: 12 }}>Usuários</div>
            {itensUsuarios.map(renderItem)}
          </>
        )}

        <div className="sidebar-secao-titulo" style={{ marginTop: 12 }}>Estoque</div>
        {itensEstoque.map(renderItem)}
        <div className="sidebar-secao-titulo" style={{ marginTop: 12 }}>Site</div>
        <button className="sidebar-item" onClick={() => setPaginaAtual("home")}>
          <span className="sidebar-item-icone">←</span> Voltar ao site
        </button>
      </nav>
      <div className="sidebar-rodape">
        <button className="btn-logout" onClick={() => { logout(); setPaginaAtual("home"); }}>
          Sair da conta
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;