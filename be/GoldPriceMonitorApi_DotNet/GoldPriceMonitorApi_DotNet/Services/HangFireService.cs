using GoldPriceMonitorApi_DotNet.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml;

namespace GoldPriceMonitorApi_DotNet.Services
{
    public class HangFireService : IHangFireService
    {
        private readonly string _BTMCLink = "http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v";
        private readonly GoldPriceDbContext _dbContext;

        public HangFireService(GoldPriceDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task GetBTMC()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/xml"));    /*!important*/
            var httpResponseMessage = await client.GetAsync(_BTMCLink);
            if (!httpResponseMessage.IsSuccessStatusCode)
            {
                return;
            }

            var resultString = await httpResponseMessage.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(resultString))
            {
                return;
            }
            XmlDocument document = new XmlDocument();
            document.LoadXml(resultString);
            XmlNodeList xmlNodeList = document.GetElementsByTagName("Data");
            List<BaoTinMinhChau> baoTinMinhChaus = new List<BaoTinMinhChau>();
            CultureInfo vietnamCultureInfo = new CultureInfo("vi-VN", false);
            var findDupList = _dbContext.BaoTinMinhChaus.Where(b => b.ThoiGianNhap.Date == DateTime.Now.Date);

            foreach (XmlNode xmlNode in xmlNodeList)
            {
                BaoTinMinhChau baoTinMinhChau = new BaoTinMinhChau();
                baoTinMinhChau.Name = xmlNode.Attributes![1]!.Value;
                baoTinMinhChau.HamLuongKara = xmlNode.Attributes![2]!.Value;
                baoTinMinhChau.HamLuongVang = xmlNode.Attributes![3]!.Value;
                baoTinMinhChau.GiaMuaVao = float.Parse(xmlNode.Attributes![4]!.Value, vietnamCultureInfo);
                baoTinMinhChau.GiaBanRa = float.Parse(xmlNode.Attributes![5]!.Value, vietnamCultureInfo);
                baoTinMinhChau.GiaTheGioi = float.Parse(xmlNode.Attributes![6]!.Value, vietnamCultureInfo);
                baoTinMinhChau.ThoiGianNhap = DateTime.Parse(xmlNode.Attributes![7]!.Value, vietnamCultureInfo);
                var isExistedOtherDay = await _dbContext.BaoTinMinhChaus.Where(b => b.ThoiGianNhap.Date == baoTinMinhChau.ThoiGianNhap.Date && b.Name == baoTinMinhChau.Name && b.HamLuongKara == baoTinMinhChau.HamLuongKara && b.HamLuongVang == baoTinMinhChau.HamLuongVang && b.ThoiGianNhap == baoTinMinhChau.ThoiGianNhap).SingleOrDefaultAsync();
                var findDupListForToday = await findDupList.AnyAsync();
                var findDupRowForToday = await findDupList.Where(b => b.Name == baoTinMinhChau.Name && b.HamLuongKara == baoTinMinhChau.HamLuongKara && b.HamLuongVang == baoTinMinhChau.HamLuongVang && b.ThoiGianNhap == baoTinMinhChau.ThoiGianNhap).SingleOrDefaultAsync();
                if ((findDupListForToday == true && findDupRowForToday == null) || isExistedOtherDay == null)
                {
                    baoTinMinhChaus.Add(baoTinMinhChau);
                }
            }

            if (baoTinMinhChaus.Count > 0)
            {
                await _dbContext.BaoTinMinhChaus.AddRangeAsync(baoTinMinhChaus);
                await _dbContext.SaveChangesAsync();
            }
        }

        public Task GetSJC()
        {
            return Task.CompletedTask;

        }
    }
}
