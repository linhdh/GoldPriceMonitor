using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GoldPriceMonitorApi_DotNet.Database;
using GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController;
using Microsoft.AspNetCore.Cors;

namespace GoldPriceMonitorApi_DotNet.Controllers
{
    [EnableCors("MyCORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class BaoTinMinhChausController : ControllerBase
    {
        private readonly GoldPriceDbContext _context;

        public BaoTinMinhChausController(GoldPriceDbContext context)
        {
            _context = context;
        }

        // GET: api/BaoTinMinhChaus/GoldTypes
        [HttpGet("GoldTypes")]
        public async Task<ActionResult<IEnumerable<GoldType>>> GetTypes()
        {
            return await _context.BaoTinMinhChaus.GroupBy(b => new { b.Name, b.HamLuongKara, b.HamLuongVang }).Select(b => new GoldType() { 
                Name = b.Key.Name, 
                HamLuongKara = b.Key.HamLuongKara, 
                HamLuongVang = b.Key.HamLuongVang 
            }).ToListAsync();
        }

        [HttpGet("Today")]
        public async Task<ActionResult<IEnumerable<BaoTinMinhChau>>> GetToday([FromQuery] GoldType type)
        {
            var baoTinMinhChau = await _context.BaoTinMinhChaus.Where(b => b.Name == type.Name && b.HamLuongVang == type.HamLuongVang && b.HamLuongKara == type.HamLuongKara && b.ThoiGianNhap.Date == DateTime.Now.Date).OrderBy(b => b.ThoiGianNhap).Select(b => new BaoTinMinhChau()
            {
                Id = b.Id, 
                Name = b.Name, 
                HamLuongVang = b.HamLuongVang, 
                HamLuongKara = b.HamLuongKara, 
                GiaBanRa = b.GiaBanRa, 
                GiaMuaVao = b.GiaMuaVao, 
                GiaTheGioi = b.GiaTheGioi, 
                ThoiGianNhap = b.ThoiGianNhap
            }).ToListAsync();

            if (baoTinMinhChau.Any())
            {
                return baoTinMinhChau;
            }
            return NotFound();
        }
    }
}
