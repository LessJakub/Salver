using System.ComponentModel.DataAnnotations;
using API.Annotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [UsernameAnnotation]
        public string Username { get; set; }

        [Required]
        [PasswordAnnotation]
        public string Password { get; set; }

        [Range(0,1)]
        [Required]
        public int Role { get; set; }
    }
}