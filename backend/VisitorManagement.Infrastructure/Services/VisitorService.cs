using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Visitor;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Services;

public sealed class VisitorService : IVisitorService
{
    private readonly ApplicationDbContext _dbContext;

    public VisitorService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<VisitorDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Visitors
            .AsNoTracking()
            .Where(v => !v.IsDeleted)
            .Select(v => MapToDto(v))
            .ToListAsync(cancellationToken);
    }

    public async Task<VisitorDto?> GetByIdAsync(int visitorId, CancellationToken cancellationToken = default)
    {
        var visitor = await _dbContext.Visitors
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.VisitorId == visitorId && !v.IsDeleted, cancellationToken);

        return visitor is null ? null : MapToDto(visitor);
    }

    public async Task<VisitorDto> CreateAsync(CreateVisitorDto dto, CancellationToken cancellationToken = default)
    {
        var visitor = new Visitor
        {
            FullName = dto.FullName,
            Mobile = dto.Mobile,
            Email = dto.Email,
            Gender = dto.Gender,
            Address = dto.Address,
            IDProofType = dto.IDProofType,
            IDProofNumber = dto.IDProofNumber,
            PhotoPath = dto.PhotoPath,
            FaceEncoding = dto.FaceEncoding,
            IsBlacklisted = false,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Visitors.AddAsync(visitor, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToDto(visitor);
    }

    public async Task<VisitorDto> UpdateAsync(UpdateVisitorDto dto, CancellationToken cancellationToken = default)
    {
        var visitor = await _dbContext.Visitors
            .FirstOrDefaultAsync(v => v.VisitorId == dto.VisitorId && !v.IsDeleted, cancellationToken);

        if (visitor is null)
        {
            throw new InvalidOperationException($"Visitor with id {dto.VisitorId} was not found.");
        }

        visitor.FullName = dto.FullName;
        visitor.Mobile = dto.Mobile;
        visitor.Email = dto.Email;
        visitor.Gender = dto.Gender;
        visitor.Address = dto.Address;
        visitor.IDProofType = dto.IDProofType;
        visitor.IDProofNumber = dto.IDProofNumber;
        visitor.PhotoPath = dto.PhotoPath;
        visitor.FaceEncoding = dto.FaceEncoding;
        visitor.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visitors.Update(visitor);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToDto(visitor);
    }

    public async Task DeleteAsync(int visitorId, CancellationToken cancellationToken = default)
    {
        var visitor = await _dbContext.Visitors
            .FirstOrDefaultAsync(v => v.VisitorId == visitorId && !v.IsDeleted, cancellationToken);

        if (visitor is null)
        {
            throw new InvalidOperationException($"Visitor with id {visitorId} was not found.");
        }

       visitor.IsDeleted = true;
       visitor.DeletedAt = DateTime.UtcNow;
    visitor.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visitors.Update(visitor);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static VisitorDto MapToDto(Visitor visitor)
    {
        return new VisitorDto
        {
            VisitorId = visitor.VisitorId,
            FullName = visitor.FullName,
            Mobile = visitor.Mobile,
            Email = visitor.Email,
            Gender = visitor.Gender,
            Address = visitor.Address,
            IDProofType = visitor.IDProofType,
            IDProofNumber = visitor.IDProofNumber,
            PhotoPath = visitor.PhotoPath,
            FaceEncoding = visitor.FaceEncoding,
            IsBlacklisted = visitor.IsBlacklisted,
            CreatedAt = visitor.CreatedAt,
            UpdatedAt = visitor.UpdatedAt
        };
    }
}