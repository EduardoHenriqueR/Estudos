using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(
    options => 
        options.AddPolicy("Acesso Total", configs=>configs
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin())
);


var app = builder.Build();

app.MapGet("/", () => "API para calcular IMC");

app.MapPost("/api/pessoa/cadastrar", ([FromServices] AppDataContext ctx, Pessoa pessoa) =>
{
    if(string.IsNullOrWhiteSpace(pessoa.Cpf) || pessoa.Cpf.Length < 11)
    {
        return Results.BadRequest("Dados de CPF invalidos.");
    }
        
    if(string.IsNullOrWhiteSpace(pessoa.Nome))
    {
        return Results.BadRequest("Nome é obrigatorio");
    }

    if(string.IsNullOrWhiteSpace(pessoa.Sexo))
    {
        return Results.BadRequest("Informe o seu sexo");
    }
    
    if(pessoa.Idade <= 0)
    {
        return Results.BadRequest("Idade invalida.");
    }

    ctx.Pessoas.Add(pessoa);
    ctx.SaveChanges();
    return Results.Ok(pessoa);
});

app.MapGet("/api/pessoa/listar", ([FromServices] AppDataContext ctx) =>
{
    if(ctx.Pessoas.Any())
    {
        return Results.Ok(ctx.Pessoas.ToList());
    }

    return Results.BadRequest("Nenhuma pessoa foi registrada ainda.");
});

app.MapPost("/api/imc/cadastrar", ([FromServices] AppDataContext ctx, Imc imc) => 
{
    var pessoa = ctx.Pessoas.FirstOrDefault(p => p.Cpf == imc.PessoaCpf);
    if(pessoa == null)
    {
        return Results.BadRequest("CPF invalido.");
    }

    if(pessoa.Cpf == imc.PessoaCpf)
    {
        return Results.BadRequest("Já existe um IMC do(a): " + pessoa.Nome);
    }

    if(imc.Peso <=0 || imc.Altura <= 0)
    {
        return Results.BadRequest("Dados em Peso e/ou Altura invalidos.");
    }

    imc.Pessoa = pessoa;
    imc.Total = imc.Peso /(imc.Altura * imc.Altura);

    if(imc.Total <= 18.5)
    {
        imc.Status = "Abaixo do Peso";
    }
    
    else if(imc.Total >= 18.6 && imc.Total <= 24.9)
    {
        imc.Status = "Saudável";
    }

    else if(imc.Total >= 25 && imc.Total <= 29.9)  
    {
        imc.Status = "Acima do Peso";
    }
    else
    {
        imc.Status = "Obessidade";
    }

    ctx.Imcs.Add(imc);
    ctx.SaveChanges();
    return Results.Ok(imc);
});

app.MapPut("/api/imc/editar", ([FromServices] AppDataContext ctx, Imc imcNovo) => 
{
    var imc = ctx.Imcs.Find(imcNovo.Id);
    if(imc == null)
    {
        return Results.NotFound("Id de IMC não eonctrado.");
    }

    imc.Altura = imcNovo.Altura;
    imc.Peso = imcNovo.Peso;
    imc.Total = imcNovo.Peso / (imcNovo.Altura * imcNovo.Altura);
    
    if (imc.Total < 18.5)
    {
        imc.Status = "Abaixo do peso";
    }
    else if (imc.Total >= 18.5 && imc.Total < 24.9)
    {
        imc.Status = "Saudável";
    }
    else if (imc.Total >= 24.9 && imc.Total <= 29.9)
    {
        imc.Status = "Acima do peso";
    }
    else
    {
        imc.Status = "Obesidade";
    }

    ctx.Imcs.Update(imc);
    ctx.SaveChanges();
    return Results.Ok(imc);
});

app.UseCors("Acesso Total");
app.Run();
