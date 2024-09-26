import { GeneratorReport } from "@/features/reports/types/reports/GeneratorReport";

export function getGeneratorReports() {
  const reports = [];
  for (let i = 1; i < 10; i++) {
    reports.push(
      new GeneratorReport({ title: `Отчет ${i}`, reportId: `${i}` })
    );
  }
  return reports;
}
