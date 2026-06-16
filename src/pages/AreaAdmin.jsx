import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import GerencUsuarios from "./GerencUsuarios";
import InviteUser from "./InviteUser";
import Estoque from "./Estoque";
import { useAuth } from "../contexts/AuthContext";

const AreaAdmin = ({ setPaginaAtual }) => {
  const [abaAtual, setAbaAtual] = useState("dashboard");
  const { usuarioLogado } = useAuth();

  const renderAba = () => {
    switch (abaAtual) {
      case "dashboard": return <Dashboard />;
      case "gerenc-usuarios": return usuarioLogado?.papel === "admin" ? <GerencUsuarios /> : <Dashboard />;
      case "invite-user": return usuarioLogado?.papel === "admin" ? <InviteUser /> : <Dashboard />;
      case "estoque": return <Estoque />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar abaAtual={abaAtual} setAbaAtual={setAbaAtual} setPaginaAtual={setPaginaAtual} />
      <main className="admin-conteudo">
        {renderAba()}
      </main>
    </div>
  );
};

export default AreaAdmin;