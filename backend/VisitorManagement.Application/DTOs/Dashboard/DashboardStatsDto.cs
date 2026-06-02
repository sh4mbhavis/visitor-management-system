namespace VisitorManagement.Application.DTOs.Dashboard;

public sealed class DashboardStatsDto
{
    public int TotalVisitors { get; set; }
    public int TotalVisits { get; set; }
    public int ActiveVisits { get; set; }
    public int ApprovedVisits { get; set; }
    public int RejectedVisits { get; set; }
    public int PendingApprovals { get; set; }
}