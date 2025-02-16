using System.ComponentModel.DataAnnotations;

namespace TextingBackendApi.Data.Models
{
    public class PhoneNumList
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public ICollection<PhoneNumber> PhoneNumbers { get; set; } = new List<PhoneNumber>();
    }
}
