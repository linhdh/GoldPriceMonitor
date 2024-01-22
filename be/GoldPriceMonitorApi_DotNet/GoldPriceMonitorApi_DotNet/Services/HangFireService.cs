using GoldPriceMonitorApi_DotNet.Database;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
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

            foreach (XmlNode xmlNode in xmlNodeList)
            {
                BaoTinMinhChau baoTinMinhChau = new BaoTinMinhChau();
                baoTinMinhChau.Name = xmlNode.Attributes![1]!.Value;
                baoTinMinhChau.HamLuongKara = xmlNode.Attributes![1]!.Value;
                baoTinMinhChau.HamLuongVang = xmlNode.Attributes![2]!.Value;
                baoTinMinhChau.GiaMuaVao = float.Parse(xmlNode.Attributes![3]!.Value, CultureInfo.InvariantCulture.NumberFormat);
                baoTinMinhChau.GiaBanRa = float.Parse(xmlNode.Attributes![4]!.Value, CultureInfo.InvariantCulture.NumberFormat);
                baoTinMinhChau.GiaTheGioi = float.Parse(xmlNode.Attributes![5]!.Value, CultureInfo.InvariantCulture.NumberFormat);
                baoTinMinhChau.ThoiGianNhap = DateTime.Parse(xmlNode.Attributes![6]!.Value, CultureInfo.InvariantCulture.DateTimeFormat);
                baoTinMinhChaus.Add(baoTinMinhChau);
            }
            await _dbContext.AddRangeAsync(baoTinMinhChaus);
            await _dbContext.SaveChangesAsync();
        }

        public Task GetSJC()
        {
            return Task.CompletedTask;

        }
    }
}
