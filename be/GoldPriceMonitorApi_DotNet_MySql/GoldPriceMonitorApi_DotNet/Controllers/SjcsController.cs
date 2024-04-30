using DatabaseContext;
using GoldPriceMonitorApi_DotNet.Controllers.Parameters.SjcsController.Requests;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GoldPriceMonitorApi_DotNet.Controllers
{
    [EnableCors("MyCORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class SjcsController : ControllerBase
    {
        private readonly GoldPriceDbContext _context;

        public SjcsController(GoldPriceDbContext context)
        {
            _context = context;
        }

        // GET: api/Sjcs/Cities
        [HttpGet("Cities")]
        public async Task<ActionResult<IEnumerable<string>>> GetCities()
        {
            return await _context.VangSjcs.Select(s => s.City).Distinct().ToListAsync();
        }

        // GET: api/Sjcs/Types
        [HttpGet("Types")]
        public async Task<ActionResult<IEnumerable<string>>> GetTypes(string city)
        {
            return await _context.VangSjcs.Where(s => s.City == city).Select(s => s.Type).Distinct().ToListAsync();
        }

        [HttpGet("Day")]
        public async Task<ActionResult<IEnumerable<VangSjc>>> GetDayPrices([FromQuery] DayPrices args)
        {
            var sjcs = await _context.VangSjcs.Where(b => b.City == args.City && b.Type == args.Type && b.UpdatedTime.Date == args.NgayXem.Date).OrderBy(b => b.UpdatedTime).Select(b => new VangSjc()
            {
                Id = b.Id,
                City = b.City,
                Type = b.Type,
                SellPrice = b.SellPrice,
                BuyPrice = b.BuyPrice,
                UpdatedTime = b.UpdatedTime,
            }).ToListAsync();

            if (sjcs.Any())
            {
                return sjcs;
            }
            return NotFound();
        }
    }
}
