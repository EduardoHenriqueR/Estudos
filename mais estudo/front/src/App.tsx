import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ListarImc from "./components/pages/imc/ListarImc";

function Appp() {
  return (
   <div id="app">
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Pagina Inicial</Link>
          </li>
          <li>
            <Link to="/pages/imc/listar">Folhas de Pagamento</Link>
          </li>

        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ListarImc />} /> 
        <Route path="/pages/imc/listar" element={<ListarImc />} />

      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default Appp;