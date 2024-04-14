using System.Threading.Tasks;

namespace GoldPriceMonitorApi_DotNet.Services
{
    public interface IHangFireService
    {
        public Task GetBTMC();
        public Task GetSJC();
    }
}
