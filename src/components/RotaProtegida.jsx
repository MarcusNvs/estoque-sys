import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const RotaProtegida = ({ children, setPaginaAtual }) => {
  const { usuarioLogado, carregando } = useAuth();
  useEffect(() => {
    if (!carregando && !usuarioLogado) setPaginaAtual("login");
  }, [usuarioLogado, carregando]);

  if (carregando) return null;
  if (!usuarioLogado) return null;
  return children;
};

export default RotaProtegida;