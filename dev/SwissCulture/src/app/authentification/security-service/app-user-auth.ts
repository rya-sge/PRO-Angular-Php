/**
 * Date de création :  02.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Représente localement un utilisateur sur le site
 * Remarque :
 * Sources :
 * https://www.toptal.com/angular/angular-6-jwt-authentication
 * https://jasonwatmore.com/post/2019/06/22/angular-8-jwt-authentication-example-tutorial
 */
export class AppUserAuth {
  username = '';
  bearerToken = '';
  isAuthenticated = false;
  isInstitution = false;
  isValid = false;
}
