using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(
    options => 
        options.AddPolicy("Acesso Total", configs => configs
            .AllowAnyHeader()
            .AllowAnyOrigin()
            .AllowAnyMethod())
);

var app = builder.Build();

app.MapGet("/", () => "Hello World!");


//Funcionario
app.MapPost("/api/funcionario/cadastrar", ([FromServices] AppDataContext ctx, Funcionario funcionario) => 
{
    if(funcionario == null)
    {
        return Results.BadRequest("Dados Invalidos, verfique os campos e tente novamente.");
    }

    if(funcionario.Nome.Length <=0)
    {
        return Results.BadRequest("Dados Invalidos, verfique os campos e tente novamente.");
    }

    if(funcionario.Cpf.Length < 11)
    {
        return Results.BadRequest("CPF Invalido, tente novamente.");
    }
    var cpfNovo = ctx.Funcionarios.Any(a => a.Cpf == funcionario.Cpf);
    if(cpfNovo)
    {
        return Results.BadRequest("CPF já existente.");
    }

    ctx.Funcionarios.Add(funcionario);
    ctx.SaveChanges();
    return Results.Ok(funcionario);
});

app.MapGet("/api/funcionario/listar", ([FromServices] AppDataContext ctx) =>
{
    if(ctx.Funcionarios.Any())
    {
        return Results.Ok(ctx.Funcionarios.ToList());
    }

    return Results.BadRequest("Nenhum Funcionario registrado.");
});

app.MapPut("/api/funcionario/editar/{cpf}", ([FromServices] AppDataContext ctx, string cpf ,Funcionario novoFuncionario) => 
{
    var funcionario = ctx.Funcionarios.FirstOrDefault(a => a.Cpf == cpf);
    if(funcionario == null)
    {
        return Results.BadRequest("ID não encontrado.");
    }

    funcionario.Cpf = novoFuncionario.Cpf;
    funcionario.Nome = novoFuncionario.Nome;

    ctx.Funcionarios.Update(funcionario);
    ctx.SaveChanges();
    return Results.Ok(novoFuncionario);
});



//Folha

app.MapPost("/api/folha/cadastrar", ([FromServices] AppDataContext ctx, Folha folha) =>
{
    var funcionario = ctx.Funcionarios.FirstOrDefault(f => f.Cpf == folha.FuncionarioCpf);
    if(funcionario == null)
    {
        return Results.BadRequest("Informe um CPF valido.");
    }

    var folhaExistente = ctx.Folhas.Any(f => 
            f.FuncionarioCpf == folha.FuncionarioCpf && 
            f.Mes == folha.Mes && 
            f.Ano == folha.Ano);

    if (folhaExistente)
    {
        return Results.BadRequest("Já existe uma folha cadastrada para este CPF no mesmo Ano e Mês.");
    }

    if(folha.SalarioBruto <= 0)
    {
        return Results.BadRequest("Insira um valor valido.");
    }

    if(folha.SalarioBruto <= 1412.00)
    {
        folha.Inss = 0.075;
    }
    else if(folha.SalarioBruto > 1412.00 && folha.SalarioBruto <= 2666.68)
    {
        folha.Inss = 0.09;
    }
    else if(folha.SalarioBruto >= 2666.68 && folha.SalarioBruto <= 4000.03)
    {
        folha.Inss = 0.12;
    }
    else
    {
        folha.Inss = 0.14;
    }
    
    double d;
    if(folha.SalarioBruto >= 2112.01)
    {
        folha.Irff = 0.075;
        d = 158.40;
    }
    else if(folha.SalarioBruto > 2826.65 && folha.SalarioBruto < 3751.05)
    {
        folha.Irff = 0.15;
        d = 370.40;
    }
    else if(folha.SalarioBruto > 3751.05 && folha.SalarioBruto <  4664.68)
    {
        folha.Irff = 0.225;
        d = 651.73;
    }
    else
    {
        folha.Irff = 0.275;
        d = 884.96;
    }

    if(folha.ValeRefeicao > 0)
    {
        folha.ValeRefeicao = folha.ValeRefeicao * folha.DiasTrabalhados;
    }
    
    
    var descontoIn = folha.SalarioBruto * folha.Inss;
    var descontIr = (folha.SalarioBruto * folha.Irff) - d;
    

    folha.SalarioLiquido = (double)(folha.SalarioBruto - descontoIn - descontIr - folha.ValeRefeicao - folha.ValeTrans);
    folha.Funcionario = funcionario;
    
    ctx.Folhas.Add(folha);
    ctx.SaveChanges();
    return Results.Ok(folha);
});

app.MapGet("/api/folha/listar", ([FromServices] AppDataContext ctx) =>
{
    if(ctx.Folhas.Any())
    {
        return Results.Ok(ctx.Folhas.Include(a=> a.Funcionario).ToList());
    }

    return Results.BadRequest("Nenhum Funcionario registrado.");
});

app.MapDelete("/api/folha/deletar/{id}", ([FromServices] AppDataContext ctx, int id) =>
{
    var folha = ctx.Folhas.Find(id);
    
    if(folha == null)
    {
        return Results.BadRequest("Folha não encontrada.");
    }

    ctx.Folhas.Remove(folha);
    ctx.SaveChanges();
    return Results.Ok("Folha deletada com sucesso.");
});

app.MapGet("/api/folha/buscar/{cpf}/{mes}/{ano}", ([FromServices] AppDataContext ctx, string cpf, int mes, int ano) =>
{   
    if (string.IsNullOrWhiteSpace(cpf) || mes <= 0 || mes > 12 || ano <= 0)
    {
        return Results.BadRequest("Parâmetros inválidos. Verifique o CPF, mês e ano.");
    }

    var folha = ctx.Folhas.FirstOrDefault(f => f.FuncionarioCpf == cpf && f.Ano == ano && f.Mes == mes);
    if(folha == null)
    {
        return Results.BadRequest("Folha não encontrada.");
    }

    var funcionario = ctx.Funcionarios.FirstOrDefault(f => f.Cpf == folha.FuncionarioCpf);
    if (funcionario == null)
    {
        return Results.BadRequest("Funcionário não encontrado.");
    }

    folha.Funcionario = funcionario;
    return Results.Ok(folha);
});

app.MapPut("/api/folha/editar/{cpf}/{mes}/{ano}", ([FromServices] AppDataContext ctx, string cpf, int mes, int ano, [FromBody] Folha folhaNova) =>
{   
    // Validação inicial dos parâmetros
    if (string.IsNullOrWhiteSpace(cpf) || mes <= 0 || mes > 12 || ano <= 0)
    {
        return Results.BadRequest("Parâmetros inválidos. Verifique o CPF, mês e ano.");
    }

    // Busca da folha existente
    var folha = ctx.Folhas.FirstOrDefault(f => f.FuncionarioCpf == cpf && f.Ano == ano && f.Mes == mes);
    if (folha == null)
    {
        return Results.BadRequest("Folha não encontrada.");
    }

    // Atualização dos campos
    folha.SalarioBruto = folhaNova.SalarioBruto;
    folha.DiasTrabalhados = folhaNova.DiasTrabalhados;
    folha.ValeRefeicao = folhaNova.ValeRefeicao;
    folha.ValeTrans = folhaNova.ValeTrans;

    // Validação do salário bruto
    if (folha.SalarioBruto <= 0)
    {
        return Results.BadRequest("Insira um valor válido.");
    }

    // Cálculo do INSS
    if (folha.SalarioBruto <= 1412.00)
    {
        folha.Inss = 0.075;
    }
    else if (folha.SalarioBruto > 1412.00 && folha.SalarioBruto <= 2666.68)
    {
        folha.Inss = 0.09;
    }
    else if (folha.SalarioBruto > 2666.68 && folha.SalarioBruto <= 4000.03)
    {
        folha.Inss = 0.12;
    }
    else
    {
        folha.Inss = 0.14;
    }

    // Cálculo do IRFF
    double deducao;
    if (folha.SalarioBruto <= 2112.00)
    {
        folha.Irff = 0;
        deducao = 0;
    }
    else if (folha.SalarioBruto > 2112.00 && folha.SalarioBruto <= 2826.65)
    {
        folha.Irff = 0.075;
        deducao = 158.40;
    }
    else if (folha.SalarioBruto > 2826.65 && folha.SalarioBruto <= 3751.05)
    {
        folha.Irff = 0.15;
        deducao = 370.40;
    }
    else if (folha.SalarioBruto > 3751.05 && folha.SalarioBruto <= 4664.68)
    {
        folha.Irff = 0.225;
        deducao = 651.73;
    }
    else
    {
        folha.Irff = 0.275;
        deducao = 884.96;
    }

    // Cálculo do Vale Refeição
    if (folha.ValeRefeicao > 0)
    {
        folha.ValeRefeicao = folha.ValeRefeicao * folha.DiasTrabalhados;
    }

    // Cálculo dos descontos
    var descontoInss = folha.SalarioBruto * folha.Inss;
    var descontoIrff = (folha.SalarioBruto * folha.Irff) - deducao;

    // Cálculo do salário líquido
    folha.SalarioLiquido = (double)(folha.SalarioBruto - descontoInss - descontoIrff - folha.ValeRefeicao - folha.ValeTrans);

    // Atualização no banco
    ctx.Folhas.Update(folha);
    ctx.SaveChanges();

    return Results.Ok("Folha atualizada com sucesso.");
});

app.UseCors("Acesso Total");
app.Run();
