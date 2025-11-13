interface IEventRepository
{
    Task<List<Event>> GetEventsAsync();
    Task<Event?> GetEventByIdAsync(Guid id);
    Task<Event> AddAsync(Event event);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> CountAsync();
}