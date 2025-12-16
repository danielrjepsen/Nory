using System.Text;
using System.Text.RegularExpressions;

namespace Nory.Infrastructure.Utilities;

public static partial class SlugGenerator
{
    private const int DefaultMaxLength = 50;

    public static string Create(string input, int maxLength = DefaultMaxLength)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "unnamed";

        var slug = input.ToLowerInvariant().Trim();
        slug = slug
            .Replace("'", "")
            .Replace("\"", "")
            .Replace("&", "and");

        var result = new StringBuilder();
        foreach (var c in slug)
        {
            if (char.IsLetterOrDigit(c))
                result.Append(c);
            else if (c is ' ' or '-' or '_')
                result.Append('-');
        }

        slug = MultiDashRegex().Replace(result.ToString(), "-").Trim('-');

        if (slug.Length > maxLength)
            slug = slug[..maxLength].TrimEnd('-');

        return string.IsNullOrEmpty(slug) ? "unnamed" : slug;
    }

    [GeneratedRegex("--+")]
    private static partial Regex MultiDashRegex();
}
