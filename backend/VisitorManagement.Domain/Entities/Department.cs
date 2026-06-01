using System;
using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class Department
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = null!;
    public string? DepartmentCode { get; set; }
    public DateTime? CreatedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Visit> Visits { get; set; } = new List<Visit>();
}