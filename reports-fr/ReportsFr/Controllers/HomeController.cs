using Microsoft.AspNetCore.Mvc;
using ReportsFr.Models;
using System.Diagnostics;
using FastReport.Web;
namespace ReportsFr.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IWebHostEnvironment _env;
        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        //http://localhost:5195/Home/DisplayReport
    
        public IActionResult DisplayReport()
        {
            var webRoot = _env.WebRootPath;
            WebReport WebReport = new WebReport();
            WebReport.Width = "1000";
            WebReport.Height = "1000";
            WebReport.Report.Load(System.IO.Path.Combine(webRoot, "templates/my_table2.frx"));
            var dataTable = new System.Data.DataTable();
            dataTable.Columns.Add("value", typeof(int));
            dataTable.Rows.Add(5);
            dataTable.Rows.Add(6);
            dataTable.Rows.Add(7);
            dataTable.TableName = "my_table";
            WebReport.Report.RegisterData(dataTable, "my_table");
            ViewBag.WebReport = WebReport; 
            return View("report");
        }
    }
}