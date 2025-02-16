using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.MessageTemplate
{
    public class CreateMessageTemplate
    {


        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1600)]
        public string Body { get; set; }
    }
}
