using GoldPriceMonitorApi_DotNet.Services;
using Hangfire;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GoldPriceMonitorApi_DotNet.Controllers
{
    [EnableCors("MyCORSPolicy")]
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
        [Route("StartBaoTinMinhChau")]
        public IActionResult StartBaoTinMinhChau()
        {
            _recurringJobManager.AddOrUpdate("BaoTinMinhChau", () => _hangfireService.GetBTMC(), "*/15 * * * *");
            return Ok();
        }

        [HttpGet]
        [Route("RemoveBaoTinMinhChau")]
        public IActionResult RemoveBaoTinMinhChau()
        {
            RecurringJob.RemoveIfExists("BaoTinMinhChau");
            return Ok();
        }

        [HttpGet]
        [Route("TriggerBaoTinMinhChau")]
        public IActionResult TriggerBaoTinMinhChau()
        {
            RecurringJob.TriggerJob("BaoTinMinhChau");
            return Ok();
        }

        [HttpGet]
        [Route("StartSJC")]
        public IActionResult StartSJC()
        {
            _recurringJobManager.AddOrUpdate("SJC", () => _hangfireService.GetSJC(), "*/15 * * * *");
            return Ok();
        }

        [HttpGet]
        [Route("RemoveSJC")]
        public IActionResult RemoveSJC()
        {
            RecurringJob.RemoveIfExists("SJC");
            return Ok();
        }

        [HttpGet]
        [Route("TriggerSJC")]
        public IActionResult TriggerSJC()
        {
            RecurringJob.TriggerJob("SJC");
            return Ok();
        }
    }
}
