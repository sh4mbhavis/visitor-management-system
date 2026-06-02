using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Dashboard;

namespace VisitorManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}