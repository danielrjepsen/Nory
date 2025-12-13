namespace Nory.Core.Domain.Entities;

public class User
{
    public string Id { get; private set; }
    public string Email { get; private set; }
    public string Name { get; private set; }
    public string Locale { get; private set; }
    public string? ProfilePicture { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // constructor for EF
    public User(
        string id,
        string email,
        string name,
        string locale,
        string? profilePicture,
        DateTime createdAt,
        DateTime? updatedAt
    )
    {
        Id = id;
        Email = email;
        Name = name;
        Locale = locale;
        ProfilePicture = profilePicture;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static User Create(string email, string name, string locale = "en")
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required", nameof(email));
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));

        return new User(
            id: Guid.NewGuid().ToString(),
            email: email.ToLowerInvariant().Trim(),
            name: name.Trim(),
            locale: locale,
            profilePicture: null,
            createdAt: DateTime.UtcNow,
            updatedAt: null
        );
    }

    public void UpdateProfile(string name, string locale)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));

        Name = name.Trim();
        Locale = locale;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProfilePicture(string? pictureUrl)
    {
        ProfilePicture = pictureUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required", nameof(email));

        Email = email.ToLowerInvariant().Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
