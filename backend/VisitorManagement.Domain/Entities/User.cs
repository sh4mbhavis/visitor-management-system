using System;
using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Mobile { get; set; }
    public string PasswordHash { get; set; } = null!;
    public int RoleId { get; set; }
    public int? DepartmentId { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public Role Role { get; set; } = null!;
    public Department? Department { get; set; }

    public ICollection<Visit> HostedVisits { get; set; } = new List<Visit>();
    public ICollection<Visit> ApprovedVisits { get; set; } = new List<Visit>();
    public ICollection<Visit> CreatedVisits { get; set; } = new List<Visit>();
    public ICollection<Approval> Approvals { get; set; }
    = new List<Approval>();
}