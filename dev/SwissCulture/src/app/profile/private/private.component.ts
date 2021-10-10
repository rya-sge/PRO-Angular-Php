/**
 * Date de création :  09.04
 * Dernier contributeur : David Pellissier
 * Groupe : PRO-A-07
 * Description :
 * Composant affichant le profil privé d'un utilisateur. L'affichage s'adapte en fonction du type de compte.
 * C'est ici qu'il est possible de supprimer le compte et de changer de type de compte (privé-> institution)
 */

import { Component } from '@angular/core';
import {SecurityService} from '../../authentification/security-service/security.service';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {cityToString, Institution} from '../../shared/objects/Institution';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AppComponent} from '../../app.component';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Watermark} from '../../shared/objects/Watermark';
import {TermsOfUseComponent} from '../../shared/terms-of-use/terms-of-use.component';

@Component({
  selector: 'app-prive',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {

  securityObject: AppUserAuth = null;
  institutionObject: Institution = null;
  imgProfil: string;
  imgWatermark: string;
  watermark: Watermark = null;
  address = '';
  waiting = 2;
  loaded = false;

  constructor(private securityService: SecurityService, private http: HttpClient, private snackbar: MatSnackBar ,
              private router: Router,
              public dialog: MatDialog) {
    this.securityObject = securityService.securityObject;
  }

  init(): void {
    this.loaded = true;
    this.getInstitution();
  }

  getTypeCompte(): string {
    if (this.securityObject.isInstitution) {
      return 'Institution';
    }
    return 'Privé';
  }

  delCompteDialog(): void {
    const dialogRef = this.dialog.open(DialogSuppressionCompteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delCompte();
      }
    });

  }

  delCompte(): void {
    // Supprimer le compte
    this.http.post(AppComponent.SERVER_URL + '/profile/deletePrivateAccount.php', null, {}).subscribe(
      data => this.snackbar.open('Votre compte a bien été supprimé ', 'OK', { horizontalPosition: 'center', verticalPosition: 'top'}),
      error => console.log('ERROR', error)
    );
    // redirection vers l'accueil
    this.securityService.logout();
    this.router.navigate(['accueil']);
  }

  becomeInstitutionDialog(): void {
    const dialogRef = this.dialog.open(DialogCreationInstitutionComponent, { autoFocus : false});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.becomeInstitution();
      }
    });
  }

  becomeInstitution(): void {
    // envoyer une requête pour créer une entrée Institution dans la BDD
    this.http.post(AppComponent.SERVER_URL + '/profile/becomeInstitution.php', null, {}).subscribe(
      data => {
        this.securityService.logout();
        this.snackbar.open('Compte institution créé !\nVeuillez vous reconnecter.', 'Ignorer',
          { horizontalPosition: 'center', verticalPosition: 'bottom'});
      },
      error => console.log('Failure', error)
    );
    this.router.navigate(['login']);

  }

  getInstitution(): void {
    const request = this.http.get<Institution>(AppComponent.SERVER_URL + '/profile/getInstitutionPrivate.php');

    request.subscribe(data => {
      this.institutionObject = data;
      // pour afficher l'adresse
      if (this.institutionObject != null){
        this.address = cityToString(this.institutionObject.rue, this.institutionObject.ville);
      }

      this.getWatermark();
      this.imgProfil = this.getProfileImage();
    });
  }

  getWatermark(): void {
    this.http.get<Watermark>(AppComponent.SERVER_URL + '/profile/getWatermarkPrivate.php')
      .subscribe(data => {
        this.watermark = data;
        this.imgWatermark = this.getWatermarkPath();
      } );
  }
  getWatermarkPath(): string{
    return AppComponent.SERVER_BACKEND + '/media/' + this.institutionObject.id + '/wm/' + this.watermark.texte;
  }
  getProfileImage(): string {
    return AppComponent.SERVER_BACKEND + '/media/' + this.institutionObject.id + '/profil.jpg';
  }

}

@Component({
  templateUrl: 'dialog-delete-account.html'
})
export class DialogSuppressionCompteComponent {}

@Component({
  templateUrl: 'dialog-become-institution.html',
})
export class DialogCreationInstitutionComponent {}
