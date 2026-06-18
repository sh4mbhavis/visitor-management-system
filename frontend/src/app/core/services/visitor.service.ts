import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitor } from '../models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private readonly apiUrl =
    'http://localhost:5155/api/visitors';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Visitor[]> {

  console.log('API Called');

  return this.http.get<Visitor[]>(this.apiUrl);

}
  create(visitor: any) {
  return this.http.post(this.apiUrl, visitor);
}

delete(id: number) {
  return this.http.delete(
    `${this.apiUrl}/${id}`
  );
}

getById(id: number) {
  return this.http.get(`${this.apiUrl}/${id}`);
}

update(id: number, visitor: any) {
  return this.http.put(`${this.apiUrl}/${id}`, visitor);
}

searchVisitors(
  term: string
) {

  return this.http.get(
    `${this.apiUrl}/search?term=${encodeURIComponent(term)}`
  );

}
}