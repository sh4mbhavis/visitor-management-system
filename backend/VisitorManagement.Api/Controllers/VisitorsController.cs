using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Visitor;
using VisitorManagement.Application.Interfaces;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class VisitorsController : ControllerBase
{
    private readonly IVisitorService _visitorService;

    public VisitorsController(IVisitorService visitorService)
    {
        _visitorService = visitorService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VisitorDto>>> GetAll()
    {
        var visitors = await _visitorService.GetAllAsync();
        return Ok(visitors);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VisitorDto>> GetById(int id)
    {
        var visitor = await _visitorService.GetByIdAsync(id);

        if (visitor is null)
        {
            return NotFound();
        }

        return Ok(visitor);
    }

    [HttpPost]
    public async Task<ActionResult<VisitorDto>> Create([FromBody] CreateVisitorDto dto)
    {
        var visitor = await _visitorService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = visitor.VisitorId }, visitor);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<VisitorDto>> Update(int id, [FromBody] UpdateVisitorDto dto)
    {
        if (id != dto.VisitorId)
        {
            return BadRequest("Visitor ID mismatch.");
        }

        var existingVisitor = await _visitorService.GetByIdAsync(id);
        if (existingVisitor is null)
        {
            return NotFound();
        }

        var updatedVisitor = await _visitorService.UpdateAsync(dto);
        return Ok(updatedVisitor);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingVisitor = await _visitorService.GetByIdAsync(id);
        if (existingVisitor is null)
        {
            return NotFound();
        }

        await _visitorService.DeleteAsync(id);
        return NoContent();
    }
}