using API.Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, IEnumerable<int> restaurants = null);
    }
}