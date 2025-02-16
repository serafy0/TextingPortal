using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.Data.Models
{
    public class PhoneNumber
    {
        public int Id { get; set; }

        [Required]
        [RegularExpression(
            @"^(010|011|012)\d{8}$",
            ErrorMessage = "Phone number must be an Egyptian number."
        )]
        public string Number { get; set; }
        public int PhoneNumListId { get; set; }
        public PhoneNumList PhoneNumList { get; set; } = null!;
    }
}
