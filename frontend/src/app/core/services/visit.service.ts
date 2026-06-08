import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Visit } from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private readonly apiUrl =
    'http://localhost:5155/api/visits';

  constructor(
    private readonly http: HttpClient
  ) {}

  getAll(): Observable<Visit[]> {
    return this.http.get<Visit[]>(
      this.apiUrl
    );
  }

  getById(id: number) {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  create(visit: any) {
    return this.http.post(
      this.apiUrl,
      visit
    );
  }

  update(id: number, visit: any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      visit
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  checkIn(id: number) {
    return this.http.post(
      `${this.apiUrl}/${id}/check-in`,
      {}
    );
  }

  checkOut(id: number) {
    return this.http.post(
      `${this.apiUrl}/${id}/check-out`,
      {}
    );
  }
}