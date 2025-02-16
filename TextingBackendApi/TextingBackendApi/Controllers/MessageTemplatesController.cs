using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TextingBackendApi.Data.Context;
using TextingBackendApi.Data.Models;
using TextingBackendApi.DTOs.MessageTemplate;
using TextingBackendApi.Helpers;

namespace TextingBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageTemplatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageTemplatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MessageTemplates
        [HttpGet]
        public async Task<ActionResult<ApiResult<ReadMessageTemplateDTO>>> GetMessageTemplates(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null
        )
        {
            var source = _context
                .MessageTemplates.AsNoTracking()
                .Select(x => new ReadMessageTemplateDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Body = x.Body,
                });

            return await ApiResult<ReadMessageTemplateDTO>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
            );
        }

        // GET: api/MessageTemplates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageTemplate>> GetMessageTemplate(int id)
        {
            var messageTemplate = await _context.MessageTemplates.FindAsync(id);

            if (messageTemplate == null)
            {
                return NotFound();
            }

            return messageTemplate;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutMessageTemplate(
            int id,
            CreateMessageTemplate editedMessageTemplate
        )
        {
            var messageTemplate = await _context.MessageTemplates.FindAsync(id);

            if (messageTemplate == null)
            {
                return NotFound();
            }

            messageTemplate.Title = editedMessageTemplate.Title;

            messageTemplate.Body = editedMessageTemplate.Body;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageTemplateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostMessageTemplate(
            CreateMessageTemplate newMessageTemplate
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var messageTemplate = new MessageTemplate
            {
                Title = newMessageTemplate.Title,
                Body = newMessageTemplate.Body,
            };

            try
            {
                _context.MessageTemplates.Add(messageTemplate);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return CreatedAtAction(
                nameof(GetMessageTemplate),
                new { id = messageTemplate.Id },
                new
                {
                    id = messageTemplate.Id,
                    newMessageTemplate.Title,
                    newMessageTemplate.Body,
                }
            );
        }

        // DELETE: api/MessageTemplates/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMessageTemplate(int id)
        {
            var messageTemplate = await _context.MessageTemplates.FindAsync(id);
            if (messageTemplate == null)
            {
                return NotFound();
            }

            _context.MessageTemplates.Remove(messageTemplate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageTemplateExists(int id)
        {
            return _context.MessageTemplates.Any(e => e.Id == id);
        }
    }
}
