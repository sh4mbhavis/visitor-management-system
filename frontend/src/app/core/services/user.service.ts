import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl =
    'http://localhost:5155/api/users';

  constructor(
    private readonly http: HttpClient
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }
  getFaculty(): Observable<any[]> {

  return this.http.get<any[]>(
    `${this.apiUrl}/faculty`
  );

}

  getById(id: number) {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  create(user: any) {
    return this.http.post(
      this.apiUrl,
      user
    );
  }

  update(id: number, user: any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      user
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}