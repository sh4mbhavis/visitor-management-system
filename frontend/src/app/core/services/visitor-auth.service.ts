import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class VisitorAuthService {

  private readonly apiUrl =
    'http://localhost:5155/api/visitor-auth';

  constructor(
    private readonly http: HttpClient
  ) {}

  login(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      data
    );

  }

  register(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/register`,
      data
    );

  }
}