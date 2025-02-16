using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.PhoneList
{
    public class SendMessagesToListsDTO
    {
        public List<int> PhoneNumListIds { get; set; }

        [MaxLength(1600)]
        public string MessageBody { get; set; }
        public int MessageTemplateId { get; set; }
    }
}
