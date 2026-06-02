using System.ComponentModel.DataAnnotations;

namespace VisitorManagement.Application.DTOs.Auth;

public sealed class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}