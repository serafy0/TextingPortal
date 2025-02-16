using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TextingBackendApi.Data.Models
{
    public class MessageTemplate
    {
        public int Id { get; set; }
        public string Title { get; set; }

        [MaxLength(1600)]
        public string Body { get; set; }
    }
}
