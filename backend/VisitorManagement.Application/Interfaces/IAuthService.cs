using System.Threading;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.Auth;

namespace VisitorManagement.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default);
}