using System;

namespace VisitorManagement.Application.DTOs.User;

public sealed class UserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Mobile { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public int? DepartmentId { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
}