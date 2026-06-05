using Microsoft.EntityFrameworkCore;
using VisitorManagement.Application.DTOs.Department;
using VisitorManagement.Application.Interfaces;
using VisitorManagement.Domain.Entities;
using VisitorManagement.Infrastructure.Data;

namespace VisitorManagement.Infrastructure.Services;

public sealed class DepartmentService : IDepartmentService
{
    private readonly ApplicationDbContext _dbContext;

    public DepartmentService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var departments = await _dbContext.Departments
            .AsNoTracking()
            .ToListAsync();

        return departments.Select(MapToDto);
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        var department = await _dbContext.Departments
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DepartmentId == id);

        return department is null ? null : MapToDto(department);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var department = new Department
        {
            DepartmentName = dto.DepartmentName,
            DepartmentCode = dto.DepartmentCode,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Departments.AddAsync(department);
        await _dbContext.SaveChangesAsync();

        return MapToDto(department);
    }

    public async Task<DepartmentDto> UpdateAsync(UpdateDepartmentDto dto)
    {
        var department = await _dbContext.Departments
            .FirstOrDefaultAsync(d => d.DepartmentId == dto.DepartmentId);

        if (department is null)
        {
            throw new KeyNotFoundException(
                $"Department with id {dto.DepartmentId} was not found.");
        }

        department.DepartmentName = dto.DepartmentName;
        department.DepartmentCode = dto.DepartmentCode;

        _dbContext.Departments.Update(department);
        await _dbContext.SaveChangesAsync();

        return MapToDto(department);
    }

    public async Task DeleteAsync(int id)
    {
        var department = await _dbContext.Departments
            .FirstOrDefaultAsync(d => d.DepartmentId == id);

        if (department is null)
        {
            throw new KeyNotFoundException(
                $"Department with id {id} was not found.");
        }

        _dbContext.Departments.Remove(department);
        await _dbContext.SaveChangesAsync();
    }

    private static DepartmentDto MapToDto(Department department)
    {
        return new DepartmentDto
        {
            DepartmentId = department.DepartmentId,
            DepartmentName = department.DepartmentName,
            DepartmentCode = department.DepartmentCode
        };
    }
}