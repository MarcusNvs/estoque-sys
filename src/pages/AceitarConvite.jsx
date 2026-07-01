import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const AceitarConvite = ({ token, setPaginaAtual }) => {
  const { aceitarConvite } = useAuth();
  const [convite, setConvite] = useState(null);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get(`/convites/token/${token}`, { auth: false })
      .then(setConvite)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [token]);

  const handleAceitar = async () => {
    if (!nome || !senha) { setErro("Preencha nome e senha."); return; }
    if (senha.length < 6) { setErro("A senha deve ter ao menos 6 caracteres."); return; }
    const resultado = await aceitarConvite(token, nome, senha);
    if (resultado.sucesso) {
      setPaginaAtual("admin");
    } else {
      setErro(resultado.mensagem);
    }
  };

  const indisponivel = convite && convite.status !== "Pendente";

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#c8e06b", background: "#1a1a18", display: "inline-block", padding: "6px 12px", borderRadius: 6, marginBottom: 20 }}>
          Estoque.sys
        </div>
        <h1 className="auth-titulo">Aceitar convite</h1>

        {carregando ? (
          <p style={{ color: "#9b9989", fontSize: 14 }}>Carregando convite...</p>
        ) : erro && !convite ? (
          <>
            <div className="alerta alerta-erro">{erro}</div>
            <button className="btn-primario" onClick={() => setPaginaAtual("home")}>Voltar ao site</button>
          </>
        ) : indisponivel ? (
          <>
            <p className="auth-subtitulo">Este convite está com status <strong>{convite.status}</strong> e não pode mais ser utilizado.</p>
            <button className="btn-primario" onClick={() => setPaginaAtual("login")}>Ir para o login</button>
          </>
        ) : (
          <>
            <p className="auth-subtitulo">
              Você foi convidado(a) para acessar como <strong>{convite.papel}</strong>.
            </p>
            <div className="auth-dica">{convite.email}</div>

            {erro && <div className="alerta alerta-erro">{erro}</div>}

            <div className="form-group">
              <label className="form-label">Seu nome</label>
              <input className="form-input" type="text" placeholder="Nome completo" value={nome} onChange={(e) => { setNome(e.target.value); setErro(""); }} />
            </div>
            <div className="form-group">
              <label className="form-label">Crie uma senha</label>
              <input className="form-input" type="password" placeholder="••••••••" value={senha} onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleAceitar()} />
            </div>
            <button className="btn-primario" onClick={handleAceitar}>Aceitar e entrar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AceitarConvite;
