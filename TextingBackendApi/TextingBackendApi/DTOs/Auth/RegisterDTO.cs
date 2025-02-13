using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.Auth
{
    public class RegisterDTO
    {
        [Required]
        [EmailAddress]

        public string Email { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
