using VisitorManagement.Application.DTOs.Department;

namespace VisitorManagement.Application.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto?> GetByIdAsync(int id);
    Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);
    Task<DepartmentDto> UpdateAsync(UpdateDepartmentDto dto);
    Task DeleteAsync(int id);
}