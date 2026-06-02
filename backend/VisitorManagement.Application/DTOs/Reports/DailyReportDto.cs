using System;

namespace VisitorManagement.Application.DTOs.Reports;

public sealed class DailyReportDto
{
    public DateTime ReportDate { get; set; }
    public int TotalVisitors { get; set; }
    public int TotalVisits { get; set; }
    public int ApprovedVisits { get; set; }
    public int RejectedVisits { get; set; }
    public int ActiveVisits { get; set; }
}