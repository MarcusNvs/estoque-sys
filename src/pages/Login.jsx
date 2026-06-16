import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ setPaginaAtual }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) { setErro("Preencha todos os campos."); return; }
    const resultado = await login(email, senha);
    if (resultado.sucesso) {
      setPaginaAtual("admin");
    } else {
      setErro(resultado.mensagem);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#c8e06b", background: "#1a1a18", display: "inline-block", padding: "6px 12px", borderRadius: 6, marginBottom: 20 }}>
          Estoque.sys
        </div>
        <h1 className="auth-titulo">Entrar na conta</h1>
        <p className="auth-subtitulo">Acesse o painel de gestão de estoque.</p>

        <div className="auth-dica">
          admin@estoque.com / admin123<br />
          joao@estoque.com / joao123
        </div>

        {erro && <div className="alerta alerta-erro">{erro}</div>}

        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" placeholder="seu@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" placeholder="••••••••" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        <button className="btn-primario" onClick={handleLogin}>Entrar</button>

        <p className="auth-link-texto">
          Não tem conta?{" "}
          <button className="auth-link" onClick={() => setPaginaAtual("cadastro")}>Cadastre-se</button>
        </p>
        <p className="auth-link-texto" style={{ marginTop: 8 }}>
          <button className="auth-link" onClick={() => setPaginaAtual("home")}>← Voltar ao site</button>
        </p>
      </div>
    </div>
  );
};

export default Login;