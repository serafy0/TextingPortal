using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TextingBackendApi.Data.Context;
using TextingBackendApi.Data.Models;
using TextingBackendApi.DTOs.PhoneList;
using TextingBackendApi.DTOs.PhoneNumber;
using TextingBackendApi.Helpers;
using Twilio.Types;

namespace TextingBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhoneNumListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PhoneNumListsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PhoneNumLists
        [HttpGet]
        public async Task<ActionResult<ApiResult<PhoneListDTO>>> GetPhoneNumLists(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null
        )
        {
            var source = _context
                .PhoneNumLists.AsNoTracking()
                .Select(x => new PhoneListDTO { Id = x.Id, Title = x.Title });

            return await ApiResult<PhoneListDTO>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
            );
        }

        // GET: api/PhoneNumLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhoneListDTO>> GetPhoneNumList(int id)
        {
            var phoneNumList = await _context
                .PhoneNumLists.Select(p => new PhoneListDTO { Id = p.Id, Title = p.Title })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (phoneNumList == null)
            {
                return NotFound();
            }

            return phoneNumList;
        }

        [HttpGet("num/{id}")]
        public async Task<ActionResult<PhoneListWIthNumbersDTO>> GetPhoneNumListWithPhoneNumbers(
            int id
        )
        {
            var phoneNumList = await _context
                .PhoneNumLists.Include(p => p.PhoneNumbers)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (phoneNumList == null)
            {
                return NotFound();
            }

            var result = new PhoneListWIthNumbersDTO
            {
                Id = phoneNumList.Id,
                Title = phoneNumList.Title,
                PhoneNumbers = phoneNumList
                    .PhoneNumbers.Select(p => new GetPhoneNumberDTO
                    {
                        Number = p.Number,
                        Id = p.Id,
                    })
                    .ToList(),
            };

            return Ok(result);
        }

        //[HttpPut("{id}")]
        //TODO: Implement PUT method


        // POST: api/PhoneNumLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PhoneNumList>> PostPhoneNumList(
            CreatePhoneListDTO newPhoneNumList
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var phoneNumList = new PhoneNumList { Title = newPhoneNumList.Title };

            _context.PhoneNumLists.Add(phoneNumList);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                "GetPhoneNumList",
                new { id = phoneNumList.Id },
                new { phoneNumList.Id, phoneNumList.Title }
            );
        }

        // DELETE: api/PhoneNumLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoneNumList(int id)
        {
            var phoneNumList = await _context.PhoneNumLists.FindAsync(id);
            if (phoneNumList == null)
            {
                return NotFound();
            }

            _context.PhoneNumLists.Remove(phoneNumList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PhoneNumListExists(int id)
        {
            return _context.PhoneNumLists.Any(e => e.Id == id);
        }

        [HttpPost("bulk/{id}")]
        public async Task<ActionResult<IEnumerable<GetPhoneNumberDTO>>> PostPhoneNumListBulk(
            int id,
            List<PhoneNumberDTO> newPhoneNumbers
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!PhoneNumListExists(id))
                return NotFound();

            var newNums = new List<GetPhoneNumberDTO>();

            newPhoneNumbers = newPhoneNumbers.DistinctBy(p => p.Number).ToList();

            foreach (var phoneNum in newPhoneNumbers)
            {
                if (PhoneNumberExistsInList(id, phoneNum.Number))
                {
                    continue;
                }

                var phoneNumber = new Data.Models.PhoneNumber
                {
                    Number = phoneNum.Number,
                    PhoneNumListId = id,
                };
                _context.PhoneNumbers.Add(phoneNumber);
                await _context.SaveChangesAsync(); // Save changes to get the ID

                newNums.Add(
                    new GetPhoneNumberDTO { Id = phoneNumber.Id, Number = phoneNumber.Number }
                );
            }

            return CreatedAtAction(
                "GetPhoneNumList",
                new { id = id },
                new { newNumbers = newNums }
            );
        }

        private bool PhoneNumberExistsInList(int listId, string phoneNumber)
        {
            return _context.PhoneNumbers.Any(e =>
                e.PhoneNumListId == listId && e.Number == phoneNumber
            );
        }
    }
}
