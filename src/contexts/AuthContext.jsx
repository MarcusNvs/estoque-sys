import { useState, useEffect, createContext, useContext } from "react";
import { api, definirToken } from "../services/api";

const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

const CHAVE_TOKEN = "estoque_token";

const AuthProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessao a partir do token salvo no navegador
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_TOKEN);
    if (!salvo) {
      setCarregando(false);
      return;
    }
    definirToken(salvo);
    api
      .get("/auth/me")
      .then((dados) => setUsuarioLogado(dados.usuario))
      .catch(() => {
        localStorage.removeItem(CHAVE_TOKEN);
        definirToken(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  function aplicarSessao(dados) {
    definirToken(dados.token);
    localStorage.setItem(CHAVE_TOKEN, dados.token);
    setUsuarioLogado(dados.usuario);
  }

  const login = async (email, senha) => {
    try {
      const dados = await api.post("/auth/login", { email, senha }, { auth: false });
      aplicarSessao(dados);
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, mensagem: e.message };
    }
  };

  const cadastrar = async (nome, email, senha) => {
    try {
      const dados = await api.post("/auth/cadastro", { nome, email, senha }, { auth: false });
      aplicarSessao(dados);
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, mensagem: e.message };
    }
  };

  const aceitarConvite = async (token, nome, senha) => {
    try {
      const dados = await api.post("/convites/aceitar", { token, nome, senha }, { auth: false });
      aplicarSessao(dados);
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, mensagem: e.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(CHAVE_TOKEN);
    definirToken(null);
    setUsuarioLogado(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioLogado, carregando, login, logout, cadastrar, aceitarConvite }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
