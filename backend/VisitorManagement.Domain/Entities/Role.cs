using System;
using System.Collections.Generic;

namespace VisitorManagement.Domain.Entities;

public sealed class Role
{
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}