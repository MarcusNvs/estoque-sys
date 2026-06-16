import { useState } from "react";

const InviteUser = () => {
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState("operador");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [convites, setConvites] = useState([
    { email: "marco@empresa.com", papel: "operador", status: "Pendente", enviado: "18/05/2026" },
    { email: "lucia@empresa.com", papel: "admin", status: "Aceito", enviado: "15/05/2026" },
  ]);

  const handleConvidar = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setErro("Informe um e-mail."); return; }
    if (!regex.test(email)) { setErro("E-mail inválido."); return; }
    if (convites.find(c => c.email === email)) { setErro("E-mail já convidado."); return; }

    setConvites([{ email, papel, status: "Pendente", enviado: new Date().toLocaleDateString("pt-BR") }, ...convites]);
    setEmail("");
    setErro("");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div>
      <h1 className="pagina-titulo">Convidar Usuário</h1>
      <p className="pagina-subtitulo">Envie um convite por e-mail para novos usuários.</p>

      {enviado && <div className="alerta alerta-sucesso">✅ Convite enviado com sucesso!</div>}

      <div className="card" style={{ maxWidth: 480, marginBottom: 28 }}>
        <div className="form-group">
          <label className="form-label">E-mail do convidado</label>
          <input className={`form-input ${erro ? "erro" : ""}`} type="email" placeholder="novo@empresa.com" value={email} onChange={(e) => { setEmail(e.target.value); setErro(""); }} />
          {erro && <p className="form-mensagem-erro">{erro}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Papel no sistema</label>
          <select className="form-input" value={papel} onChange={(e) => setPapel(e.target.value)}>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button className="btn-primario verde" onClick={handleConvidar}>Enviar convite →</button>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 500, color: "#3a3a36", marginBottom: 14 }}>Convites enviados</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Enviado em</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {convites.map((c, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{c.email}</td>
                <td><span className={`badge ${c.papel === "admin" ? "badge-azul" : "badge-cinza"}`}>{c.papel}</span></td>
                <td style={{ color: "#7c7b6e", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{c.enviado}</td>
                <td><span className={`badge ${c.status === "Aceito" ? "badge-verde" : "badge-amarelo"}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InviteUser;