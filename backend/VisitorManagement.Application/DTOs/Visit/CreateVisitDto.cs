namespace VisitorManagement.Application.DTOs.Visit;

public sealed class CreateVisitDto
{
    public int VisitorId { get; set; }
    public int HostUserId { get; set; }
    public int DepartmentId { get; set; }
    public string? Purpose { get; set; }
    public DateTime? VisitDate { get; set; }
}