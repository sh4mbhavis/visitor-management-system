using System;
using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class Visitor
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
    public bool IsBlacklisted { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}