using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VisitorManagement.Application.DTOs.Auth;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Services;

public sealed class AuthService : IAuthService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .Include(u => u.Role)
           .FirstOrDefaultAsync(
    u => u.Email.ToLower() == dto.Email.ToLower(),
    cancellationToken);

        if (user is null || !user.IsActive || !VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.RoleName,
            ExpiresAt = DateTime.UtcNow.AddMinutes(GetJwtExpiryMinutes())
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT issuer is not configured.");
        var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT audience is not configured.");
        var expiryMinutes = GetJwtExpiryMinutes();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.RoleName)
        };

        var keyBytes = Encoding.UTF8.GetBytes(key);
        var credentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private int GetJwtExpiryMinutes()
    {
        var expiryValue = _configuration["Jwt:ExpiryMinutes"];
        return int.TryParse(expiryValue, out var expiryMinutes) && expiryMinutes > 0
            ? expiryMinutes
            : 60;
    }

    private static bool VerifyPassword(string password, string passwordHash)
{
    if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(passwordHash))
    {
        return false;
    }

    return string.Equals(password, passwordHash, StringComparison.Ordinal);
}

    
}