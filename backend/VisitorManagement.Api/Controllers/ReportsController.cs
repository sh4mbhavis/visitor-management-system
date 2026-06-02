using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Reports;
using VisitorManagement.Application.Interfaces;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Faculty")]
public sealed class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("daily")]
public async Task<ActionResult<DailyReportDto>> GetDailyReport([FromQuery] DateTime date)
{
    var stats = await _reportService.GetDailyReportAsync(date);
    return Ok(stats);
}

    [HttpGet("monthly")]
    public async Task<ActionResult<MonthlyReportDto>> GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
    {
        var report = await _reportService.GetMonthlyReportAsync(year, month);
        return Ok(report);
    }

    [HttpGet("visitor-history/{visitorId:int}")]
    public async Task<ActionResult<IEnumerable<VisitorHistoryDto>>> GetVisitorHistory(int visitorId)
    {
        var history = await _reportService.GetVisitorHistoryAsync(visitorId);
        return Ok(history);
    }
}