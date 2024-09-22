using Microsoft.AspNetCore.Mvc;
using ReportsFr.Models;
using System.Diagnostics;
using FastReport.Web;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Data;

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


        

        private async Task<DataTable> ToDataTable(IAsyncCursor<BsonDocument> cursor)
        {
            DataTable table = new DataTable();
            bool schemaCreated = false;
            while (await cursor.MoveNextAsync())
            {
                var batch = cursor.Current;

                foreach (var document in batch)
                {
                    if (!schemaCreated)
                    {
                        foreach (var element in document)
                        {
                            
                            table.Columns.Add(element.Name);

                        }
                        schemaCreated = true;
                    }

                    DataRow row = table.NewRow();
                    foreach (var element in document)
                    {
                       
                        row[element.Name] = element.Value;
                        
                    }
                    table.Rows.Add(row);
                }
            }
            return table;
        }


        


        public IActionResult Sample()
        {

            var dataTable = new System.Data.DataTable();
            dataTable.Columns.Add("value", typeof(int));
            dataTable.Rows.Add(5);
            dataTable.Rows.Add(6);
            dataTable.Rows.Add(7);


            var webRoot = _env.WebRootPath;
            WebReport WebReport = new WebReport();
            WebReport.Report.Load(System.IO.Path.Combine(webRoot, "templates/my_table2.frx"));
            ViewBag.WebReport = WebReport;
            WebReport.Report.RegisterData(dataTable, "my_table");
            return View("report");
        }

        public async Task<IActionResult> DisplayReport()
        {

            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("bav_test_report");
            var collection = database.GetCollection<BsonDocument>("report_temp");
            var filter = new BsonDocument();

            using var cursor = await collection.FindAsync(filter);
            var dataTable = await ToDataTable(cursor);
    


            var webRoot = _env.WebRootPath;
            WebReport webReport = new WebReport();
            webReport.Report.Load(System.IO.Path.Combine(webRoot, "templates/template2.frx"));
            var ds = webReport.Report.GetDataSource("main");
            //webReport.Report.Dictionary.DataSources
            //var table = new DataTable();
            //foreach (FastReport.Data.Column col in ds.Columns)
            //{
            //    table.Columns.Add(col.Name, col.DataType);
                
            //}
            ViewBag.WebReport = webReport;
            webReport.Report.RegisterData(dataTable, "main");
            return View("report");
        }

        public async Task<IActionResult> DisplayReportV1()
        {

            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("bav_test_report");
            var collection = database.GetCollection<BsonDocument>("sample");
            var filter = new BsonDocument();

            using var cursor = await collection.FindAsync(filter);
            var dataTable = await ToDataTable(cursor);



            var webRoot = _env.WebRootPath;
            WebReport WebReport = new WebReport();
            WebReport.Width = "1000";
            WebReport.Height = "1000";
            WebReport.Report.Load(System.IO.Path.Combine(webRoot, "templates/my_table2.frx"));
            ViewBag.WebReport = WebReport;
            WebReport.Report.RegisterData(dataTable, "my_table");
            return View("report");
        }
    }
}