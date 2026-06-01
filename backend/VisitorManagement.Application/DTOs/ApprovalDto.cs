using System;

namespace VisitorManagement.Application.DTOs.Approval;

public sealed class ApprovalDto
{
    public int ApprovalId { get; set; }
    public int VisitId { get; set; }
    public int ApproverUserId { get; set; }

    // Approver user's display name
    public string? ApproverUserName { get; set; }

    public string Status { get; set; } = null!;
    public string? Remarks { get; set; }
    public DateTime? ActionTime { get; set; }
}