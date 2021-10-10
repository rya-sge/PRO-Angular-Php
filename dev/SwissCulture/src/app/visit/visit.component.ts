/**
 * Date de création : 21.05.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour l'affichage d'une visite
 * Sources :
 * Code d'exemple de la librairie
 * https://stackblitz.com/edit/angular-bkosu5?file=src%2Fapp%2Fapp.component.ts
 */

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {ImageVisit} from '../shared/objects/ImageVisit';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {VisiteImageDialogueComponent} from './visite-image-dialogue/visite-image-dialogue.component';

@Component({
  selector: 'app-visite',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss'],

})
export class VisitComponent implements OnInit, AfterViewInit {
  // Tableau d'images qui représente une visite
  imageObject: ImageVisit[];
  idVisit: string;
  private mobile: any = false;
  indexImage = 0;
  isClosed: any = false;

  currentIndex: any = -1;
  showFlag: any = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, public dialog: MatDialog,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    // Récupère l'id de la visite depuis le paramètre :id de l'url
    this.idVisit = this.route.snapshot.paramMap.get('id');
    this.getFullVisit();
    if (window.screen.width <= AppComponent.MOBILE_SIZE) {
      this.mobile = true;
    }
    this.openDialog();

  }

  /**
   * Afficher les lightbox derrière le diaporama
   */
  ngAfterViewInit(): void {
    this.showLightbox(0);
  }

  /**
   * Afficher le diaporam
   * @param index de l'image
   */
  showLightbox(index): void {
    this.isClosed = false;
    this.currentIndex = index;
    this.indexImage = index;
    this.showFlag = true;
    this.openDialog();
  }

  /**
   * Fermer le diaporama
   */
  closeEventHandler(): void {
    this.isClosed = true;
    this.showFlag = false;
    this.currentIndex = -1;
  }

  /**
   * @brief Récupère la totalité des images et leurs détails composant une visite
   */
  getFullVisit(): void {
    const param = {params: new HttpParams().set('idVisit', this.idVisit)};
    this.http.get<ImageVisit[]>(AppComponent.SERVER_URL + '/visit/visit-public.php', param)
      .subscribe(
        data => {
          this.imageObject = data;
        },
        error => console.log('Failure', error)
      );
  }

  increment(): void {
    this.indexImage = this.indexImage + 1;
  }

  decrement(): void {
    if (this.indexImage > 0) {
      this.indexImage = this.indexImage - 1;
    }
  }

  /**
   * Afficher les informations d'une visite
   */
  openDialog(): void {

    if (this.isClosed === false && this.imageObject[this.indexImage] != null) {
      // Rien a afficher
      let descriptionNotExist = false;
      let titleNotExist = false;
      let auteurNotExist = false;

      if (this.imageObject[this.indexImage].description == null || this.imageObject[this.indexImage].description.length === 0) {
        descriptionNotExist = true;
      }

      if (this.imageObject[this.indexImage].auteur == null || this.imageObject[this.indexImage].auteur.length === 0) {
        auteurNotExist = true;
      }

      if (this.imageObject[this.indexImage].title == null || this.imageObject[this.indexImage].title.length === 0) {
        titleNotExist = true;
      }


      if (descriptionNotExist && titleNotExist && auteurNotExist) {
        return;
      }
      this.matDialog.open(VisiteImageDialogueComponent, {
        data: {
          description: this.imageObject[this.indexImage].description,
          auteur: this.imageObject[this.indexImage].auteur,
          title: this.imageObject[this.indexImage].title
        },
        position: {
          bottom: '0'
        }
      });
    } else {
      this.isClosed = false;
    }
  }
}
