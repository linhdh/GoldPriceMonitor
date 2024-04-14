using System;

namespace GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Requests
{
    public class YearPrices
    {
        public string Name { get; set; }
        public string HamLuongKara { get; set; }
        public string HamLuongVang { get; set; }
        public DateTime NamXem { get; set; }
    }
}
