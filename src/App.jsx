import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css"; 

import HeaderPublico from "./components/HeaderPublico";
import FooterPublico from "./components/FooterPublico";
import RotaProtegida from "./components/RotaProtegida";

import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import AreaAdmin from "./pages/AreaAdmin";

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState("home");

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case "home": return (
        <>
          <HeaderPublico paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
          <Home setPaginaAtual={setPaginaAtual} />
          <FooterPublico />
        </>
      );
      case "sobre": return (
        <>
          <HeaderPublico paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
          <Sobre setPaginaAtual={setPaginaAtual} />
          <FooterPublico />
        </>
      );
      case "contato": return (
        <>
          <HeaderPublico paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
          <Contato />
          <FooterPublico />
        </>
      );
      case "login": return <Login setPaginaAtual={setPaginaAtual} />;
      case "cadastro": return <Cadastro setPaginaAtual={setPaginaAtual} />;
      case "admin": return (
        <RotaProtegida setPaginaAtual={setPaginaAtual}>
          <AreaAdmin setPaginaAtual={setPaginaAtual} />
        </RotaProtegida>
      );
      default: return null;
    }
  };

  return (
    <AuthProvider>
      <div className="app-wrapper">
        {renderizarPagina()}
      </div>
    </AuthProvider>
  );
}