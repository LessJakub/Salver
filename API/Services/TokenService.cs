using API.Entities;
using API.Interfaces;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace API.Services
{
    public class TokenService : ITokenService
    {

        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(AppUser user, int restaurant = 0)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
                new Claim("UserId", user.Id.ToString()),
                //new Claim(user.Role.ToString(), "true") 
                //new Claim(ClaimTypes.Role, user.Role.ToString()) 
            };

            if(restaurant != 0)
            {
                Console.WriteLine("Restaurant");
                claims.Add(new Claim("Restaurant", restaurant.ToString()));
                claims.Add(new Claim(ClaimTypes.Role, "RestaurantOwner"));
            }
            else if(user.Role == Roles.Admin){
                claims.Add(new Claim(ClaimTypes.Role, user.Role.ToString()));
            }
            else{
                Console.WriteLine("Customer");
                claims.Add(new Claim(ClaimTypes.Role, "Customer"));
            }

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(365),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}