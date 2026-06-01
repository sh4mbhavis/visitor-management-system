using System;

namespace VisitorManagement.Application.DTOs.Visit;

public sealed class VisitDto
{
    public int VisitId { get; set; }
    public int VisitorId { get; set; }
    public string VisitorFullName { get; set; } = null!;
    public int HostUserId { get; set; }
    public string HostUserFullName { get; set; } = null!;
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = null!;
    public string? Purpose { get; set; }
    public DateTime? VisitDate { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public int VisitStatusId { get; set; }
    public string VisitStatusName { get; set; } = null!;
    public string? GatePassNumber { get; set; }
    public string? QRCodePath { get; set; }
    public string? ApprovalStatus { get; set; }
    public int? ApprovedBy { get; set; }
    public string? ApprovedByUserName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}