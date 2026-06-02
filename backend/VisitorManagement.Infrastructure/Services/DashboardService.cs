using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Dashboard;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;

namespace VisitorManagement.Infrastructure.Services;

public sealed class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _dbContext;

    public DashboardService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var totalVisitors = await _dbContext.Visitors
            .CountAsync(v => !v.IsDeleted);

        var totalVisits = await _dbContext.Visits
            .CountAsync(v => !v.IsDeleted);

        var activeVisits = await _dbContext.Visits
            .CountAsync(v => !v.IsDeleted && v.CheckInTime != null && v.CheckOutTime == null);

        var approvedVisits = await _dbContext.Approvals
            .CountAsync(a => a.Status == "Approved");

        var rejectedVisits = await _dbContext.Approvals
            .CountAsync(a => a.Status == "Rejected");

        var pendingApprovals = await _dbContext.Visits
            .CountAsync(v => v.ApprovalStatus == "Pending" && !v.IsDeleted);

        return new DashboardStatsDto
        {
            TotalVisitors = totalVisitors,
            TotalVisits = totalVisits,
            ActiveVisits = activeVisits,
            ApprovedVisits = approvedVisits,
            RejectedVisits = rejectedVisits,
            PendingApprovals = pendingApprovals
        };
    }
}