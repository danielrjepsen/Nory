using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class EventRepository : IEventRepository
{
    private readonly ApplicationDbContext _context;

    public EventRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Event>> GetEventsAsync()
    {
        var dbModels = await _context.Events.OrderByDescending(e => e.CreatedAt).ToListAsync();

        return dbModels.MapToDomain();
    }

    public async Task<Event?> GetEventByIdAsync(Guid id)
    {
        var dbModel = await _context.Events.FindAsync(id);
        return dbModel?.MapToDomain();
    }

    public async Task<Event> AddAsync(Event eventEntity)
    {
        var dbModel = eventEntity.MapToDbModel();
        _context.Events.Add(dbModel);
        return eventEntity;
    }

    public async Task UpdateAsync(Event eventEntity)
    {
        var existingDbModel = await _context.Events.FindAsync(eventEntity.Id);
        if (existingDbModel != null)
        {
            var updatedDbModel = eventEntity.MapToDbModel();

            existingDbModel.Name = updatedDbModel.Name;
            existingDbModel.Description = updatedDbModel.Description;
            existingDbModel.StartsAt = updatedDbModel.StartsAt;
            existingDbModel.EndsAt = updatedDbModel.EndsAt;
            existingDbModel.Status = updatedDbModel.Status;
            existingDbModel.HasContent = updatedDbModel.HasContent;
            existingDbModel.UpdatedAt = updatedDbModel.UpdatedAt;

            _context.Events.Update(existingDbModel);
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var dbModel = await _context.Events.FindAsync(id);
        if (dbModel != null)
        {
            _context.Events.Remove(dbModel);
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Events.AnyAsync(e => e.Id == id);
    }

    public async Task<int> CountAsync()
    {
        return await _context.Events.CountAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
