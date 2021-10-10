/**
 * Date de création     : 01.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Media Manager pour la gestion des images d'une institution
 * Remarque             : -
 */

import {Component, OnInit} from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MediaManagerDialogComponent} from '../media-manager-dialog/media-manager-dialog.component';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppComponent} from '../app.component';

/**
 * Classe pour modéliser les informations d'une image récupérée depuis le backend
 */
export class Media {
  nomFichier: string;
  idMedia: string;
}

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent implements OnInit {

  // Sources pour gallerie
  // https://ngx-gallery.netlify.app/#/advanced
  // https://www.eduforbetterment.com/open-image-gallery-in-lightbox-in-angular-apps/
  // https://phpenthusiast.com/blog/develop-angular-php-app-getting-the-list-of-items
  // https://www.techiediaries.com/angular/php-angular-9-crud-api-httpclient/

  // Sources pour le dialog
  // https://www.techiediaries.com/angular-material-dialogs/

  // Tableau pour les images de la gallerie
  album: any = [];

  // Tableau d'objets Media pour récupérer les données du backend
  images: Media[];

  /**
   * Récupération du lien des images du backend
   */
  getImgs(): Observable<Media[]> {
    return this.http.get<Media[]>(AppComponent.SERVER_URL + '/mediaManager/mediaManager.php')
      .pipe(map((data: Media[]) => {
        this.images = data['data'];
        return this.images;
        }), catchError(error => {
          return throwError('Error in media-manager');
        })
      );
  }

  constructor(private lightbox: Lightbox, private matDialog: MatDialog, private http: HttpClient) {

    /**
     * Ajout des liens récupérés dans le backend dans un tableau pour configurer la gallerie
     */
    this.getImgs().subscribe(
      (res: Media[]) => {
        this.images = res;

        // On push chaque lien dans le tableau "album"
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.images.length; i++) {
          const pathImg = this.images[i].nomFichier;
          const idImg   = this.images[i].idMedia;
          const img = { pathImg, idImg };
          this.album.push(img);
        }
      });
  }

  ngOnInit(): void {
  }

  /**
   * Ouvre le popup lors du clique sur une image
   * @param idImg ID de l'image
   */
  openDialog(idImg: number): void {
    const dialogConfig = new MatDialogConfig();

    // Id de l'image cliquée, on pass cette valeur au dialogue
    dialogConfig.data = idImg;
    const dialogRef = this.matDialog.open(MediaManagerDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(value => {
      // Si la requête est une suppression, nécessité de reload la page
      // tslint:disable-next-line:triple-equals
      if (value == true){
        window.location.reload();
      }
    });
  }
}
