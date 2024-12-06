import { useEffect, useState } from "react";
import { Folha } from "../../../models/Folha";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CadastrarFolha(){

    const [salarioBruto, setSalarioBruto] = useState(0);
    const [salarioLiquido, setSalarioLiquido] = useState(0);
    const [inss, setInss] = useState(0);
    const [irff, setIrff] = useState(0);
    const [diasTrabalhados, setDiasTabalhados] = useState(0);
    const [valeTrans, setValeTrans] = useState(0);
    const [valeRefeicao, setValeRefeicao] = useState(0);
    const [dia, setDia] = useState(0);
    const [mes, setMes] = useState(0);
    const [ano, setAno] = useState(0);
    const [funcionarioCpf, setFuncionarioCpf] = useState("");
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<[]>("http://localhost:5168/api/funcionario/listar")
            .then((resposta) => {
                setFuncionarios(resposta.data);
             })
    }, [])

    function cadastrarFolha(event : any) {
        event.preventDefault();
        console.log(funcionarioCpf);
        
        const folha: Folha = {
            salarioBruto : salarioBruto,
            diasTrabalhados: diasTrabalhados,
            valeTrans: valeTrans,
            valeRefeicao: valeRefeicao,
            dia: dia,
            mes: mes,
            ano: ano,
            funcionarioCpf: funcionarioCpf,
        };

        axios
            .post("http://localhost:5168/api/folha/cadastrar", folha)
            .then(() => {
                alert("Folha Cadastrada.");
                setSalarioBruto(0);
                setDiasTabalhados(0);
                setValeTrans(0);
                setValeRefeicao(0);
                setDia(0);
                setMes(0);
                setAno(0);
                setFuncionarioCpf("");
                setErrorMessage("");
                navigate("/pages/folha/listar");
            })
            .catch((error) => {
                if (error.response) {
                    // Exemplo de tratamento do erro
                    setErrorMessage(error.response.data); // Aqui você pode exibir o erro recebido da API
                } else {
                    setErrorMessage("Erro desconhecido. Tente novamente mais tarde.");
                }
            });
    }

    

    return(
        <div>  
            <h1>Registrar Folha de Pagaemnto</h1>
            <form onSubmit={cadastrarFolha} id="form_cadastro">
                <div className="form-group">
                    <label htmlFor="salarioBruto">Salario:</label>
                    <input type="number" 
                        id="salarioBruto"
                        name="salarioBruto"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setSalarioBruto(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="diasTrabalhados">Dias Trabalahdos:</label>
                    <input type="number" 
                        id="diasTrabalhados"
                        name="diasTrabalhados"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setDiasTabalhados(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="valeAlimentacao">Vale Alimentação:</label>
                    <input type="number" 
                        id="valeAlimentacao"
                        name="valeAlimentacao"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setValeRefeicao(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="valeTrans">Vale Transporte:</label>
                    <input type="number" 
                        id="valeTrans"
                        name="valeTrans"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setValeTrans(event.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="dia">Dia:</label>
                    <input type="number" 
                        id="dia"
                        name="dia"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setDia(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mes">Mês:</label>
                    <input type="number" 
                        id="mes"
                        name="mes"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setMes(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ano">Ano:</label>
                    <input type="number" 
                        id="ano"
                        name="ano"
                        required
                        min="0.01"
                        step="0.01"
                        onChange={(event: any) => setAno(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="funcionario">CPF do Funcionario:</label>
                    <select onChange={(event: any) => setFuncionarioCpf(event.target.value)}>
                        {funcionarios.map((funcionario) => (
                            <option value={funcionario.cpf} key={funcionario.cpf}> 
                                {funcionario.nome}
                            </option>
                        ))}
                    </select>
                </div>
                    
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <button type="submit">Registra</button>

            </form>
        </div>
    );
}
export default CadastrarFolha;