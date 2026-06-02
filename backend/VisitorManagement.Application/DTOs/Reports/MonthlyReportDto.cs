namespace VisitorManagement.Application.DTOs.Reports;

public sealed class MonthlyReportDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int TotalVisitors { get; set; }
    public int TotalVisits { get; set; }
    public int ApprovedVisits { get; set; }
    public int RejectedVisits { get; set; }
}