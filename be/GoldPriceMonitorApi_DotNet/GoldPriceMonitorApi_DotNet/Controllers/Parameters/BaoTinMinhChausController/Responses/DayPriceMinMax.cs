using System;

namespace GoldPriceMonitorApi_DotNet.Controllers.Parameters.BaoTinMinhChausController.Responses
{
    public class DayPriceMinMax
    {
        public string Name { get; set; }
        public string HamLuongVang { get; set; }
        public string HamLuongKara { get; set; }
        public float GiaBanRaMin { get; set; }
        public float GiaBanRaMax { get; set; }
        public float GiaMuaVaoMin { get; set; }
        public float GiaMuaVaoMax { get; set; }
        public DateTime ThoiGianNhap { get; set; }
    }
}
