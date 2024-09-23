using Microsoft.AspNetCore.Mvc;
using FastReport.Web;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Data;
using Npgsql;

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

        private static async Task<Stream> ReadTemplate(String templateId)
        {
            string connString = "Host=asuse-ai-dev.infoenergo.loc;Username=asuse;Password=kl0pik;Database=asuse";
            await using var conn = new NpgsqlConnection(connString);
            await conn.OpenAsync();
            var sql = "SELECT file_data FROM report_sys.template WHERE template_id = @p";
            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("p", templateId);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                throw new Exception("Template not found");
            }
            var bytes = (byte[])reader[0];
            var stream = new MemoryStream(bytes);
            return stream;
        }


        public  IActionResult Sample()
        {

            var dataTable = new System.Data.DataTable();
            dataTable.Columns.Add("value", typeof(int));
            dataTable.Rows.Add(5);
            dataTable.Rows.Add(6);
            dataTable.Rows.Add(7);


            var webRoot = _env.WebRootPath;
            WebReport WebReport = new WebReport();
            WebReport.Report.Load(Path.Combine(webRoot, "templates/my_table2.frx"));
            ViewBag.WebReport = WebReport;
            WebReport.Report.RegisterData(dataTable, "my_table");
            return View("report");
        }

        public async Task<IActionResult> DisplayReport(string dataSetName, string templateId )
        {

            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("bav_test_report");
            var collection = database.GetCollection<BsonDocument>(dataSetName);
            var filter = new BsonDocument();

            using var cursor = await collection.FindAsync(filter);
            var dataTable = await ToDataTable(cursor);
    
            var webRoot = _env.WebRootPath;
            WebReport webReport = new WebReport();
            //webReport.Report.Load(System.IO.Path.Combine(webRoot, "templates/template2.frx"));
            var template = await ReadTemplate(templateId);
            webReport.Report.Load(template);
            var ds = webReport.Report.GetDataSource("main");
            ViewBag.WebReport = webReport;
            webReport.Report.RegisterData(dataTable, "main");
            return View("report");
        }

      
    }
}