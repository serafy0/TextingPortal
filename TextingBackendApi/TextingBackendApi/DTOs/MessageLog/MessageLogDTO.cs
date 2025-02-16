using System.ComponentModel.DataAnnotations;
using TextingBackendApi.Data.Models;

namespace TextingBackendApi.DTOs.MessageLog
{
    public class MessageLogDTO
    {
        public int Id { get; set; }

        [MaxLength(1600)]
        [Required]
        public string ParsedBody { get; set; }
    }
}
