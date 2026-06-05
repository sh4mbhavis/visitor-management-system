using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Department;
using VisitorManagement.Application.Interfaces;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public sealed class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentsController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
    {
        var departments = await _departmentService.GetAllAsync();
        return Ok(departments);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DepartmentDto>> GetById(int id)
    {
        var department = await _departmentService.GetByIdAsync(id);

        if (department is null)
        {
            return NotFound();
        }

        return Ok(department);
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> Create(
        [FromBody] CreateDepartmentDto dto)
    {
        var department = await _departmentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = department.DepartmentId },
            department);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<DepartmentDto>> Update(
        int id,
        [FromBody] UpdateDepartmentDto dto)
    {
        if (id != dto.DepartmentId)
        {
            return BadRequest("Department ID mismatch.");
        }

        try
        {
            var updatedDepartment =
                await _departmentService.UpdateAsync(dto);

            return Ok(updatedDepartment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _departmentService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}