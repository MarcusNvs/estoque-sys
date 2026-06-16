import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const VisualizacaoEstoque = ({ produtos }) => {
  const [busca, setBusca] = useState("");
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.categoria.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div className="topo-acao">
        <input className="busca-input" placeholder="Buscar produto ou categoria..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <span style={{ fontSize: 13, color: "#7c7b6e" }}>{filtrados.length} produtos</span>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.nome}</td>
                <td><span className="badge badge-cinza">{p.categoria}</span></td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{p.qtd}</td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>R$ {p.preco.toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.status === "Normal" ? "badge-verde" : p.status === "Baixo" ? "badge-amarelo" : "badge-vermelho"}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BaixasEstoque = ({ produtos, baixas, recarregar }) => {
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleBaixa = async () => {
    const qtd = parseInt(quantidade);
    const produto = produtos.find(p => p.id === parseInt(produtoSelecionado));
    if (!produto) { setErro("Selecione um produto."); return; }
    if (!qtd || qtd <= 0) { setErro("Informe quantidade válida."); return; }

    try {
      await api.post("/baixas", { produtoId: produto.id, quantidade: qtd, motivo });
      setErro("");
      setSucesso(`Baixa de ${qtd}x "${produto.nome}" registrada!`);
      setProdutoSelecionado(""); setQuantidade(""); setMotivo("");
      await recarregar();
      setTimeout(() => setSucesso(""), 3000);
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <div className="card" style={{ maxWidth: 480, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", marginBottom: 16 }}>Registrar baixa</div>
        {erro && <div className="alerta alerta-erro">{erro}</div>}
        {sucesso && <div className="alerta alerta-sucesso">{sucesso}</div>}
        <div className="form-group">
          <label className="form-label">Produto</label>
          <select className="form-input" value={produtoSelecionado} onChange={(e) => { setProdutoSelecionado(e.target.value); setErro(""); }}>
            <option value="">Selecione...</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} (estoque: {p.qtd})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Quantidade</label>
          <input className="form-input" type="number" min="1" placeholder="0" value={quantidade} onChange={(e) => { setQuantidade(e.target.value); setErro(""); }} />
        </div>
        <div className="form-group">
          <label className="form-label">Motivo (opcional)</label>
          <input className="form-input" type="text" placeholder="Ex: Uso interno, danificado..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>
        <button className="btn-primario" onClick={handleBaixa}>Registrar baixa</button>
      </div>

      {baixas.length > 0 && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: "#3a3a36", marginBottom: 12 }}>Histórico de baixas</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr><th>Produto</th><th>Qtd</th><th>Motivo</th><th>Data</th></tr>
              </thead>
              <tbody>
                {baixas.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.produto}</td>
                    <td style={{ fontFamily: "'DM Mono', monospace" }}>{b.quantidade}</td>
                    <td style={{ color: "#7c7b6e" }}>{b.motivo}</td>
                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9b9989" }}>{b.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const CadastrosEstoque = ({ produtos, recarregar }) => {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [qtd, setQtd] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [modalRemover, setModalRemover] = useState(null);

  const handleCadastrar = async () => {
    if (!nome || !categoria || !qtd || !preco) { setErro("Preencha todos os campos."); return; }
    const qtdNum = parseInt(qtd);
    const precoNum = parseFloat(preco);
    if (isNaN(qtdNum) || qtdNum < 0) { setErro("Quantidade inválida."); return; }
    if (isNaN(precoNum) || precoNum < 0) { setErro("Preço inválido."); return; }

    try {
      await api.post("/produtos", { nome, categoria, qtd: qtdNum, preco: precoNum });
      setSucesso(`Produto "${nome}" cadastrado!`);
      setNome(""); setCategoria(""); setQtd(""); setPreco(""); setErro("");
      await recarregar();
      setTimeout(() => setSucesso(""), 3000);
    } catch (e) {
      setErro(e.message);
    }
  };

  const removerProduto = async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
      setModalRemover(null);
      await recarregar();
    } catch (e) {
      setErro(e.message);
      setModalRemover(null);
    }
  };

  return (
    <div>
      <div className="card" style={{ maxWidth: 500, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", marginBottom: 16 }}>Cadastrar novo produto</div>
        {erro && <div className="alerta alerta-erro">{erro}</div>}
        {sucesso && <div className="alerta alerta-sucesso">{sucesso}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: "1/-1" }}>
            <label className="form-label">Nome do produto</label>
            <input className="form-input" type="text" placeholder="Nome do produto" value={nome} onChange={(e) => { setNome(e.target.value); setErro(""); }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Categoria</label>
            <input className="form-input" type="text" placeholder="Ex: Hardware" value={categoria} onChange={(e) => { setCategoria(e.target.value); setErro(""); }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Quantidade</label>
            <input className="form-input" type="number" min="0" placeholder="0" value={qtd} onChange={(e) => { setQtd(e.target.value); setErro(""); }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: "1/-1" }}>
            <label className="form-label">Preço unitário (R$)</label>
            <input className="form-input" type="number" min="0" step="0.01" placeholder="0,00" value={preco} onChange={(e) => { setPreco(e.target.value); setErro(""); }} />
          </div>
        </div>
        <button className="btn-primario verde" style={{ marginTop: 20 }} onClick={handleCadastrar}>Cadastrar produto</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr><th>Produto</th><th>Categoria</th><th>Qtd</th><th>Preço</th><th></th></tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.nome}</td>
                <td><span className="badge badge-cinza">{p.categoria}</span></td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>{p.qtd}</td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>R$ {p.preco.toFixed(2)}</td>
                <td><button className="btn-perigo" onClick={() => setModalRemover(p)}>Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalRemover && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">Remover produto</h2>
            <p className="modal-subtitulo">Remover <strong>{modalRemover.nome}</strong> do estoque?</p>
            <div className="modal-botoes">
              <button className="btn-secundario" onClick={() => setModalRemover(null)}>Cancelar</button>
              <button className="btn-primario" style={{ background: "#c0392b" }} onClick={() => removerProduto(modalRemover.id)}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricasEstoque = ({ produtos }) => {
  const total = produtos.length;
  const criticos = produtos.filter(p => p.status === "Crítico").length;
  const baixos = produtos.filter(p => p.status === "Baixo").length;
  const normais = produtos.filter(p => p.status === "Normal").length;
  const valorTotal = produtos.reduce((acc, p) => acc + p.qtd * p.preco, 0);
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div>
      <div className="metricas-grid">
        {[
          { label: "Total de produtos", valor: total },
          { label: "Status normal", valor: normais },
          { label: "Estoque baixo", valor: baixos },
          { label: "Status crítico", valor: criticos },
        ].map((m, i) => (
          <div key={i} className="card-metrica">
            <div className="card-metrica-label">{m.label}</div>
            <div className="card-metrica-valor">{m.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Valor total em estoque</div>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#1a1a18" }}>
            R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: "#9b9989", marginTop: 6 }}>soma de qtd × preço unitário</div>
        </div>

        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Categorias</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {categorias.map(cat => {
              const qtdCat = produtos.filter(p => p.categoria === cat).length;
              return (
                <span key={cat} className="badge badge-cinza" style={{ fontSize: 12 }}>
                  {cat} ({qtdCat})
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Distribuição por status</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Normal", count: normais, color: "#3a6b10", bg: "#e8f5d4" },
            { label: "Baixo", count: baixos, color: "#7a5a00", bg: "#fef3d0" },
            { label: "Crítico", count: criticos, color: "#8b1a1a", bg: "#fde8e8" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 56, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 12, textAlign: "center" }}>{s.label}</span>
              <div style={{ flex: 1, height: 8, background: "#f0ede6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${total > 0 ? (s.count / total) * 100 : 0}%`, background: s.color, borderRadius: 4, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#7c7b6e", minWidth: 20 }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RelatoriosEstoque = ({ produtos, baixas }) => {
  const maisEscassos = [...produtos].sort((a, b) => a.qtd - b.qtd).slice(0, 5);
  const maisCostosos = [...produtos].sort((a, b) => (b.qtd * b.preco) - (a.qtd * a.preco)).slice(0, 5);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Produtos com menor estoque</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {maisEscassos.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0ede6" }}>
                <div style={{ fontSize: 13, color: "#1a1a18" }}>{p.nome}</div>
                <span className={`badge ${p.status === "Normal" ? "badge-verde" : p.status === "Baixo" ? "badge-amarelo" : "badge-vermelho"}`}>{p.qtd} un.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Maior valor em estoque</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {maisCostosos.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0ede6" }}>
                <div style={{ fontSize: 13, color: "#1a1a18" }}>{p.nome}</div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#3a6b10", fontWeight: 500 }}>
                  R$ {(p.qtd * p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#7c7b6e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Últimas baixas registradas</div>
        {baixas.length === 0 ? (
          <p style={{ fontSize: 13, color: "#9b9989", fontStyle: "italic" }}>Nenhuma baixa registrada ainda.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Motivo</th><th>Data</th></tr></thead>
            <tbody>
              {baixas.slice(0, 6).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.produto}</td>
                  <td style={{ fontFamily: "'DM Mono', monospace" }}>{b.quantidade}</td>
                  <td style={{ color: "#7c7b6e" }}>{b.motivo}</td>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9b9989" }}>{b.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Estoque = () => {
  const [tabAtual, setTabAtual] = useState("visualizacao");
  const [produtos, setProdutos] = useState([]);
  const [baixas, setBaixas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const recarregar = useCallback(async () => {
    try {
      const [listaProdutos, listaBaixas] = await Promise.all([
        api.get("/produtos"),
        api.get("/baixas"),
      ]);
      setProdutos(listaProdutos);
      setBaixas(listaBaixas);
      setErro("");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { recarregar(); }, [recarregar]);

  const tabs = [
    { id: "visualizacao", label: "Visualização" },
    { id: "baixas", label: "Baixas" },
    { id: "cadastros", label: "Cadastros" },
    { id: "metricas", label: "Métricas" },
    { id: "relatorios", label: "Relatórios" },
  ];

  const renderTab = () => {
    switch (tabAtual) {
      case "visualizacao": return <VisualizacaoEstoque produtos={produtos} />;
      case "baixas": return <BaixasEstoque produtos={produtos} baixas={baixas} recarregar={recarregar} />;
      case "cadastros": return <CadastrosEstoque produtos={produtos} recarregar={recarregar} />;
      case "metricas": return <MetricasEstoque produtos={produtos} />;
      case "relatorios": return <RelatoriosEstoque produtos={produtos} baixas={baixas} />;
      default: return null;
    }
  };

  return (
    <div>
      <h1 className="pagina-titulo">Estoque</h1>
      <p className="pagina-subtitulo">Gerencie produtos, cadastros, baixas e visualize métricas.</p>
      <div className="estoque-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`estoque-tab ${tabAtual === t.id ? "ativo" : ""}`} onClick={() => setTabAtual(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {erro && <div className="alerta alerta-erro">{erro}</div>}
      {carregando ? <p style={{ color: "#9b9989", fontSize: 14 }}>Carregando...</p> : renderTab()}
    </div>
  );
};

export default Estoque;
