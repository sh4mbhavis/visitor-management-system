import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    'http://localhost:5155/api/dashboard/stats';

  constructor(private readonly http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}