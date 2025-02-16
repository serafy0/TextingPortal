using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TextingBackendApi.Data.Models;

namespace TextingBackendApi.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TwilioMessage> TwilioMessages { get; set; }
        public DbSet<MessageLog> MessageLogs { get; set; }
        public DbSet<MessageTemplate> MessageTemplates { get; set; }

        public DbSet<PhoneNumber> PhoneNumbers { get; set; }

        public DbSet<PhoneNumList> PhoneNumLists { get; set; }

    }
}
