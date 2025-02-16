using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TextingBackendApi.Data.Context;
using TextingBackendApi.Data.Models;
using TextingBackendApi.DTOs.MessageLog;
using TextingBackendApi.DTOs.MessageTemplate;
using TextingBackendApi.Helpers;

namespace TextingBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<MessageLogDTO>>> GetMessageTemplates(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null
        )
        {
            var source = _context
                .MessageLogs.AsNoTracking()
                .Select(x => new MessageLogDTO { Id = x.Id, ParsedBody = x.ParsedBody });

            return await ApiResult<MessageLogDTO>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
            );
        }

        // GET: api/MessageLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageLog>> GetMessageLog(int id)
        {
            var messageLog = await _context
                .MessageLogs.Include(m => m.Messages)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (messageLog == null)
            {
                return NotFound();
            }

            return messageLog;
        }

        // PUT: api/MessageLogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessageLog(int id, MessageLog messageLog)
        {
            if (id != messageLog.Id)
            {
                return BadRequest();
            }

            _context.Entry(messageLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageLogExists(id))
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

        // POST: api/MessageLogs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MessageLog>> PostMessageLog(MessageLog messageLog)
        {
            _context.MessageLogs.Add(messageLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessageLog", new { id = messageLog.Id }, messageLog);
        }

        // DELETE: api/MessageLogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessageLog(int id)
        {
            var messageLog = await _context.MessageLogs.FindAsync(id);
            if (messageLog == null)
            {
                return NotFound();
            }

            _context.MessageLogs.Remove(messageLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageLogExists(int id)
        {
            return _context.MessageLogs.Any(e => e.Id == id);
        }
    }
}
