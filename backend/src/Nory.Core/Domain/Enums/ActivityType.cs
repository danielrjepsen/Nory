namespace Nory.Core.Domain.Enums;

public enum ActivityType
{
    // photo
    PhotoUploaded,
    PhotoViewed,
    PhotoDownloaded,
    PhotoLiked,
    PhotoShared,

    // app
    GuestAppOpened,
    AppOpened,
    GalleryViewed,
    SlideshowViewed,

    // event
    QrCodeScanned,
    EventJoined,
    EventLeft,

    // guest
    GuestRegistered,
    ConsentUpdated,

    // guestbook
    GuestbookEntryAdded,
    GuestbookViewed,

    // general
    PageViewed,
    SessionStarted,
    SessionEnded,
}
