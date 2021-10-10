/**
 * Date de création : 26.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour la gestion de l'ajout d'images à une visite
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppComponent} from '../../../app.component';
import {Media} from '../../../media-manager/media-manager.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-visit-modif-dialog',
  templateUrl: './visit-modif-dialog.component.html',
  styleUrls: ['./visit-modif-dialog.component.scss']
})
export class VisitModifDialogComponent implements OnInit {

  pictures: Media[]; // Tableau des images d'une intitution
  formGroup: FormGroup; // Formulaire

  constructor(public dialogRef: MatDialogRef<VisitModifDialogComponent>, private http: HttpClient, private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.getImgs();
  }

  /**
   * Création dynamique du formulaire pour la sélection des images
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({ });
    for (const value of this.pictures) {
      this.formGroup.addControl(value.idMedia, this.formBuilder.control(false));
    }
  }

  /**
   * Récupération des images du backend
   */
  getImgs(): void {
    this.http.get<Media[]>(AppComponent.SERVER_URL + '/mediaManager/mediaManager.php')
      .subscribe(
        data => { this.pictures = data['data']; this.createForm(); },
        error => console.log('Failure', error)
      );
  }

  /**
   * Envoi des images choisies au backend
   *
   * @param post Tableau des avec les clés étant les id des images choisies
   */
  onSubmit(post): void {
    const param = {params: new HttpParams().set('idVisit', this.data)};
    this.http.post(AppComponent.SERVER_URL + '/visit/visit-private.php', JSON.stringify(post), param)
      .subscribe(
      data => console.log('Success', data),
      error => console.log('Failure', error)
    );
    // Reload de la page si des images ont été ajoutées
    this.dialogRef.close(true);
  }

}
