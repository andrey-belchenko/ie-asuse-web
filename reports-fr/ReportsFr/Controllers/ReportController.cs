using Microsoft.AspNetCore.Mvc;
using ReportsFr.Services;

namespace ReportsFr.Controllers
{
    public class ReportController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IWebHostEnvironment _env;
        private ReportingService _reportingService;
        public ReportController(ILogger<HomeController> logger, IWebHostEnvironment env, ReportingService reportingService)
        {
            _logger = logger;
            _env = env;
            _reportingService = reportingService;
        }

       
        public async Task<IActionResult> DisplayReport(string dataSetName, string templateId, bool? singleTable )
        {

            var webReport = await _reportingService.PrepareReport(dataSetName, templateId, singleTable ?? false);
            ViewBag.WebReport = webReport;   
            return View("report");
        }


        

    }
}