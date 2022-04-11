using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Annotations;

namespace API.DTOs
{
    public class UserUpdateDto
    {
        [UsernameAnnotation]
        public string Username { get; set; }
        
        [PasswordAnnotation]
        public string Password { get; set; }
    }
}