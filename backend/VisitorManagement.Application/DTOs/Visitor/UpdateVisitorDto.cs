using System;

namespace VisitorManagement.Application.DTOs.Visitor;

public sealed class UpdateVisitorDto
{
    public int VisitorId { get; set; }
    public string FullName { get; set; } = null!;
    public string Mobile { get; set; } = null!;
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? IDProofType { get; set; }
    public string? IDProofNumber { get; set; }
    public string? PhotoPath { get; set; }
    public string? FaceEncoding { get; set; }
}