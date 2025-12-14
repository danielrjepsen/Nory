namespace Nory.Application.Common;

public enum ResultErrorType
{
    None,
    NotFound,
    BadRequest,
    Unauthorized,
}

public readonly struct Result
{
    public bool IsSuccess { get; }
    public string? Error { get; }
    public ResultErrorType ErrorType { get; }

    private Result(bool isSuccess, string? error, ResultErrorType errorType)
    {
        IsSuccess = isSuccess;
        Error = error;
        ErrorType = errorType;
    }

    public static Result Success() => new(true, null, ResultErrorType.None);

    public static Result NotFound(string error) => new(false, error, ResultErrorType.NotFound);

    public static Result BadRequest(string error) => new(false, error, ResultErrorType.BadRequest);

    public static Result Unauthorized(string error = "Unauthorized") =>
        new(false, error, ResultErrorType.Unauthorized);
}

/// <summary>
/// result with data
/// </summary>
public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string? Error { get; }
    public ResultErrorType ErrorType { get; }

    private Result(bool isSuccess, T? data, string? error, ResultErrorType errorType)
    {
        IsSuccess = isSuccess;
        Data = data;
        Error = error;
        ErrorType = errorType;
    }

    public static Result<T> Success(T data) => new(true, data, null, ResultErrorType.None);

    public static Result<T> NotFound(string error) =>
        new(false, default, error, ResultErrorType.NotFound);

    public static Result<T> BadRequest(string error) =>
        new(false, default, error, ResultErrorType.BadRequest);

    public static Result<T> Unauthorized(string error = "Unauthorized") =>
        new(false, default, error, ResultErrorType.Unauthorized);
}
