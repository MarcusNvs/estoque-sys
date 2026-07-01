import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const InviteUser = () => {
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState("operador");
  const [erro, setErro] = useState("");
  const [ultimoLink, setUltimoLink] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [convites, setConvites] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      const lista = await api.get("/convites");
      setConvites(lista);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { recarregar(); }, [recarregar]);

  const handleConvidar = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setErro("Informe um e-mail."); return; }
    if (!regex.test(email)) { setErro("E-mail inválido."); return; }

    try {
      const convite = await api.post("/convites", { email, papel });
      setEmail("");
      setErro("");
      setUltimoLink(convite.link);
      setCopiado(false);
      await recarregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const cancelar = async (id) => {
    try {
      await api.delete(`/convites/${id}`);
      await recarregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(ultimoLink);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  const badgeStatus = (status) => {
    if (status === "Aceito") return "badge-verde";
    if (status === "Pendente") return "badge-amarelo";
    return "badge-cinza";
  };

  return (
    <div>
      <h1 className="pagina-titulo">Convidar Usuário</h1>
      <p className="pagina-subtitulo">Gere um convite com link de acesso para novos usuários.</p>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      {ultimoLink && (
        <div className="alerta alerta-sucesso">
          <div style={{ marginBottom: 8 }}>Convite gerado. Envie o link de acesso ao convidado:</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, wordBreak: "break-all" }}>{ultimoLink}</span>
            <button className="btn-secundario" style={{ padding: "5px 12px", fontSize: 12, whiteSpace: "nowrap" }} onClick={copiarLink}>
              {copiado ? "Copiado!" : "Copiar link"}
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ maxWidth: 480, marginBottom: 28 }}>
        <div className="form-group">
          <label className="form-label">E-mail do convidado</label>
          <input className={`form-input ${erro ? "erro" : ""}`} type="email" placeholder="novo@empresa.com" value={email} onChange={(e) => { setEmail(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">Papel no sistema</label>
          <select className="form-input" value={papel} onChange={(e) => setPapel(e.target.value)}>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
            <option value="visualizador">Visualizador</option>
          </select>
        </div>
        <button className="btn-primario verde" onClick={handleConvidar}>Gerar convite →</button>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 500, color: "#3a3a36", marginBottom: 14 }}>Convites enviados</h2>
      {carregando ? (
        <p style={{ color: "#9b9989", fontSize: 14 }}>Carregando...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Enviado em</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {convites.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{c.email}</td>
                  <td><span className={`badge ${c.papel === "admin" ? "badge-azul" : "badge-cinza"}`}>{c.papel}</span></td>
                  <td style={{ color: "#7c7b6e", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{c.enviado}</td>
                  <td><span className={`badge ${badgeStatus(c.status)}`}>{c.status}</span></td>
                  <td>
                    {c.status === "Pendente" && (
                      <button className="btn-perigo" onClick={() => cancelar(c.id)}>Cancelar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InviteUser;
