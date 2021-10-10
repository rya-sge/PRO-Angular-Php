/**
 * Date de création :  28.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Intercepte les requête http pour y ajouter le token
 * Remarque :
 * Sources :
 * https://stackoverflow.com/questions/50985669/angular6-angular-jwt-not-adding-token-to-request-headers/61837272#61837272
 * https://blog.angular-university.io/angular-jwt-authentication
 */


import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}
  get getToken(): string {
    return localStorage.getItem('bearerToken');
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    request = request.clone({
      setHeaders: {
        Authorization: `bearerToken ${this.getToken}`
      }
    });
    return next.handle(request);
  }
}
