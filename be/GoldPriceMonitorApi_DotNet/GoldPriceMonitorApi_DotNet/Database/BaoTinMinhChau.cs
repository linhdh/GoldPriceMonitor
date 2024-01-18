using System.ComponentModel.DataAnnotations.Schema;

namespace GoldPriceMonitorApi_DotNet.Database
{
    public class BaoTinMinhChau
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public ulong Id { get; set; }
        public string Name { get; set; }
        public string HamLuongKara { get; set; }
        public string HamLuongVang { get; set; }
        public float GiaMuaVao { get; set; }
        public float GiaBanRa { get; set; }
        public float GiaTheGioi { get; set; }
        public DateTime ThoiGianNhap { get; set; }
    }
}
