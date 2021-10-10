/**
 * Date de création :  02.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Gère l'authentification au site au niveau du front-end
 * Remarque :
 * Sources :
 * le code est tiré du tutoriel :
 * 1) https://www.codemag.com/article/1805021/Security-in-Angular-Part-1
 * 2) https://www.codemag.com/article/1809031/Security-in-Angular-Part-2
 */


import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AppUserAuth } from './app-user-auth';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@angular/core';
import {AppComponent} from '../../app.component';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router) { }

  SERVER_URL = AppComponent.SERVEUR_AUTHENTIFICATION + '/login.php';
  PROTECTED_URL = AppComponent.SERVEUR_AUTHENTIFICATION + '/connected.php';

  /**
   * Requête à l'API REST
   * @param email de l'utilisateur
   * @param token authentification facebook
   * Source :
   * https://github.com/srinivastamada/angular-social-login/blob/master/src/app/login-page/login-page.component.ts
   */
  sendToRestApiMethod(token: string, url: string): void {
    this.http.post<AppUserAuth>(url, {token}).subscribe(data => {
      const appUserArry = plainToClass(AppUserAuth, data);
      this.securityObject = Object.assign(this.securityObject, appUserArry);
      if (this.securityObject.bearerToken){
        localStorage.setItem('bearerToken', this.securityObject.bearerToken);
      }
    });

}

  /**
   * Récupération données backend et création utilisateur locale
   * @param token données backend de l'utilisateur
   */
  login(token: string): Observable<AppUserAuth> {
    this.resetSecurityObject();
    this.sendToRestApiMethod(token, this.SERVER_URL);
    return of<AppUserAuth>(this.securityObject);
  }



  /**
   * Logout de l'utilisateur, reset du securityObject
   */
  logout(): void {
    this.resetSecurityObject();
    this.router.navigate(['accueil']);
  }

  /**
   * Affectation des valeurs par défaut au Security Object
   */
  resetSecurityObject(): void {
    this.securityObject.username = '';
    this.securityObject.bearerToken = '';
    this.securityObject.isAuthenticated = false;
    this.securityObject.isInstitution = false;
    this.securityObject.isValid = false;
    localStorage.removeItem('bearerToken');
  }

  /**
   * Vérifier le token en réalisant une requête à l'API
   */
  isLogged(): boolean{
    if (localStorage.getItem('bearerToken')) {
      this.sendToRestApiMethod(localStorage.getItem('bearerToken'), this.PROTECTED_URL);
      return true;
    } else{
      return false;
    }
  }

}
