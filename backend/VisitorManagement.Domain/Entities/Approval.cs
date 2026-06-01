using System;

namespace VisitorManagement.Domain.Entities;

public sealed class Approval
{
    public int ApprovalId { get; set; }

    public int VisitId { get; set; }
    public Visit Visit { get; set; } = null!;

    public int ApproverUserId { get; set; }
    public User ApproverUser { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? Remarks { get; set; }

    public DateTime? ActionTime { get; set; }
}