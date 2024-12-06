import React from "react";
import ListarFolha from "./components/pages/folha/ListarFolha";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CadastrarFolha from "./components/pages/folha/CadastrarFolha";
import BuscarFolha from "./components/pages/folha/BuscarFolha";
import AtualizarFolha from "./components/pages/folha/AtualizarFolha";

function App() {
  return (
   <div id="app">
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Pagina Inicial</Link>
          </li>
          <li>
            <Link to="/pages/folha/listar">Folhas de Pagamento</Link>
          </li>
          <li>
            <Link to="/pages/folha/cadastrar">Registrar nova Folha de Pagamento</Link>
          </li>
          <li>
            <Link to="/pages/folha/buscar">Buscar Folha</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ListarFolha />} /> 
        <Route path="/pages/folha/listar" element={<ListarFolha />} />

        <Route path="/pages/folha/cadastrar" 
               element={<CadastrarFolha/>}
        />

        <Route path="/pages/folha/buscar" 
               element={<BuscarFolha/>}
        />

        <Route path="/folha/editar/:cpf/:mes/:ano" element={<AtualizarFolha />} />
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
