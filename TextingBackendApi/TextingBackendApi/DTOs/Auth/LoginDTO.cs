﻿using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.Auth
{
    public class LoginDTO
    {

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

    }
}
