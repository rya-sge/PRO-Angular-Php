/**
 * Date de création :  10.05.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Protéger les routes demande d'être une institution des accès non autorisés
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
export class InstitutionGuard implements CanActivate {
  securityObject: AppUserAuth = null;


  constructor(private router: Router, private securityService: SecurityService) {
    this.securityObject = securityService.securityObject;
  }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let resultat = false;

    if (localStorage.getItem('bearerToken') ) {
      if (this.securityObject.isAuthenticated && this.securityObject.isInstitution){
        return true;
      }else{
        resultat = this.securityService.isLogged();
      }
    }
    if (resultat === false){
      this.router.navigate(['accueil']);
      return false;
    }else{
      return true;
    }
  }
}

