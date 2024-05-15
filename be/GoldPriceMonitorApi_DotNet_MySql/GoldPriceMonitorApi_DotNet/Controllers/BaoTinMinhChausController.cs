using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Requests;
using GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Responses;
using DatabaseContext;
using BaoTinMinhChau = GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Responses.BaoTinMinhChau;

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

        [HttpGet("Day")]
        public async Task<ActionResult<IEnumerable<BaoTinMinhChau>>> GetDayPrices([FromQuery] DayPrices args)
        {
            var baoTinMinhChau = await _context.BaoTinMinhChaus.Where(b => b.Name == args.Name && b.HamLuongVang == args.HamLuongVang && b.HamLuongKara == args.HamLuongKara && b.ThoiGianNhap.Date == args.NgayXem.Date).OrderBy(b => b.ThoiGianNhap).Select(b => new BaoTinMinhChau()
            {
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

        [HttpGet("Month")]
        public async Task<ActionResult<IEnumerable<DayPriceMinMax>>> GetMonthPrices([FromQuery] MonthPrices args)
        {
            var baoTinMinhChau = await _context.BaoTinMinhChaus.Where(b => b.Name == args.Name && b.HamLuongVang == args.HamLuongVang && b.HamLuongKara == args.HamLuongKara && b.ThoiGianNhap.Date.Month == args.ThangXem.Date.Month).GroupBy(b => new { b.Name, b.HamLuongVang, b.HamLuongKara, b.ThoiGianNhap.Date }).OrderBy(b => b.Key.Date).Select(b => new DayPriceMinMax
            {
                Name = b.Key.Name,
                HamLuongVang = b.Key.HamLuongVang,
                HamLuongKara = b.Key.HamLuongKara,
                GiaBanRaMin = b.Min<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaBanRa),
                GiaBanRaMax = b.Max<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaBanRa),
                GiaMuaVaoMin = b.Min<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaMuaVao),
                GiaMuaVaoMax = b.Max<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaMuaVao), 
                ThoiGianNhap = b.Key.Date
            }).ToListAsync();

            if (baoTinMinhChau.Any())
            {
                return baoTinMinhChau;
            }
            return NotFound();
        }

        [HttpGet("Year")]
        public async Task<ActionResult<IEnumerable<DayPriceMinMax>>> GetYearPrices([FromQuery] YearPrices args)
        {
            var baoTinMinhChau = await _context.BaoTinMinhChaus.Where(b => b.Name == args.Name && b.HamLuongVang == args.HamLuongVang && b.HamLuongKara == args.HamLuongKara && b.ThoiGianNhap.Date.Year == args.NamXem.Date.Year).GroupBy(b => new { b.Name, b.HamLuongVang, b.HamLuongKara, b.ThoiGianNhap.Date }).OrderBy(b => b.Key.Date).Select(b => new DayPriceMinMax
            {
                Name = b.Key.Name,
                HamLuongVang = b.Key.HamLuongVang,
                HamLuongKara = b.Key.HamLuongKara,
                GiaBanRaMin = b.Min<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaBanRa),
                GiaBanRaMax = b.Max<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaBanRa),
                GiaMuaVaoMin = b.Min<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaMuaVao),
                GiaMuaVaoMax = b.Max<DatabaseContext.BaoTinMinhChau>(bi => bi.GiaMuaVao),
                ThoiGianNhap = b.Key.Date
            }).ToListAsync();

            if (baoTinMinhChau.Any())
            {
                return baoTinMinhChau;
            }
            return NotFound();
        }

        [HttpGet("CustomRange")]
        public async Task<ActionResult<IEnumerable<BaoTinMinhChau>>> GetCustomRangePrices([FromQuery] CustomRangePrices args)
        {
            var baoTinMinhChau = await _context.BaoTinMinhChaus.Where(b => b.Name == args.Name && b.HamLuongVang == args.HamLuongVang && b.HamLuongKara == args.HamLuongKara && b.ThoiGianNhap.Date >= args.FromTime.Date && b.ThoiGianNhap.Date <= args.ToTime.Date).OrderBy(b => b.ThoiGianNhap).Select(b => new BaoTinMinhChau
            {
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
