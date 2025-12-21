using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class EmailMappingExtensions
{
    public static EmailConfiguration ToDomain(this EmailConfigurationDbModel model)
    {
        return new EmailConfiguration(
            model.Provider,
            model.SmtpHost,
            model.SmtpPort,
            model.UseSsl,
            model.Username,
            model.EncryptedPassword,
            model.FromEmail,
            model.FromName);
    }

    public static EmailConfigurationDbModel ToDbModel(this EmailConfiguration entity)
    {
        return new EmailConfigurationDbModel
        {
            Id = entity.Id,
            IsEnabled = entity.IsEnabled,
            Provider = entity.Provider,
            SmtpHost = entity.SmtpHost,
            SmtpPort = entity.SmtpPort,
            UseSsl = entity.UseSsl,
            Username = entity.Username,
            EncryptedPassword = entity.EncryptedPassword,
            FromEmail = entity.FromEmail,
            FromName = entity.FromName,
            LastTestedAt = entity.LastTestedAt,
            LastTestSuccessful = entity.LastTestSuccessful,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateFrom(this EmailConfigurationDbModel model, EmailConfiguration entity)
    {
        model.IsEnabled = entity.IsEnabled;
        model.Provider = entity.Provider;
        model.SmtpHost = entity.SmtpHost;
        model.SmtpPort = entity.SmtpPort;
        model.UseSsl = entity.UseSsl;
        model.Username = entity.Username;
        model.EncryptedPassword = entity.EncryptedPassword;
        model.FromEmail = entity.FromEmail;
        model.FromName = entity.FromName;
        model.LastTestedAt = entity.LastTestedAt;
        model.LastTestSuccessful = entity.LastTestSuccessful;
        model.UpdatedAt = entity.UpdatedAt;
    }
}
