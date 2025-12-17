using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class AttendeeMappingExtensions
{
    public static Attendee MapToDomain(this AttendeeDbModel dbModel)
    {
        return new Attendee(
            id: dbModel.Id,
            eventId: dbModel.EventId,
            name: dbModel.Name,
            email: dbModel.Email,
            hasPhotoRevealConsent: dbModel.HasPhotoRevealConsent,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt,
            deletedAt: dbModel.DeletedAt
        );
    }

    public static AttendeeDbModel MapToDbModel(this Attendee attendee)
    {
        return new AttendeeDbModel
        {
            Id = attendee.Id,
            EventId = attendee.EventId,
            Name = attendee.Name,
            Email = attendee.Email,
            HasPhotoRevealConsent = attendee.HasPhotoRevealConsent,
            CreatedAt = attendee.CreatedAt,
            UpdatedAt = attendee.UpdatedAt,
            DeletedAt = attendee.DeletedAt,
        };
    }

    public static void UpdateFrom(this AttendeeDbModel dbModel, Attendee attendee)
    {
        dbModel.Name = attendee.Name;
        dbModel.Email = attendee.Email;
        dbModel.HasPhotoRevealConsent = attendee.HasPhotoRevealConsent;
        dbModel.UpdatedAt = attendee.UpdatedAt;
        dbModel.DeletedAt = attendee.DeletedAt;
    }

    public static IReadOnlyList<Attendee> MapToDomain(this IEnumerable<AttendeeDbModel> dbModels)
    {
        return dbModels.Select(db => db.MapToDomain()).ToList();
    }
}
