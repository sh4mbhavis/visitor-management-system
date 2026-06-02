using System;

namespace VisitorManagement.Application.DTOs.Reports;

public sealed class VisitorHistoryDto
{
    public int VisitId { get; set; }
    public string VisitorName { get; set; } = null!;
    public string HostName { get; set; } = null!;
    public string DepartmentName { get; set; } = null!;
    public string? Purpose { get; set; }
    public DateTime? VisitDate { get; set; }
    public string ApprovalStatus { get; set; } = null!;
}