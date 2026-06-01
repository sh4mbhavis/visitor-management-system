using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Visitor;

namespace VisitorManagement.Application.Interfaces;

public interface IVisitorService
{
    Task<IReadOnlyList<VisitorDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<VisitorDto?> GetByIdAsync(int visitorId, CancellationToken cancellationToken = default);
    Task<VisitorDto> CreateAsync(CreateVisitorDto dto, CancellationToken cancellationToken = default);
    Task<VisitorDto> UpdateAsync(UpdateVisitorDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(int visitorId, CancellationToken cancellationToken = default);
}
