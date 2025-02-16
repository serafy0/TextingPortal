using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.PhoneList
{
    public class CreatePhoneListDTO
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

    }
}
