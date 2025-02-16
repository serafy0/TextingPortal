using Microsoft.AspNetCore.Identity;

namespace TextingBackendApi.Data.Models
{
    public class ApplicationUser : IdentityUser
    {

        public ICollection<MessageLog> MessageLogs { get; set; } = new List<MessageLog>();
    }
}
