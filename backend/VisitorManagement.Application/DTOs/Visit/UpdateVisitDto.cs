namespace VisitorManagement.Application.DTOs.Visit;

public sealed class UpdateVisitDto
{
    public int VisitId { get; set; }
    public int VisitorId { get; set; }
    public int HostUserId { get; set; }
    public int DepartmentId { get; set; }
    public string? Purpose { get; set; }
    public DateTime? VisitDate { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public int VisitStatusId { get; set; }
    public string? ApprovalStatus { get; set; }
}