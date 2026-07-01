import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const GerencUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalRemover, setModalRemover] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      const lista = await api.get("/usuarios?limit=100");
      setUsuarios(lista.dados);
      setErro("");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { recarregar(); }, [recarregar]);

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const removerUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setModalRemover(null);
      await recarregar();
    } catch (e) {
      setErro(e.message);
      setModalRemover(null);
    }
  };

  const toggleStatus = async (u) => {
    try {
      await api.put(`/usuarios/${u.id}`, { status: u.status === "Ativo" ? "Inativo" : "Ativo" });
      await recarregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <h1 className="pagina-titulo">Gerenciar Usuários</h1>
      <p className="pagina-subtitulo">{usuarios.length} usuários cadastrados no sistema</p>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="topo-acao">
        <input className="busca-input" type="text" placeholder="Buscar por nome ou e-mail..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {carregando ? (
        <p style={{ color: "#9b9989", fontSize: 14 }}>Carregando...</p>
      ) : (
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Papel</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: "#1a1a18" }}>{u.nome}</div>
                    <div style={{ fontSize: 12, color: "#9b9989" }}>{u.email}</div>
                  </td>
                  <td><span className={`badge ${u.papel === "admin" ? "badge-azul" : "badge-cinza"}`}>{u.papel}</span></td>
                  <td style={{ color: "#7c7b6e", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{u.cadastro}</td>
                  <td>
                    <span className={`badge ${u.status === "Ativo" ? "badge-verde" : "badge-cinza"}`}>{u.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-secundario" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => toggleStatus(u)}>
                        {u.status === "Ativo" ? "Desativar" : "Ativar"}
                      </button>
                      <button className="btn-perigo" onClick={() => setModalRemover(u)}>Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {modalRemover && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">Remover usuário</h2>
            <p className="modal-subtitulo">Tem certeza que deseja remover <strong>{modalRemover.nome}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="modal-botoes">
              <button className="btn-secundario" onClick={() => setModalRemover(null)}>Cancelar</button>
              <button className="btn-primario" style={{ background: "#c0392b" }} onClick={() => removerUsuario(modalRemover.id)}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerencUsuarios;
