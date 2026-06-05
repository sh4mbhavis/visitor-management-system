import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly apiUrl =
    'http://localhost:5155/api/departments';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(department: any) {
    return this.http.post(this.apiUrl, department);
  }

  update(id: number, department: any) {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}