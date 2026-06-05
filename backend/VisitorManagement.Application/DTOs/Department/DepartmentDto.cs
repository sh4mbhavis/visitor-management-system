namespace VisitorManagement.Application.DTOs.Department;

public sealed class DepartmentDto
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = null!;
    public string? DepartmentCode { get; set; }
}