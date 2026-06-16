import { useState } from "react";

const Contato = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [statusNome, setStatusNome] = useState("vazio");
  const [statusEmail, setStatusEmail] = useState("vazio");
  const [msgNome, setMsgNome] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const validarNome = (valor) => {
    const trim = valor.trim();
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!valor) { setStatusNome("vazio"); setMsgNome(""); return; }
    if (trim.length < 3) { setStatusNome("erro"); setMsgNome("❌ Mínimo 3 caracteres."); return; }
    if (!regex.test(valor)) { setStatusNome("erro"); setMsgNome("❌ Apenas letras e espaços."); return; }
    setStatusNome("sucesso"); setMsgNome("✅ Nome válido!");
  };

  const validarEmail = (valor) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) { setStatusEmail("vazio"); setMsgEmail(""); return; }
    if (!regex.test(valor)) { setStatusEmail("erro"); setMsgEmail("❌ E-mail inválido."); return; }
    setStatusEmail("sucesso"); setMsgEmail("✅ E-mail válido!");
  };

  const handleEnviar = () => {
    if (statusNome === "sucesso" && statusEmail === "sucesso" && mensagem.trim().length > 5) {
      setEnviado(true);
      setTimeout(() => { setEnviado(false); setNome(""); setEmail(""); setMensagem(""); setStatusNome("vazio"); setStatusEmail("vazio"); }, 3000);
    }
  };

  return (
    <div className="main-conteudo">
      <div className="contato-wrapper">
        <h1 className="contato-titulo">Fale conosco</h1>
        <p className="contato-subtitulo">Preencha o formulário abaixo que retornaremos em breve.</p>

        {enviado && <div className="alerta alerta-sucesso">✅ Mensagem enviada com sucesso! Entraremos em contato.</div>}

        <div className="card">
          <div className="form-group">
            <label className="form-label">Seu nome</label>
            <input
              className={`form-input ${statusNome === "erro" ? "erro" : statusNome === "sucesso" ? "sucesso" : ""}`}
              type="text"
              placeholder="Ex: Ana Silva"
              value={nome}
              onChange={(e) => { setNome(e.target.value); validarNome(e.target.value); }}
            />
            <p className={`${statusNome === "erro" ? "form-mensagem-erro" : "form-mensagem-sucesso"}`} style={{ minHeight: 18 }}>{msgNome}</p>
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className={`form-input ${statusEmail === "erro" ? "erro" : statusEmail === "sucesso" ? "sucesso" : ""}`}
              type="email"
              placeholder="Ex: ana@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); validarEmail(e.target.value); }}
            />
            <p className={`${statusEmail === "erro" ? "form-mensagem-erro" : "form-mensagem-sucesso"}`} style={{ minHeight: 18 }}>{msgEmail}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Mensagem</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Escreva sua mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              style={{ resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <button className="btn-primario" onClick={handleEnviar}>Enviar mensagem</button>
        </div>
      </div>
    </div>
  );
};

export default Contato;