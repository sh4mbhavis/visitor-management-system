using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.User;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Infrastructure.Data;
using VisitorManagement.Domain.Entities;

namespace VisitorManagement.Infrastructure.Services;

public sealed class UserService : IUserService
{
    private readonly ApplicationDbContext _dbContext;

    public UserService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .ToListAsync();

        return users.Select(MapToDto);
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == id);

        return user is null ? null : MapToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Mobile = dto.Mobile,
            PasswordHash = dto.Password,
            RoleId = dto.RoleId,
            DepartmentId = dto.DepartmentId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
        await _dbContext.Entry(user)
    .Reference(u => u.Role)
    .LoadAsync();

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateAsync(UpdateUserDto dto)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

        if (user is null)
        {
            throw new KeyNotFoundException($"User with id {dto.UserId} was not found.");
        }

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Mobile = dto.Mobile;
        user.RoleId = dto.RoleId;
        user.DepartmentId = dto.DepartmentId;
        user.IsActive = dto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        await _dbContext.Entry(user)
    .Reference(u => u.Role)
    .LoadAsync();

        return MapToDto(user);
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == id);

        if (user is null)
        {
            throw new KeyNotFoundException($"User with id {id} was not found.");
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            Mobile = user.Mobile,
            RoleId = user.RoleId,
            RoleName = user.Role?.RoleName ?? string.Empty,
            DepartmentId = user.DepartmentId,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt
        };
    }
}