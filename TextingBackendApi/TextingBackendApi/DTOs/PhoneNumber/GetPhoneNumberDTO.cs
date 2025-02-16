using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.DTOs.PhoneNumber
{
    public class GetPhoneNumberDTO
    {
        public int Id { get; set; }

        [RegularExpression(
            @"^(010|011|012)\d{8}$",
            ErrorMessage = "Phone number must be an Egyptian number."
        )]
        public string Number { get; set; }
    }
}
