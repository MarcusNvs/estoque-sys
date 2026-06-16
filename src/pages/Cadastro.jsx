import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Cadastro = ({ setPaginaAtual }) => {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmar) { setErro("Preencha todos os campos."); return; }
    if (senha.length < 6) { setErro("A senha deve ter ao menos 6 caracteres."); return; }
    if (senha !== confirmar) { setErro("As senhas não coincidem."); return; }
    const resultado = await cadastrar(nome, email, senha);
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
        <h1 className="auth-titulo">Criar conta</h1>
        <p className="auth-subtitulo">Preencha seus dados para começar.</p>

        {erro && <div className="alerta alerta-erro">{erro}</div>}

        <div className="form-group">
          <label className="form-label">Nome completo</label>
          <input className="form-input" type="text" placeholder="Seu nome" value={nome} onChange={(e) => { setNome(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" placeholder="seu@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" placeholder="Mín. 6 caracteres" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar senha</label>
          <input className="form-input" type="password" placeholder="Repita a senha" value={confirmar} onChange={(e) => { setConfirmar(e.target.value); setErro(""); }} />
        </div>
        <button className="btn-primario verde" onClick={handleCadastro}>Criar conta</button>

        <p className="auth-link-texto">
          Já tem conta?{" "}
          <button className="auth-link" onClick={() => setPaginaAtual("login")}>Fazer login</button>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;