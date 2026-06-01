using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Visit;

namespace VisitorManagement.Application.Interfaces;

public interface IVisitService
{
    Task<IEnumerable<VisitDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<VisitDto?> GetByIdAsync(int visitId, CancellationToken cancellationToken = default);
    Task<VisitDto> CreateAsync(CreateVisitDto dto, CancellationToken cancellationToken = default);
    Task<VisitDto> UpdateAsync(UpdateVisitDto dto, CancellationToken cancellationToken = default);
    Task CheckInAsync(int visitId, CancellationToken cancellationToken = default);
    Task CheckOutAsync(int visitId, CancellationToken cancellationToken = default);
    Task DeleteAsync(int visitId, CancellationToken cancellationToken = default);
}