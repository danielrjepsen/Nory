using System.Text;
using System.Text.Json;

namespace Nory.Api.Tests.Fixtures;

public static class AuthenticatedClient
{
    public static HttpClient CreateAuthenticatedClient(this CustomWebApplicationFactory factory, string userId)
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserIdHeader, userId);
        return client;
    }

    public static HttpClient CreateUnauthenticatedClient(this CustomWebApplicationFactory factory)
    {
        return factory.CreateClient();
    }
}

public static class HttpClientExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    public static async Task<HttpResponseMessage> PostAsJsonAsync<T>(this HttpClient client, string url, T data)
    {
        var json = JsonSerializer.Serialize(data, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        return await client.PostAsync(url, content);
    }

    public static async Task<HttpResponseMessage> PatchAsJsonAsync<T>(this HttpClient client, string url, T data)
    {
        var json = JsonSerializer.Serialize(data, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var request = new HttpRequestMessage(HttpMethod.Patch, url) { Content = content };
        return await client.SendAsync(request);
    }
}
