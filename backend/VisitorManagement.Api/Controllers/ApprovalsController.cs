using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Approval;
using VisitorManagement.Application.Interfaces;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ApprovalsController : ControllerBase
{
    private readonly IApprovalService _approvalService;

    public ApprovalsController(IApprovalService approvalService)
    {
        _approvalService = approvalService;
    }

    [HttpGet("visit/{visitId:int}")]
    public async Task<ActionResult<IEnumerable<ApprovalDto>>> GetByVisitId(int visitId)
    {
        var approvals = await _approvalService.GetByVisitIdAsync(visitId);
        return Ok(approvals);
    }

    [HttpPost("{visitId:int}/approve")]
    public async Task<ActionResult<ApprovalDto>> Approve(int visitId, [FromBody] CreateApprovalDto dto)
    {
        if (visitId != dto.VisitId) return BadRequest("Visit ID mismatch.");
        var approval = await _approvalService.ApproveAsync(dto);
        return CreatedAtAction(nameof(GetByVisitId), new { visitId = dto.VisitId }, approval);
    }

    [HttpPost("{visitId:int}/reject")]
    public async Task<ActionResult<ApprovalDto>> Reject(int visitId, [FromBody] CreateApprovalDto dto)
    {
        if (visitId != dto.VisitId) return BadRequest("Visit ID mismatch.");
        var approval = await _approvalService.RejectAsync(dto);
        return CreatedAtAction(nameof(GetByVisitId), new { visitId = dto.VisitId }, approval);
    }
}