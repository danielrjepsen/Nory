namespace Nory.Application.DTOs.Setup;

public class SetupStatusDto
{
    public bool IsConfigured { get; set; }
    public bool HasAdminUser { get; set; }
    public bool DatabaseConnected { get; set; }
    public bool StorageConfigured { get; set; }
}
