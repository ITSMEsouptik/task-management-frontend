import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '../model/credentials.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  signIn: string = `http://localhost:3000/auth/signin`;
  signUp: string = `http://localhost:3000/auth/signup`;
  error!: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: Credentials): Observable<any> {
    return this.http.post(this.signIn, credentials).pipe(
      map((response: any) => response.accessToken),
      catchError((err) => {
        this.error = err;
        console.error('Error occurred during login:', err);
        return throwError(() => err);
      })
    );
  }

  register(credentials: Credentials): Observable<any> {
    return this.http.post(this.signUp, credentials).pipe(
      catchError((err) => {
        this.error = err;
        console.error('Error at signUp: ', err);
        return throwError(() => err);
      })
    );
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/signIn']);
  }

  redirectToLogin() {
    this.router.navigate(['/signIn']);
  }
}
