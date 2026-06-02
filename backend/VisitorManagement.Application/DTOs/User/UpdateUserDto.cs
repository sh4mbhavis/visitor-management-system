using System.ComponentModel.DataAnnotations;

namespace VisitorManagement.Application.DTOs.User;

public sealed class UpdateUserDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public string FullName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    public string? Mobile { get; set; }

    [Required]
    public int RoleId { get; set; }

    public int? DepartmentId { get; set; }

    public bool IsActive { get; set; }
}