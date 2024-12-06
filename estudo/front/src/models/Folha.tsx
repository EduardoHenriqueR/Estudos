import { Funcionario } from "./Funcionario";

export interface Folha{
    id?: number;
    salarioBruto: number;
    salarioLiquido?: number;
    diasTrabalhados: number;
    inss?: number;
    irff?: number;
    valeRefeicao: number;
    valeTrans: number;
    dia: number;
    mes: number;
    ano: number;
    funcionario?: Funcionario;
    funcionarioCpf: string;
}