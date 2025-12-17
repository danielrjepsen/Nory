using System.Security.Cryptography;
using System.Text;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class AesEncryptionService : IEncryptionService
{
    private readonly ISystemSettingsRepository _systemSettings;
    private byte[]? _key;
    private readonly SemaphoreSlim _keyLock = new(1, 1);

    private const int KeySize = 32;
    private const int NonceSize = 12;
    private const int TagSize = 16;

    public AesEncryptionService(ISystemSettingsRepository systemSettings)
    {
        _systemSettings = systemSettings;
    }

    private async Task<byte[]> GetKeyAsync()
    {
        if (_key != null)
            return _key;

        await _keyLock.WaitAsync();
        try
        {
            if (_key != null)
                return _key;

            var keyBase64 = await _systemSettings.GetValueAsync(SystemSetting.Keys.BackupEncryptionKey);
            if (string.IsNullOrEmpty(keyBase64))
                throw new InvalidOperationException(
                    "Backup encryption key not found. Complete the setup wizard first.");

            _key = Convert.FromBase64String(keyBase64);
            if (_key.Length != KeySize)
                throw new InvalidOperationException(
                    $"Invalid backup encryption key length: expected {KeySize} bytes, got {_key.Length}");

            return _key;
        }
        finally
        {
            _keyLock.Release();
        }
    }

    public string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText))
            return string.Empty;

        var key = GetKeyAsync().GetAwaiter().GetResult();
        var plainBytes = Encoding.UTF8.GetBytes(plainText);

        var nonce = new byte[NonceSize];
        RandomNumberGenerator.Fill(nonce);

        var cipherText = new byte[plainBytes.Length];
        var tag = new byte[TagSize];

        using var aesGcm = new AesGcm(key, TagSize);
        aesGcm.Encrypt(nonce, plainBytes, cipherText, tag);

        var result = new byte[NonceSize + cipherText.Length + TagSize];
        Buffer.BlockCopy(nonce, 0, result, 0, NonceSize);
        Buffer.BlockCopy(cipherText, 0, result, NonceSize, cipherText.Length);
        Buffer.BlockCopy(tag, 0, result, NonceSize + cipherText.Length, TagSize);

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string cipherTextBase64)
    {
        if (string.IsNullOrEmpty(cipherTextBase64))
            return string.Empty;

        var key = GetKeyAsync().GetAwaiter().GetResult();
        var fullCipher = Convert.FromBase64String(cipherTextBase64);

        if (fullCipher.Length < NonceSize + 1 + TagSize)
            throw new CryptographicException("Invalid cipher text: too short");

        var nonce = new byte[NonceSize];
        var cipherTextLength = fullCipher.Length - NonceSize - TagSize;
        var cipherText = new byte[cipherTextLength];
        var tag = new byte[TagSize];

        Buffer.BlockCopy(fullCipher, 0, nonce, 0, NonceSize);
        Buffer.BlockCopy(fullCipher, NonceSize, cipherText, 0, cipherTextLength);
        Buffer.BlockCopy(fullCipher, NonceSize + cipherTextLength, tag, 0, TagSize);

        var plainBytes = new byte[cipherTextLength];

        using var aesGcm = new AesGcm(key, TagSize);
        aesGcm.Decrypt(nonce, cipherText, tag, plainBytes);

        return Encoding.UTF8.GetString(plainBytes);
    }
}
