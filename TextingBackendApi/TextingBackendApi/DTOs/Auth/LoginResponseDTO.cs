namespace TextingBackendApi.DTOs.Auth
{
    public class LoginResponseDTO
    {
        public string Jwt { get; set; }

        public string Username { get; set; }

        public string Id { get; set; }
    }
}
