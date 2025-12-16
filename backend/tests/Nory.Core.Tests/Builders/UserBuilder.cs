using Nory.Core.Domain.Entities;

namespace Nory.Core.Tests.Builders;

public class UserBuilder
{
    private string _id = Guid.NewGuid().ToString();
    private string _email = "test@example.com";
    private string _name = "Test User";
    private string? _locale = "en";
    private string? _profilePicture = null;
    private DateTime _createdAt = DateTime.UtcNow;
    private DateTime _updatedAt = DateTime.UtcNow;

    public UserBuilder WithId(string id)
    {
        _id = id;
        return this;
    }

    public UserBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }

    public UserBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public UserBuilder WithLocale(string locale)
    {
        _locale = locale;
        return this;
    }

    public UserBuilder WithProfilePicture(string url)
    {
        _profilePicture = url;
        return this;
    }

    public UserBuilder CreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public User Build()
    {
        return new User(
            id: _id,
            email: _email,
            name: _name,
            locale: _locale,
            profilePicture: _profilePicture,
            createdAt: _createdAt,
            updatedAt: _updatedAt
        );
    }

    public User Create()
    {
        return User.Create(_id, _email, _name);
    }

    public static UserBuilder Default() => new();

    public static UserBuilder ForEmail(string email) =>
        new UserBuilder().WithEmail(email);
}
