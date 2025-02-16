using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.Data.Models
{
    public class TwilioMessage 
    {

        public string Id { get; set; }


        public bool Sent { get; set; } = false;

        public DateTime DateCreated { get; set; } = DateTime.Now;

        [MaxLength(13)]
        public string To { get; set; }

        [Range(0,459999)]
        public int? ErrorCode { get; set; }

        public string? ErrorMessage { get; set; }

    }
}
