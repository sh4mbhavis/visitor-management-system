using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Approval;

namespace VisitorManagement.Application.Interfaces;

public interface IApprovalService
{
    Task<ApprovalDto> ApproveAsync(CreateApprovalDto dto, CancellationToken cancellationToken = default);
    Task<ApprovalDto> RejectAsync(CreateApprovalDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<ApprovalDto>> GetByVisitIdAsync(int visitId, CancellationToken cancellationToken = default);
}