namespace Nory.Application.DTOs.Setup;

public class SetupResult
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();

    public static SetupResult Ok() => new() { Success = true };

    public static SetupResult Fail(string error) => new()
    {
        Success = false,
        Errors = new List<string> { error }
    };

    public static SetupResult Fail(List<string> errors) => new()
    {
        Success = false,
        Errors = errors
    };
}
