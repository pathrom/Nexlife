import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import jwt_decode from 'jwt-decode';
// import { AuthToken } from '../models/AuthToken';
// import { environment } from '../../environments/environment';
// import { CustomJwtPayload } from 'src/app/models/CustomJwtPayload';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // private readonly JWT_TOKEN = 'JWT_TOKEN';
  // private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  // refreshTokenExpired = true;
  // accessTokenExpired = true;
  // public aboutToExpire = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient, private router: Router) {}

  //   login(username: string, password: string): Observable<boolean> {
  //     return this.http
  //       .post<AuthToken>(`${environment.pathBackend}/api/v1/auth/login`, {
  //         username,
  //         password,
  //       })
  //       .pipe(
  //         map((tokens: AuthToken) => {
  //           this.storeTokens(tokens);
  //           return true;
  //         }),
  //         catchError((error) => {
  //           console.error('AuthenticationService - login - Error', error);
  //           return of(false);
  //         })
  //       );
  //   }

  //   refreshToken(): Observable<AuthToken> {
  //     const token = this.getRefreshToken();
  //     if (token) {
  //       const params = new HttpParams().append('token', token);
  //       return this.http
  //         .post<AuthToken>(`${environment.pathBackend}/api/v1/auth/refresh-token`, {
  //           params,
  //         })
  //         .pipe(
  //           catchError((error) => {
  //             console.error('AuthenticationService - refreshToken - Error', error);
  //             return throwError(new Error('Refresh token not found'));
  //           })
  //         );
  //     } else {
  //       return throwError(new Error('Refresh token not found'));
  //     }
  //   }

  //   forceRefresh() {
  //     console.log('REFRESHING');
  //     const params = new HttpParams().append('token', this.getRefreshToken());
  //     this.http.post<AuthToken>(`${environment.pathBackend}/api/v1/refreshToken`, { params }).subscribe(
  //       (tokens) => {
  //         this.storeTokens(tokens);
  //       },
  //       () => {},
  //       () => {
  //         this.aboutToExpire.next(1);
  //       }
  //     );
  //   }

  //   logout(): Observable<void> {
  //     localStorage.removeItem(this.JWT_TOKEN);
  //     localStorage.removeItem(this.REFRESH_TOKEN);
  //     this.refreshTokenExpired = true;
  //     this.accessTokenExpired = true;

  //     this.router.navigate(['login']);
  //     return throwError(new Error('Logout'));
  //   }

  //   storeTokens(tokens: AuthToken): void {
  //     localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
  //     localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);

  //     const tokenC = this.getDecodedToken();

  //     const roles = tokenC.resource_access.cista.roles as string[];
  //     localStorage.setItem('roles', JSON.stringify(roles));
  //   }

  //   isRefreshTokenValid(): boolean {
  //     const token = this.getDecodedRefreshToken();
  //     if (!token || !token.exp) {
  //       this.refreshTokenExpired = true;
  //       return false;
  //     }

  //     const expires = token.exp * 1000;
  //     const now = Date.now();
  //     this.refreshTokenExpired = expires < now;
  //     return !this.refreshTokenExpired;
  //   }

  //   isJwtExpired(): boolean {
  //     const token = this.getDecodedToken();
  //     if (!token || !token.exp) {
  //       this.accessTokenExpired = true;
  //       return false;
  //     }

  //     const expires = token.exp * 1000;
  //     const now = Date.now();
  //     this.accessTokenExpired = expires < now;
  //     return !this.accessTokenExpired;
  //   }

  //   getJwtToken(): string {
  //     return localStorage.getItem(this.JWT_TOKEN);
  //   }

  //   getRefreshToken(): string {
  //     return localStorage.getItem(this.REFRESH_TOKEN);
  //   }

  //   getDecodedToken(): CustomJwtPayload | null {
  //     const token = this.getJwtToken();
  //     return token ? jwt_decode<CustomJwtPayload>(token) : null;
  //   }

  //   getDecodedRefreshToken(): CustomJwtPayload | null {
  //     const token = this.getRefreshToken();
  //     return token ? jwt_decode<CustomJwtPayload>(token) : null;
  //   }

  //   canAccess(roleName: Array<string>): boolean {
  //     let roles = ['sysadmin', 'managment-user', 'user-guide', 'search_guide'];

  //     if (roleName.length > 0) {
  //       roles = roleName;
  //     }
  //     return this.hasRole(roles);
  //   }

  //   hasRole(roles: string[]): boolean {
  //     try {
  //       const token = this.getDecodedToken();
  //       if (token) {
  //         const perms = token.resource_access.cista.roles as string[];
  //         for (let i = 0; i < perms.length; i++) {
  //           for (let x = 0; x < roles.length; x++) {
  //             if (perms[i] === roles[x]) {
  //               return true;
  //             }
  //           }
  //         }
  //       }
  //     } catch (e) {
  //       console.error('AuthenticationService - hasRole - Error', e);
  //     }
  //     return false;
  //   }

  //   checkIsAboutToExpire() {
  //     try {
  //       const expires = jwt_decode(this.getRefreshToken())['exp'] * 1000;
  //       const actualDate = new Date().getTime();
  //       if (expires - actualDate <= 0) {
  //         this.aboutToExpire.next(0);
  //       } else if (expires - actualDate <= 4 * 60 * 1000) {
  //         this.aboutToExpire.next(2);
  //       } else {
  //         this.aboutToExpire.next(1);
  //       }
  //     } catch (e) {
  //       this.aboutToExpire.next(0);
  //     }
  //   }
}
