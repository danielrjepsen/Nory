namespace Nory.Core.Domain.Entities;

public class SystemSetting
{
    public string Key { get; private set; } = null!;
    public string Value { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private SystemSetting() { }

    public SystemSetting(string key, string value)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Key is required", nameof(key));

        Key = key;
        Value = value;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateValue(string value)
    {
        Value = value;
        UpdatedAt = DateTime.UtcNow;
    }

    public static class Keys
    {
        public const string BackupEncryptionKey = "backup_encryption_key";
    }
}
