using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Reports;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;

namespace VisitorManagement.Infrastructure.Services;

public sealed class ReportService : IReportService
{
    private readonly ApplicationDbContext _dbContext;

    public ReportService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DailyReportDto> GetDailyReportAsync(DateTime reportDate)
    {
        var reportDateOnly = reportDate.Date;

        var totalVisits = await _dbContext.Visits
            .AsNoTracking()
            .CountAsync(v => v.VisitDate.HasValue && v.VisitDate.Value.Date == reportDateOnly);

        var totalVisitors = await _dbContext.Visits
            .AsNoTracking()
            .Where(v => v.VisitDate.HasValue && v.VisitDate.Value.Date == reportDateOnly)
            .Select(v => v.VisitorId)
            .Distinct()
            .CountAsync();

        var approvedVisits = await _dbContext.Approvals
            .AsNoTracking()
            .CountAsync(a => a.Status == "Approved"
                             && a.ActionTime.HasValue
                             && a.ActionTime.Value.Date == reportDateOnly);

        var rejectedVisits = await _dbContext.Approvals
            .AsNoTracking()
            .CountAsync(a => a.Status == "Rejected"
                             && a.ActionTime.HasValue
                             && a.ActionTime.Value.Date == reportDateOnly);

        var activeVisits = await _dbContext.Visits
            .AsNoTracking()
            .CountAsync(v => v.CheckInTime.HasValue && !v.CheckOutTime.HasValue);

        return new DailyReportDto
        {
            ReportDate = reportDateOnly,
            TotalVisitors = totalVisitors,
            TotalVisits = totalVisits,
            ApprovedVisits = approvedVisits,
            RejectedVisits = rejectedVisits,
            ActiveVisits = activeVisits
        };
    }

    public async Task<MonthlyReportDto> GetMonthlyReportAsync(int year, int month)
    {
        var totalVisits = await _dbContext.Visits
            .AsNoTracking()
            .CountAsync(v => v.VisitDate.HasValue
                             && v.VisitDate.Value.Year == year
                             && v.VisitDate.Value.Month == month);

        var totalVisitors = await _dbContext.Visits
            .AsNoTracking()
            .Where(v => v.VisitDate.HasValue
                        && v.VisitDate.Value.Year == year
                        && v.VisitDate.Value.Month == month)
            .Select(v => v.VisitorId)
            .Distinct()
            .CountAsync();

        var approvedVisits = await _dbContext.Approvals
            .AsNoTracking()
            .CountAsync(a => a.Status == "Approved"
                             && a.ActionTime.HasValue
                             && a.ActionTime.Value.Year == year
                             && a.ActionTime.Value.Month == month);

        var rejectedVisits = await _dbContext.Approvals
            .AsNoTracking()
            .CountAsync(a => a.Status == "Rejected"
                             && a.ActionTime.HasValue
                             && a.ActionTime.Value.Year == year
                             && a.ActionTime.Value.Month == month);

        return new MonthlyReportDto
        {
            Year = year,
            Month = month,
            TotalVisitors = totalVisitors,
            TotalVisits = totalVisits,
            ApprovedVisits = approvedVisits,
            RejectedVisits = rejectedVisits
        };
    }

    public async Task<IEnumerable<VisitorHistoryDto>> GetVisitorHistoryAsync(int visitorId)
    {
        return await _dbContext.Visits
            .AsNoTracking()
            .Where(v => v.VisitorId == visitorId)
            .Include(v => v.Visitor)
            .Include(v => v.HostUser)
            .Include(v => v.Department)
            .OrderByDescending(v => v.VisitDate)
            .Select(v => new VisitorHistoryDto
            {
                VisitId = v.VisitId,
                VisitorName = v.Visitor.FullName,
                HostName = v.HostUser.FullName,
                DepartmentName = v.Department.DepartmentName,
                Purpose = v.Purpose,
                VisitDate = v.VisitDate,
                ApprovalStatus = v.ApprovalStatus ?? string.Empty
            })
            .ToListAsync();
    }
}