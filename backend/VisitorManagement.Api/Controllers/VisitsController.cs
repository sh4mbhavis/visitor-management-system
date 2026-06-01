using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Visit;
using VisitorManagement.Application.Interfaces;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class VisitsController : ControllerBase
{
    private readonly IVisitService _visitService;

    public VisitsController(IVisitService visitService)
    {
        _visitService = visitService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VisitDto>>> GetAll()
    {
        var visits = await _visitService.GetAllAsync();
        return Ok(visits);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VisitDto>> GetById(int id)
    {
        var visit = await _visitService.GetByIdAsync(id);

        if (visit is null)
        {
            return NotFound();
        }

        return Ok(visit);
    }

    [HttpPost]
    public async Task<ActionResult<VisitDto>> Create([FromBody] CreateVisitDto dto)
    {
        var visit = await _visitService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = visit.VisitId }, visit);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<VisitDto>> Update(int id, [FromBody] UpdateVisitDto dto)
    {
        if (id != dto.VisitId)
        {
            return BadRequest("Visit ID mismatch.");
        }

        var existingVisit = await _visitService.GetByIdAsync(id);
        if (existingVisit is null)
        {
            return NotFound();
        }

        var updatedVisit = await _visitService.UpdateAsync(dto);
        return Ok(updatedVisit);
    }

    [HttpPost("{id:int}/check-in")]
    public async Task<IActionResult> CheckIn(int id)
    {
        var existingVisit = await _visitService.GetByIdAsync(id);
        if (existingVisit is null)
        {
            return NotFound();
        }

        await _visitService.CheckInAsync(id);
        return Ok(new { message = "Visitor checked in successfully." });
    }

    [HttpPost("{id:int}/check-out")]
    public async Task<IActionResult> CheckOut(int id)
    {
        var existingVisit = await _visitService.GetByIdAsync(id);
        if (existingVisit is null)
        {
            return NotFound();
        }

        await _visitService.CheckOutAsync(id);
        return Ok(new { message = "Visitor checked out successfully." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingVisit = await _visitService.GetByIdAsync(id);
        if (existingVisit is null)
        {
            return NotFound();
        }

        await _visitService.DeleteAsync(id);
        return NoContent();
    }
}