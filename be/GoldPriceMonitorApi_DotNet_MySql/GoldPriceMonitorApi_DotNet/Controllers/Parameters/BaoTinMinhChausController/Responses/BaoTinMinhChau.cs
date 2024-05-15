using System;

namespace GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Responses
{
    public class BaoTinMinhChau
    {
        public string Name { get; set; }
        public string HamLuongKara { get; set; }
        public string HamLuongVang { get; set; }
        public float GiaMuaVao { get; set; }
        public float GiaBanRa { get; set; }
        public float GiaTheGioi { get; set; }
        public DateTime ThoiGianNhap { get; set; }
    }
}
