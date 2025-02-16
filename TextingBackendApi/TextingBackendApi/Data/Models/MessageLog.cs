using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TextingBackendApi.Data.Models
{
    public class MessageLog
    {
        public int Id { get; set; }

        [MaxLength(1600)]
        [Required]
        public string ParsedBody { get; set; }

        public ICollection<TwilioMessage> Messages { get; set; } = new List<TwilioMessage>();

        public string SentById { get; set; }

        public ApplicationUser SentBy { get; set; } = null!;
    }
}
