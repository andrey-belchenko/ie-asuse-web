using FastReport.Data;
using FastReport;
using MongoDB.Bson;
using MongoDB.Driver;
using Npgsql;
using System.Data;
using FastReport.Web;
using Microsoft.AspNetCore.Mvc;
using ReportsFr.Settings;
using Microsoft.Extensions.Options;

namespace ReportsFr.Services
{
    public class ReportingService
    {
        private readonly ILogger<ReportingService> _logger;
        private readonly ReportingSettings _settings;
        public ReportingService(ILogger<ReportingService> logger, IOptions<ReportingSettings> settings)
        {
            _logger = logger;
            _settings = settings.Value;
        }

        public async Task<WebReport> PrepareReport(string dataSetName, string templateId)
        {
            WebReport webReport = new WebReport();
            var template = await ReadTemplate(templateId);
            webReport.Report.Load(template);
            var dataSet = ExtractDataSetStruct(webReport.Report);
            await FillDataSet(dataSet, dataSetName);
      
            foreach (DataTable dataTable in dataSet.Tables)
            {
                webReport.Report.RegisterData(dataTable, dataTable.TableName);
            }
            return webReport;
        }

        private async Task FillDataSet(DataSet dataSet, string tempDataSetName)
        {
            var mongoClient = new MongoClient(_settings.MongoConnectionString);
            var mongoDb = mongoClient.GetDatabase(_settings.MongoTempDb);
            var collection = mongoDb.GetCollection<BsonDocument>(tempDataSetName);

            foreach (DataTable table in dataSet.Tables)
            {
                var filter = Builders<BsonDocument>.Filter.Exists(table.TableName);
                using var cursor = await collection.FindAsync(filter);
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                    {
                        var item = (BsonDocument)document[table.TableName];
                        DataRow row = table.NewRow();
                        foreach (DataColumn column in table.Columns)
                        {
                            object value = DBNull.Value;
                            if (item.Contains(column.ColumnName))
                            {
                                value = BsonTypeMapper.MapToDotNetValue(item[column.ColumnName]) ?? DBNull.Value;
                            }
                            row[column.ColumnName] = value;
                        }
                        table.Rows.Add(row);
                    }
                }
            }
        }
        private async Task<Stream> ReadTemplate(string templateId)
        {
            await using var conn = new NpgsqlConnection(_settings.PgConnectionString);
            await conn.OpenAsync();
            var sql = "SELECT file_data FROM report_sys.template WHERE template_id = @p";
            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("p", templateId);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                throw new Exception($"Template '{templateId}' not found");
            }
            var bytes = (byte[])reader[0];
            var stream = new MemoryStream(bytes);
            return stream;
        }

        private DataSet ExtractDataSetStruct(Report report)
        {
            var dataSet = new DataSet();
            foreach (TableDataSource reportDataSource in report.Dictionary.DataSources)
            {
                var dataTable = new DataTable(reportDataSource.Alias);
                dataSet.Tables.Add(dataTable);
                foreach (Column reportColumn in reportDataSource.Columns)
                {
                    dataTable.Columns.Add(reportColumn.Name, reportColumn.DataType);
                }

            }
            return dataSet;

        }
    }
}


