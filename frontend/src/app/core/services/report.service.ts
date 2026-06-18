import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly apiUrl =
    'http://localhost:5155/api/reports';

  constructor(
    private readonly http: HttpClient
  ) {}

  getDailyReport(date: string) {

    return this.http.get(
      `${this.apiUrl}/daily?date=${date}`
    );

  }

  getMonthlyReport(
    year: number,
    month: number
  ) {

    return this.http.get(
      `${this.apiUrl}/monthly?year=${year}&month=${month}`
    );

  }

  getDateRangeReport(
  fromDate: string,
  toDate: string
) {

  return this.http.get(
    `${this.apiUrl}/date-range?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`
  );

}

getDepartmentReport() {

  return this.http.get(
    `${this.apiUrl}/departments`
  );

}

getApprovalSummary() {

  return this.http.get(
    `${this.apiUrl}/approval-summary`
  );

}

getVisitorHistoryByName(
  name: string
) {

  return this.http.get(
    `${this.apiUrl}/visitor-history-by-name?name=${encodeURIComponent(name)}`
  );

}
}