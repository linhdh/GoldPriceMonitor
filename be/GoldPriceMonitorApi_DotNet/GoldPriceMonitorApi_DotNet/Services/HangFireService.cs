using GoldPriceMonitorApi_DotNet.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
        private readonly string _SJCLink = "https://sjc.com.vn/xml/tygiavang.xml";
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
                var isExistedOtherDay = await _dbContext.BaoTinMinhChaus.Where(b => b.ThoiGianNhap.Date == baoTinMinhChau.ThoiGianNhap.Date && b.Name == baoTinMinhChau.Name && b.HamLuongKara == baoTinMinhChau.HamLuongKara && b.HamLuongVang == baoTinMinhChau.HamLuongVang && b.ThoiGianNhap == baoTinMinhChau.ThoiGianNhap).FirstOrDefaultAsync();
                var findDupListForToday = await findDupList.AnyAsync();
                var findDupRowForToday = await findDupList.Where(b => b.Name == baoTinMinhChau.Name && b.HamLuongKara == baoTinMinhChau.HamLuongKara && b.HamLuongVang == baoTinMinhChau.HamLuongVang && b.ThoiGianNhap == baoTinMinhChau.ThoiGianNhap).FirstOrDefaultAsync();
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

        public async Task GetSJC()
        {
            HttpClient client = new HttpClient();
            var httpResponseMessage = await client.GetAsync(_SJCLink);
            if (!httpResponseMessage.IsSuccessStatusCode)
            {
                return;
            }

            var resultString = await httpResponseMessage.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(resultString))
            {
                return;
            }
            XmlDocument xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(resultString);
            CultureInfo vietnamCultureInfo = new CultureInfo("vi-VN", false);

            var updated = DateTime.Parse(xmlDocument.SelectSingleNode("/root/ratelist").Attributes["updated"].InnerText, vietnamCultureInfo)/*.ToString("dd/MM/yyyy HH:mm:ss")*/;
            var unit = xmlDocument.SelectSingleNode("/root/ratelist").Attributes["unit"].InnerText;

            List<VangSjc> vangSjcs = new List<VangSjc>();
            var findDupList = _dbContext.VangSjcs.Where(b => b.UpdatedTime.Date == DateTime.Now.Date);

            var listNode = xmlDocument.SelectNodes("/root/ratelist/city");
            foreach (XmlNode node in listNode)
            {
                var childNodeItem = node.ChildNodes;
                if (childNodeItem.Count > 0)
                {
                    foreach (XmlNode childNode in childNodeItem)
                    {
                        var vangSjc = new VangSjc();
                        vangSjc.UpdatedTime = updated;
                        vangSjc.City = node.Attributes["name"].InnerText;
                        vangSjc.BuyPrice = float.Parse(childNode.Attributes["buy"].InnerText, vietnamCultureInfo) * 1000;
                        vangSjc.SellPrice = float.Parse(childNode.Attributes["sell"].InnerText, vietnamCultureInfo) * 1000;
                        vangSjc.Type = childNode.Attributes["type"].InnerText;

                        var isExistedOtherDay = await _dbContext.VangSjcs.Where(b => b.UpdatedTime.Date == vangSjc.UpdatedTime.Date && b.Type == vangSjc.Type && b.City == vangSjc.City && b.UpdatedTime == vangSjc.UpdatedTime).FirstOrDefaultAsync();
                        var findDupListForToday = await findDupList.AnyAsync();
                        var findDupRowForToday = await findDupList.Where(b => b.Type == vangSjc.Type && b.City == vangSjc.City && b.UpdatedTime == vangSjc.UpdatedTime).FirstOrDefaultAsync();
                        if ((findDupListForToday == true && findDupRowForToday == null) || isExistedOtherDay == null)
                        {
                            vangSjcs.Add(vangSjc);
                        }
                    }
                }
            }

            if (vangSjcs.Count > 0)
            {
                await _dbContext.VangSjcs.AddRangeAsync(vangSjcs);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
