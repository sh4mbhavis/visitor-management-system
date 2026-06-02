using System.Collections.Generic;
using System.Threading.Tasks;
using VisitorManagement.Application.DTOs.User;

namespace VisitorManagement.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<UserDto> UpdateAsync(UpdateUserDto dto);
    Task DeleteAsync(int id);
}