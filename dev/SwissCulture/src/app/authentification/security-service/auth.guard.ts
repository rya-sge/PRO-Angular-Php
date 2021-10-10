/**
 * Date de création :  04.05.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Protéger les routes demandant d'être authentifiées
 * Remarque :
 * Sources :
 * https://www.toptal.com/angular/angular-6-jwt-authentication
 * https://angular.io/api/router/CanActivate
 * https://guide-angular.wishtack.io/angular/routing/route-guards
 */

import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AppUserAuth} from './app-user-auth';
import {SecurityService} from './security.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  securityObject: AppUserAuth = null;

  isReload = false;


  constructor(private router: Router, private securityService: SecurityService) {

    this.securityObject = securityService.securityObject;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let resultat = false;

    if (localStorage.getItem('bearerToken') ) {
      if (this.securityObject.isAuthenticated){
        return true;
      }else{
        resultat = this.securityService.isLogged();
      }
    }
    if (resultat === false){
      this.router.navigate(['login']);
      return false;
    }else{
      return true;
    }
  }
}

