/**
 * Date de création     : 10.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Pop-up pour la gestion d'une image lors du clique sur une image du Media Manager
 * Remarque             : -
 */

import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

/**
 * Classe pour modéliser les informations d'une image récupérée depuis le backend
 */
// tslint:disable-next-line:class-name
class imageData {
  titre: string;
  auteur: string;
  description: string;
}

@Component({
  selector: 'app-media-manager-dialog',
  templateUrl: './media-manager-dialog.component.html',
  styleUrls: ['./media-manager-dialog.component.scss']
})
export class MediaManagerDialogComponent implements OnInit {

  // Sources pour le dialog
  // https://www.techiediaries.com/angular-material-dialogs/

  // Formulaire
  formGroup: FormGroup;
  control = new FormControl();
  post: any = '';
  msg: string;

  // Tableau d'objet imageData pour récupérer les données du backend
  infoImages: imageData[];

  deleteClose: boolean;

  constructor(public dialogRef: MatDialogRef<MediaManagerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,  private formBuilder: FormBuilder, private http: HttpClient) {

    // Récupération des infos de l'image lors de la construction du dialogue
    this.getData();

    // Boolean pour gérer le reload d'une page lors de la suppression d'une image
    this.deleteClose = false;
  }

  ngOnInit(): void {
    // Création du formulaire
    this.createForm();
  }

  /**
   * Création de la forme
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      title: [null],
      author: [null],
      description: [null],
      idMedia: this.data
    });
  }

  /**
   * Récupération des informations de l'image
   */
  getData(): void {
     this.http.post<imageData[]>(AppComponent.SERVER_URL + '/mediaManager/getInfoImage.php', this.data)
      .pipe(map((data: imageData[]) => {
          this.infoImages = data['data'];
          return this.infoImages;
        }), catchError(error => {
          return throwError('Something went wrong for getData()');
        })
      ).subscribe(
       (res: imageData[]) => {
         this.infoImages = res;

         // MAJ des valeurs de champs du formulaire avec les infos récupérées
         this.formGroup.patchValue({
           title: this.infoImages[0].titre,
           author: this.infoImages[0].auteur,
           description: this.infoImages[0].description
         });
       });
  }

  /**
   * Modification des informations d'une image
   */
  onSubmit(post): void {
    this.http.post(AppComponent.SERVER_URL + '/mediaManager/updateImage.php', JSON.stringify(post))
      .subscribe(
        data => this.msg = 'L\'image a été modifiée avec succès',
        error => this.msg = 'Erreur de modofication de l\'image'
      );
  }

  /**
   * Suppression d'une image
   */
  onSubmitDelete(): void {
    this.http.post(AppComponent.SERVER_URL + '/mediaManager/deleteImage.php', this.data)
      .subscribe(
        data => console.log('success', data),
        error => console.log('Failure', error)
      );

    // Passe un boolean au parent pour indiquer de reload la page
    this.deleteClose = true;
    this.dialogRef.close(this.deleteClose);
  }
}
