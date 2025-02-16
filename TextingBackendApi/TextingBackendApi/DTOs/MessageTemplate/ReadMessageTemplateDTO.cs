using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.MessageTemplate
{
    public class ReadMessageTemplateDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Body { get; set; }

    }
}
