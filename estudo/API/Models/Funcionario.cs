using System;
using Microsoft.EntityFrameworkCore;

namespace API.Models;

public class Funcionario
{
    public int Id { get; set; }
    public string Cpf { get; set; }
    public string Nome { get; set; }
}
