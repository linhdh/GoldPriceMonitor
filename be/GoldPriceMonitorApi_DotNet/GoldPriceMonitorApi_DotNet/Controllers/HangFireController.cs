using GoldPriceMonitorApi_DotNet.Services;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GoldPriceMonitorApi_DotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HangFireController : ControllerBase
    {
        private readonly IHangFireService _hangfireService;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IRecurringJobManager _recurringJobManager;

        public HangFireController(IHangFireService hangFireService, IBackgroundJobClient clientJobClient, IRecurringJobManager recurringJobManager)
        {
            _hangfireService = hangFireService;
            _backgroundJobClient = clientJobClient;
            _recurringJobManager = recurringJobManager;
        }

        [HttpGet]
        [Route("start")]
        public IActionResult Start()
        {
            _recurringJobManager.AddOrUpdate("BaoTinMinhChau", () => _hangfireService.GetBTMC(), "*/15 * * * *");
            return Ok();
        }
    }
}
