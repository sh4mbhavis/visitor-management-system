using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Approval;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Services;

public sealed class ApprovalService : IApprovalService
{
    private readonly ApplicationDbContext _dbContext;

    public ApprovalService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApprovalDto> ApproveAsync(CreateApprovalDto dto, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == dto.VisitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
            throw new InvalidOperationException($"Visit {dto.VisitId} not found.");

        var approval = new Approval
        {
            VisitId = dto.VisitId,
            ApproverUserId = dto.ApproverUserId,
            Status = "Approved",
            Remarks = dto.Remarks,
            ActionTime = DateTime.UtcNow
        };

        await _dbContext.Set<Approval>().AddAsync(approval, cancellationToken);

        visit.ApprovalStatus = "Approved";
        visit.ApprovedBy = dto.ApproverUserId;
        visit.ApprovedAt = DateTime.UtcNow;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);

        await _dbContext.SaveChangesAsync(cancellationToken);

        // load approver user for DTO mapping
        await _dbContext.Entry(approval).Reference(a => a.ApproverUser).LoadAsync(cancellationToken);

        return MapToDto(approval);
    }

    public async Task<ApprovalDto> RejectAsync(CreateApprovalDto dto, CancellationToken cancellationToken = default)
    {
        var visit = await _dbContext.Visits
            .FirstOrDefaultAsync(v => v.VisitId == dto.VisitId && !v.IsDeleted, cancellationToken);

        if (visit is null)
            throw new InvalidOperationException($"Visit {dto.VisitId} not found.");

        var approval = new Approval
        {
            VisitId = dto.VisitId,
            ApproverUserId = dto.ApproverUserId,
            Status = "Rejected",
            Remarks = dto.Remarks,
            ActionTime = DateTime.UtcNow
        };

        await _dbContext.Set<Approval>().AddAsync(approval, cancellationToken);

        visit.ApprovalStatus = "Rejected";
        visit.ApprovedBy = dto.ApproverUserId;
        visit.ApprovedAt = DateTime.UtcNow;
        visit.UpdatedAt = DateTime.UtcNow;

        _dbContext.Visits.Update(visit);

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _dbContext.Entry(approval).Reference(a => a.ApproverUser).LoadAsync(cancellationToken);

        return MapToDto(approval);
    }

    public async Task<IEnumerable<ApprovalDto>> GetByVisitIdAsync(int visitId, CancellationToken cancellationToken = default)
    {
        var approvals = await _dbContext.Set<Approval>()
            .AsNoTracking()
            .Where(a => a.VisitId == visitId)
            .Include(a => a.ApproverUser)
            .OrderByDescending(a => a.ActionTime)
            .ToListAsync(cancellationToken);

        return approvals.Select(MapToDto).ToList();
    }

   private static ApprovalDto MapToDto(Approval approval)
{
    return new ApprovalDto
    {
        ApprovalId = approval.ApprovalId,
        VisitId = approval.VisitId,
        ApproverUserId = approval.ApproverUserId,
        ApproverUserName = approval.ApproverUser?.FullName,
        Status = approval.Status,
        Remarks = approval.Remarks,
        ActionTime = approval.ActionTime
    };
}
}