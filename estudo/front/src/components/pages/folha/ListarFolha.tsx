import { useEffect, useState } from "react";
import {Folha} from "../../../models/Folha";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListarFolha() {
    const [folhas, setFolhas] = useState<Folha[]>([]);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
       pesquisarFolha();
    });

    function pesquisarFolha(){
        fetch("http://localhost:5168/api/folha/listar")
            .then((resultado) => resultado.json())
            .then((folhas) => {
                console.table(folhas);
                setFolhas(folhas);
            });
    }

    function deletarFolha(id: number) {
        axios
          .delete(`http://localhost:5168/api/folha/deletar/${id}`)
          .then(() => {
            setFolhas((folha) =>
              folha.filter((folha) => folha.id !== id)
            );
          })
          .catch(() => setErro("Erro ao deletar a folha."));
      }

      function editarFolha(folha: Folha) {
        navigate(`/folha/editar/${folha.funcionarioCpf}/${folha.mes}/${folha.ano}`);
      }

    return(
        <div id="listar_folhas">
            <h1>Folhas de Pagamento</h1>
            <table id="tabela">
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
                    {folhas.map((folha) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );

}
export default ListarFolha;