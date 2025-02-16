using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.MessageLog
{
    public class TwilioMessageDTO
    {
        public string Id { get; set; }

        public bool Sent { get; set; }

        public DateTime DateCreated { get; set; }

        [MaxLength(13)]
        public string To { get; set; }

        [Range(0, 459999)]
        public int? ErrorCode { get; set; }

        public string? ErrorMessage { get; set; }
    }
}
