import { useEffect, useState } from "react";
import Imc from "../../../models/Imc";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListarImc(){
    const[imc, setImc] = useState<Imc[]>([]);
    const[erro, setErro] = useState("");
    
    useEffect(() => {
        pesquisarImc();
    });

    function pesquisarImc()
    {
        axios
            .get("http://localhost:5128/api/imc/listar")
            .then((resposta) => {
                const dados = resposta.data;
                if(!dados || dados.lenght === 0)
                {
                    setErro("Nenhum dado foi registrado ainda.")
                    setImc([]);
                }
                else{
                    setImc(dados);
                    setErro("");
                }
            })
    }

    return(
        <div id="listar_imc">
            <h1>Calculo do IMC</h1>
            <table id="tabela">
                <thead>
                    <tr >
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Peso</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Altura</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {imc.map((imc) => (
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{imc.altura}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{imc.peso}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{imc.status}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{imc.total}</td>
                            <td>     
                            </td>                       
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


}
export default ListarImc;
