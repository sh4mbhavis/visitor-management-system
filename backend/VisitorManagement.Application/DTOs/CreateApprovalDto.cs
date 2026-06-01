namespace VisitorManagement.Application.DTOs.Approval;

public sealed class CreateApprovalDto
{
    public int VisitId { get; set; }
    public int ApproverUserId { get; set; }
    public string? Remarks { get; set; }
}