using TextingBackendApi.DTOs.PhoneNumber;

namespace TextingBackendApi.DTOs.PhoneList
{
    public class PhoneListWIthNumbersDTO : PhoneListDTO
    {
        public ICollection<GetPhoneNumberDTO> PhoneNumbers { get; set; } =
            new List<GetPhoneNumberDTO>();
    }
}
