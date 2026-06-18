import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  private readonly apiUrl =
    'http://localhost:5155/api/approvals';

  constructor(
    private readonly http: HttpClient
  ) {}

  getByVisitId(visitId: number) {
    return this.http.get(
      `${this.apiUrl}/visit/${visitId}`
    );
  }

  approve(
    visitId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/${visitId}/approve`,
      payload
    );
  }

  reject(
    visitId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/${visitId}/reject`,
      payload
    );
  }

  reset(
  visitId: number,
  payload: any
) {
  return this.http.post(
    `${this.apiUrl}/${visitId}/reset`,
    payload
  );
}

}