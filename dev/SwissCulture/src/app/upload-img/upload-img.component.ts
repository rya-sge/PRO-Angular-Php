/**
 * Date de création     : 27.03.2021
 * Dernier contributeur : Dylan Canton, Ryan Sauge(fix tslint)
 * Groupe               : PRO-A-07
 * Description          : Permet l'envoi d'une ou plusieurs images vers le backend
 * Remarque             : -
 * Sources              : https://github.com/techiediaries/php-angular-file-upload/blob/master/backend/upload.php
 */

import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss']
})
export class UploadImgComponent implements OnInit {

  // Construction du client http
  constructor(private http: HttpClient) {
  }

  @Input() isWatermark = 'false';
  @Input() isProfile = 'false';

  // Nom du fichier
  fileName = '';

  // Extension du fichier
  extension = '';

  // Extension du fichier
  validExt = true;

  // Compteur d'extensions invalides pour le multi-upload
  validExtCompteur: number;

  msg: string;
  isErrorMsg = false;

  // Liste pour stocker les extensions authorisées
  // tslint:disable-next-line:ban-types
  validExtensions: Array<String> = ['jpg', 'jpeg', 'JPG', 'png', 'PNG'];

  // Liste pour stocker l'upload de plusieurs images
  fileList: Array<File>;

  // URL du serveur
  SERVER_URL = AppComponent.SERVER_URL;

  ngOnInit(): void {
  }

  // Vérifie si l'extension est valide
  // tslint:disable-next-line:ban-types
  checkValidExtension(ext: String): boolean{
    let valid = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.validExtensions.length; i++){
        if (ext === this.validExtensions[i]){
          valid = true;
        }
    }

    return valid;
  }

  onFileSelected(event): void {

    this.validExtCompteur = 0;

    // On récupère l'image de l'input
    this.fileList = event.target.files;

    if (this.fileList) {

      // La boucle for of ne fonctionne pas dans ce cas
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.fileList.length; i++){

        // RECUPERATION DES INFORMATIONS
        // Récuperation du nom
        this.fileName = this.fileList[i].name;

        this.extension = this.fileList[i].name.split('.').pop();

        // Vérification de l'extension
        if (this.checkValidExtension(this.extension) === false){
          console.log('extension invalide : ' + this.extension);
          this.validExt = false;
          ++this.validExtCompteur;
        }
        else{
          this.validExt = true;

          // CREATION OBJET FORMDATA

          // Création objet formData (Objet d'Angular pour les objets à envoyer en http)
          const formData = new FormData();

          // Ajout du fichier "file" à l'objet formData
          formData.append('image', this.fileList[i]);
          formData.append('isWatermark', this.isWatermark);
          formData.append('isProfile', this.isProfile);

          // ENVOIE DE LA REQUETE

          // Envoie de la requete http
          const upload$ = this.http.post<any>(AppComponent.SERVER_URL + '/upload.php', formData);
          upload$.subscribe({
            next: data => {
              this.msg = 'Image(s) uploadée(s) avec succès ! Vous pouvez recharger la page';
              this.isErrorMsg = false;
            }   ,
            error: error => {
              this.msg = 'Erreur d\'envoi de l\'image';
              console.error('Upload error in frontend', error);
              this.isErrorMsg = true;
            }
          });
        }
      }

      // Affichage du message d'erreur d'extension pour le multi upload
      if (this.validExtCompteur > 0){
        this.validExt = false;
      }
    }
  }
}
