using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TextingBackendApi.Data.Context;
using TextingBackendApi.Data.Models;
using TextingBackendApi.DTOs.PhoneList;
using TextingBackendApi.Helpers;
using Twilio;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace TextingBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : Controller
    {
        private readonly IConfiguration _configuration;

        private readonly ApplicationDbContext _context;

        public MessagesController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            TwilioClient.Init(
                _configuration["Twilio:AccountSid"],
                _configuration["Twilio:AuthToken"]
            );

            _context = context;
        }

        [HttpPost("send/lists")]
        [Authorize(Roles = "Sender,Admin")]
        public async Task<IActionResult> SendMessageToLists([FromBody] SendMessagesToListsDTO dto)
        {
            if (dto == null || dto.PhoneNumListIds == null || !dto.PhoneNumListIds.Any())
            {
                return BadRequest("Invalid input.");
            }

            var messageTemplate = await _context.MessageTemplates.FindAsync(dto.MessageTemplateId);
            if (messageTemplate == null)
            {
                return NotFound("Message template not found.");
            }

            var phoneNumLists = await _context
                .PhoneNumLists.Include(p => p.PhoneNumbers)
                .Where(p => dto.PhoneNumListIds.Contains(p.Id))
                .ToListAsync();

            if (phoneNumLists == null || !phoneNumLists.Any())
            {
                return NotFound("Phone number lists not found.");
            }

            var distinctPhoneNumbers = phoneNumLists
                .SelectMany(p => p.PhoneNumbers)
                .GroupBy(pn => pn.Number)
                .Select(g => g.First())
                .ToList();

            foreach (var phoneNumList in phoneNumLists)
            {
                phoneNumList.PhoneNumbers = phoneNumList
                    .PhoneNumbers.Where(pn => distinctPhoneNumbers.Contains(pn))
                    .ToList();
            }

            var messageLog = new MessageLog
            {
                ParsedBody = dto.MessageBody,
                SentById = User.FindFirstValue(ClaimTypes.NameIdentifier),
                Messages = new List<TwilioMessage>(),
            };

            foreach (var phoneNumList in phoneNumLists)
            {
                foreach (var phoneNumber in phoneNumList.PhoneNumbers)
                {
                    var messageOptions = new CreateMessageOptions(
                        new Twilio.Types.PhoneNumber("+2" + phoneNumber.Number)
                    )
                    {
                        From = new Twilio.Types.PhoneNumber(_configuration["Twilio:From"]),
                        Body = dto.MessageBody,
                    };

                    try
                    {
                        var message = MessageResource.Create(messageOptions);

                        var twilioMessage = new TwilioMessage
                        {
                            Id = message.Sid,
                            Sent = true,
                            DateCreated = message.DateCreated ?? DateTime.UtcNow,
                            To = phoneNumber.Number,
                        };

                        messageLog.Messages.Add(twilioMessage);
                    }
                    catch (ApiException err)
                    {
                        var twilioMessage = new TwilioMessage
                        {
                            Id = GenerateFailedMessageId(),
                            Sent = false,
                            DateCreated = DateTime.UtcNow,
                            To = phoneNumber.Number,
                            ErrorCode = err.Code,
                            ErrorMessage = err.Message,
                        };

                        messageLog.Messages.Add(twilioMessage);
                    }
                }
            }

            _context.MessageLogs.Add(messageLog);
            await _context.SaveChangesAsync();

            return Ok(
                new { Message = "Messages sent and logged successfully.", Id = messageLog.Id }
            );
        }

        public static string GenerateFailedMessageId()
        {
            using (var sha256 = SHA256.Create())
            {
                // Generate a new GUID and convert it to bytes
                Guid guid = Guid.NewGuid();
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(guid.ToString()));

                // Convert the first 16 bytes of the hash to a hex string
                string hexPart = BitConverter.ToString(hashBytes, 0, 16).Replace("-", "").ToLower();

                // Prefix with "SM" to match Twilio's message SID format
                return $"SM{hexPart}";
            }
        }
    }
}
