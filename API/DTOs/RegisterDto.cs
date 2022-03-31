using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "Password must have between 8-20 characters")]
        public string Password { get; set; }

        [Range(0,1)]
        [Required]
        public int Role { get; set; }
    }
}