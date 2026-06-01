using System;
using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class Visit
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
    public string? GatePassNumber { get; set; }
    public string? QRCodePath { get; set; }
    public string? ApprovalStatus { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Visitor Visitor { get; set; } = null!;
    public User HostUser { get; set; } = null!;
    public Department Department { get; set; } = null!;
    public VisitStatus VisitStatus { get; set; } = null!;
    public User? ApprovedByUser { get; set; }
    public User? CreatedByUser { get; set; }
    public ICollection<Approval> Approvals { get; set; }
    = new List<Approval>();
}