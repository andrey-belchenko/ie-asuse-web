using Microsoft.AspNetCore.Mvc;
using ReportsFr.Models;
using System.Diagnostics;
using FastReport.Web;
namespace ReportsFr.Controllers
{
    public class ReportController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IWebHostEnvironment _env;
        public ReportController(ILogger<HomeController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
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