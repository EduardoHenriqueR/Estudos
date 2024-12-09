import Pessoa from "./Pessoa";
export default interface Imc
{
    id?: number;
    peso: number;
    altura: number;
    total: number;
    pessoa?: Pessoa;
    pessoaCpf: string
    status: string;
}