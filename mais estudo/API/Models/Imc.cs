namespace API.Models;

public class Imc
{
    public int Id { get; set; }
    public float Peso { get; set; }
    public float Altura { get; set; }
    public float Total { get; set; }
    public Pessoa? Pessoa { get; set; }
    public string PessoaCpf { get; set; }
    public string Status { get; set; }
}
