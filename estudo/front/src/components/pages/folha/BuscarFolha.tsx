import React, { useState } from "react";
import { Folha } from "../../../models/Folha";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BuscarFolha() {
  const [folha, setFolha] = useState<Folha | null>(null);
  const [cpf, setCpf] = useState("");
  const [mes, setMes] = useState(0);
  const [ano, setAno] = useState(0);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function pesquisarFolha() {
    if (!cpf || mes <= 0 || ano <= 0) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setErro(""); // Limpa erros anteriores

    fetch(`http://localhost:5168/api/folha/buscar/${cpf}/${mes}/${ano}`)
      .then((resposta) => {
        if (!resposta.ok) {
          return resposta.text().then((textoErro) => {
            throw new Error(textoErro);
          });
        }
        return resposta.json();
      })
      .then((folhaEncontrada) => {
        setFolha(folhaEncontrada);
      })
      .catch((erro) => {
        setErro(erro.message || "Erro ao buscar a folha. Tente novamente.");
        setFolha(null); // Limpa a folha, se houver erro
      });
  }

  function deletarFolha(id: number) {
    axios
      .delete(`http://localhost:5168/api/folha/deletar/${id}`)
      .then(() => {
        // Quando a folha for deletada, limpa a folha do estado
        setFolha(null);
      })
      .catch(() => setErro("Erro ao deletar a folha."));
  }

  function editarFolha(folha: Folha) {
    navigate(`/folha/editar/${folha.funcionarioCpf}/${folha.mes}/${folha.ano}`);
  }

    return(
        <div>
        <h3>Buscar Folha de Pagamento</h3>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <input
          type="number"
          placeholder="Mês"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
        />
        <button onClick={pesquisarFolha}>Buscar</button>
  
        {erro && <div style={{ color: "red" }}>{erro}</div>}
  
        {folha && (
          <div>
            <h4>Folha Encontrada:</h4>
            <table>
<thead>
                    <tr >
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Salario Bruto</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Inss</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Irrf</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vale Alimentação</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vale Transporte</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Dias Trabalhados</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Dia</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mês</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ano</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Salario Liquido</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.salarioBruto}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {folha.inss !== undefined ? (folha.inss * 100).toFixed(1) + '%' : 'N/A'}
                        </td> {/* INSS condicional */}
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {folha.irff !== undefined ? (folha.irff * 100).toFixed(1) + '%' : 'N/A'}
                        </td> {/* IRRF condicional */}
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.valeRefeicao}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.valeTrans}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.diasTrabalhados}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.dia}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.mes}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.ano}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{folha.salarioLiquido}</td>
                        <td>
                                <button onClick={() => deletarFolha(folha.id!)}>Deletar</button>
                                <button onClick={() => editarFolha(folha)}>Editar</button>         
                            </td>   
                        </tr>
                    
                </tbody>
            </table>
          </div>
        )}
      </div>
    );
}
export default BuscarFolha;