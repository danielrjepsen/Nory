namespace Nory.Core.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; }
    public string Name { get; private set; }
    public string Locale { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private User() { }

    public User(string email, string name, string locale = "en")
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required");

        Id = Guid.NewGuid();
        Email = email;
        Name = name;
        Locale = locale;
        CreatedAt = DateTime.UtcNow;
    }
}
