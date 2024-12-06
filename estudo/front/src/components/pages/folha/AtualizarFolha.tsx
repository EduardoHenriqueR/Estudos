import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Folha } from "../../../models/Folha";

function AtualizarFolha() {
  const navigate = useNavigate();
  const { cpf, mes, ano } = useParams<{ cpf: string; mes: string; ano: string }>();
  
  const [folha, setFolha] = useState<Folha | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cpf && mes && ano) {
      axios
        .get(`http://localhost:5168/api/folha/buscar/${cpf}/${mes}/${ano}`)
        .then((response) => {
          setFolha(response.data);
        })
        .catch((err) => {
          setErro("Erro ao buscar folha.");
        });
    }
  }, [cpf, mes, ano]);

  const atualizarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFolha((prevFolha) => {
      if (prevFolha) {
        return { ...prevFolha, [name]: value };
      }
      return prevFolha;
    });
  };

  const atualizarSubmit = () => {
    if (folha) {
      axios
        .put(`http://localhost:5168/api/folha/editar/${cpf}/${mes}/${ano}`, folha)
        .then(() => {
          navigate("/folhas"); // Redireciona para a lista de folhas
        })
        .catch(() => setErro("Erro ao atualizar a folha."));
    }
  };

  return (
    <div>
      <h3>Atualizar Folha de Pagamento</h3>
      <form>
        <label>
          Salário Bruto:
          <input
            type="number"
            name="salarioBruto"
            value={folha?.salarioBruto || ""}
            onChange={atualizarChange}
          />
        </label>
        <br />
        <label>
          Dias Trabalhados:
          <input
            type="number"
            name="diasTrabalhados"
            value={folha?.diasTrabalhados || ""}
            onChange={atualizarChange}
          />
        </label>
        <br />
        <label>
          Vale Refeição:
          <input
            type="number"
            name="valeRefeicao"
            value={folha?.valeRefeicao || ""}
            onChange={atualizarChange}
          />
        </label>
        <br />
        <label>
          Vale Transporte:
          <input
            type="number"
            name="valeTrans"
            value={folha?.valeTrans || ""}
            onChange={atualizarChange}
          />
        </label>
        <br />
        <button type="button" onClick={atualizarSubmit}>Atualizar</button>
      </form>
    </div>
  );
}

export default AtualizarFolha;
