using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Visit;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Services;

public sealed class VisitService : IVisitService
{
    private readonly ApplicationDbContext _dbContext;

    public VisitService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<VisitDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Visits
            .AsNoTracking()
            .Where(v => !v.IsDeleted)
            .Include(v => v.Visitor)
            .Include(v => v.HostUser)
            .Include(v => v.Department)
            .Include(v => v.VisitStatus)
            .Include(v => v.ApprovedByUser)
            .Select(v => MapToDto(v))
            .ToListAsync(cancellationToken);
    }

    public async Task<VisitDto?> GetByIdAsync(int visitId, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .AsNoTracking()
            .Include(v => v.Visitor)
            .Include(v => v.HostUser)
            .Include(v => v.Department)
            .Include(v => v.VisitStatus)
            .Include(v => v.ApprovedByUser)
            .FirstOrDefaultAsync(v => v.VisitId == visitId && !v.IsDeleted, cancellationToken);

        return visit is null ? null : MapToDto(visit);
    }

    public async Task<VisitDto> CreateAsync(CreateVisitDto dto, CancellationToken cancellationToken = default)
    {
        var visit = new Visit
        {
            VisitorId = dto.VisitorId,
            HostUserId = dto.HostUserId,
            DepartmentId = dto.DepartmentId,
            Purpose = dto.Purpose,
            VisitDate = dto.VisitDate ?? DateTime.UtcNow,
            VisitStatusId = 1,
            ApprovalStatus = "Pending",
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Visits.AddAsync(visit, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var createdVisit = await GetByIdAsync(visit.VisitId, cancellationToken);
        return createdVisit!;
    }

    public async Task<VisitDto> UpdateAsync(UpdateVisitDto dto, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == dto.VisitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
        {
            throw new InvalidOperationException($"Visit with id {dto.VisitId} was not found.");
        }

        visit.VisitorId = dto.VisitorId;
        visit.HostUserId = dto.HostUserId;
        visit.DepartmentId = dto.DepartmentId;
        visit.Purpose = dto.Purpose;
        visit.VisitDate = dto.VisitDate;
        visit.CheckInTime = dto.CheckInTime;
        visit.CheckOutTime = dto.CheckOutTime;
        visit.VisitStatusId = dto.VisitStatusId;
        visit.ApprovalStatus = dto.ApprovalStatus;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var updatedVisit = await GetByIdAsync(visit.VisitId, cancellationToken);
        return updatedVisit!;
    }

    public async Task CheckInAsync(int visitId, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == visitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
        {
            throw new InvalidOperationException($"Visit with id {visitId} was not found.");
        }

        visit.CheckInTime = DateTime.UtcNow;
        visit.VisitStatusId = 2;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task CheckOutAsync(int visitId, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == visitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
        {
            throw new InvalidOperationException($"Visit with id {visitId} was not found.");
        }

        visit.CheckOutTime = DateTime.UtcNow;
        visit.VisitStatusId = 3;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int visitId, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == visitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
        {
            throw new InvalidOperationException($"Visit with id {visitId} was not found.");
        }

        visit.IsDeleted = true;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static VisitDto MapToDto(Visit visit)
    {
        return new VisitDto
        {
            VisitId = visit.VisitId,
            VisitorId = visit.VisitorId,
            VisitorFullName = visit.Visitor.FullName,
            HostUserId = visit.HostUserId,
            HostUserFullName = visit.HostUser.FullName,
            DepartmentId = visit.DepartmentId,
            DepartmentName = visit.Department.DepartmentName,
            Purpose = visit.Purpose,
            VisitDate = visit.VisitDate,
            CheckInTime = visit.CheckInTime,
            CheckOutTime = visit.CheckOutTime,
            VisitStatusId = visit.VisitStatusId,
            VisitStatusName = visit.VisitStatus.StatusName,
            GatePassNumber = visit.GatePassNumber,
            QRCodePath = visit.QRCodePath,
            ApprovalStatus = visit.ApprovalStatus,
            ApprovedBy = visit.ApprovedBy,
            ApprovedByUserName = visit.ApprovedByUser?.FullName,
            ApprovedAt = visit.ApprovedAt,
            CreatedAt = visit.CreatedAt,
            UpdatedAt = visit.UpdatedAt
        };
    }
}