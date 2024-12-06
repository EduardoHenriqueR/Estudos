using System;

namespace API.Models;

public class Folha
{
    public int Id { get; set; }
    public double SalarioBruto { get; set; }
    public double SalarioLiquido { get; set; }
    public int DiasTrabalhados { get; set; }
    public double? Inss { get; set; }
    public double? Irff { get; set; }
    public double? ValeRefeicao { get; set; } = 0;
    public double? ValeTrans { get; set; } = 0;
    public int Dia { get; set; }
    public int Mes { get; set; }
    public int Ano { get; set; }
    public Funcionario? Funcionario { get; set; }
    public string FuncionarioCpf { get; set; }
}
