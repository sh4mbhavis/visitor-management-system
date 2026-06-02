using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Reports;

namespace VisitorManagement.Application.Interfaces;

public interface IReportService
{
    Task<DailyReportDto> GetDailyReportAsync(DateTime reportDate);
    Task<MonthlyReportDto> GetMonthlyReportAsync(int year, int month);
    Task<IEnumerable<VisitorHistoryDto>> GetVisitorHistoryAsync(int visitorId);
}