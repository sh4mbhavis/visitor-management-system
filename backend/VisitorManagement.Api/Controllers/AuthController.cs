using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VisitorManagement.Application.DTOs.Auth;
using VisitorManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace VisitorManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
 [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        [FromBody] LoginRequestDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _authService.LoginAsync(dto, cancellationToken);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred while processing the request." });
        }
    }
}