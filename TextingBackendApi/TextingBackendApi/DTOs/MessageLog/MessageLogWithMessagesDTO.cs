namespace TextingBackendApi.DTOs.MessageLog
{
    public class MessageLogWithMessagesDTO : MessageLogDTO
    {
        public ICollection<TwilioMessageDTO> Messages { get; set; } = new List<TwilioMessageDTO>();
    }
}
