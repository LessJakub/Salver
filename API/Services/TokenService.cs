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

        public string CreateToken(AppUser user, IEnumerable<int> restaurants = null)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
                new Claim("UserId", user.Id.ToString()),
                //new Claim(user.Role.ToString(), "true") 
                new Claim("Role", user.Role.ToString()) 
            };

            if(restaurants != null && restaurants.Count() > 0)
            {
                foreach(var res in restaurants.Select((value, i) => new { i, value}))
                {
                    
                    claims.Add(new Claim($"RestaurantId{res.i}", res.value.ToString()));
                }
                claims.Add(new Claim("RestaurantOwner", "true"));
            }
            else{
                claims.Add(new Claim("Customer", "true"));
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