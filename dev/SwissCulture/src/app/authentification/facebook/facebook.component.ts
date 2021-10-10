/**
 * Date de création :  15.03 (environ)
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Permet de se connecter avec facebook à l'application
 * Remarque :
 * Sources :
 * Github du module social utilisé :
 * https://github.com/abacritt/angularx-social-login/blob/master/projects/lib/src/providers/facebook-login-provider.ts
 * https://github.com/srinivastamada/angular-social-login/blob/master/src/app/login-page/login-page.component.ts
 * Issue rencontrée :
 * https://github.com/abacritt/angularx-social-login/issues/289
 */


import {Component} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {FacebookLoginProvider} from 'angularx-social-login';
import {SocialUser} from 'angularx-social-login';
import {SecurityService} from '../security-service/security.service';
import {AppUserAuth} from '../security-service/app-user-auth';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})

export class FacebookComponent{
  SERVER_URL = AppComponent.SERVEUR_AUTHENTIFICATION + '/connected.php';
  fbLoginOptions = {
    scope: 'email, public_profile',
    return_scopes: true,
    enable_profile_selector: true,
  };

  constructor(private authService: SocialAuthService, private securityService: SecurityService) {
  }

  user: SocialUser;
  loggedIn: boolean;
  securityObject: AppUserAuth = null;

  /**
   * Déclarer localement l'utilisateur
   * Envoie le token facebook au backend pour vérification
   */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID, this.fbLoginOptions).then(
      (userData) => {
        this.securityService.login(userData.authToken).subscribe(resp => {
          this.securityObject = resp;
        });
      });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  /**
   * Déconnecter localement l'utilisateur
   */
  signOut(): void {
    this.authService.signOut();
  }

}
