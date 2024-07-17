using System;

namespace GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Requests
{
    public class CustomRangePrices
    {
        public string Name { get; set; }
        public string HamLuongKara { get; set; }
        public string HamLuongVang { get; set; }
        public DateTime FromTime { get; set; }
        public DateTime ToTime { get; set; }
    }
}
