import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilService {
  private httpHeaders: any = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  };

  constructor(private http: HttpClient) {
    this.createAuthorizationHeader();
  }

  // -------------------- http --------------------
  public getRequest(path, params: any = {}) {
    return this.http.get<any>(path, {
      headers: new HttpHeaders(this.httpHeaders),
      params: { ...params },
    });
  }

  public postRequest(path, body, params: any = {}) {
    return this.http.post(path, body, {
      headers: new HttpHeaders(this.httpHeaders),
      params: { ...params },
    });
  }

  public putResource(path, body, params: any = {}) {
    return this.http.put(path, body, {
      headers: new HttpHeaders(this.httpHeaders),
      params: { ...params },
    });
  }

  public deleteResource(path, params: any = {}) {
    return this.http.delete(path, {
      headers: new HttpHeaders(this.httpHeaders),
      params: { ...params },
    });
  }

  private createAuthorizationHeader(): void {
    /* let token = localStorage.getItem('id_token');
    if (token) {
      this.httpHeaders.Authorization = token;
    }*/
  }
}
