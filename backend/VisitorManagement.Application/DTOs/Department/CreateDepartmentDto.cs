namespace VisitorManagement.Application.DTOs.Department;

public sealed class CreateDepartmentDto
{
    public string DepartmentName { get; set; } = null!;
    public string? DepartmentCode { get; set; }
}