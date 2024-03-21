using System;

namespace GoldPriceMonitorApi_DotNet.Controllers.Parameters.SjcsController.Requests
{
    public class DayPrices
    {
        public string City { get; set; }
        public string Type { get; set; }
        public DateTime NgayXem { get; set; }
    }
}
