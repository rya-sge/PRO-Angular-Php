/**
 * Date de création : 25.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour la modification des visites
 */

import {Component, OnInit} from '@angular/core';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SecurityService} from '../../authentification/security-service/security.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {ActivatedRoute} from '@angular/router';
import {Visit} from '../../shared/objects/Visit';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VisitModifDialogComponent} from './visit-modif-dialog/visit-modif-dialog.component';
import {Media} from '../../media-manager/media-manager.component';
import {Category} from '../../accueil/accueil.component';

@Component({
  selector: 'app-visit-modif',
  templateUrl: './visit-modif.component.html',
  styleUrls: ['./visit-modif.component.scss']
})
export class VisitModifComponent implements OnInit {

  securityObject: AppUserAuth = null;

  // Formulaire
  formGroupVisit: FormGroup;
  control = new FormControl();

  categories: Category[]; // Liste des catégories disponibles
  categVisit: Category[]; // Liste des catégories de la visite

  visit: Visit; // Infos de la visite
  pictures: Media[]; // Liste des médias de la visite
  idVisit: string;
  // Gestion tableau des images
  displayedColumns = ['picture', 'deleteButton'];

  constructor(private route: ActivatedRoute, private securityService: SecurityService, private formBuilder: FormBuilder,
              private http: HttpClient, private matDialog: MatDialog){
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    // Récupère l'id de la visite depuis le paramètre :id de l'url
    this.idVisit = this.route.snapshot.paramMap.get('id');
    this.getFullVisit();
  }

  /**
   * Récupère toutes les infos d'une visite (média et catégories compris)
   */
  getFullVisit(): void {
    const param = {params: new HttpParams().set('idVisit', this.idVisit)};
    this.http.get<any>(AppComponent.SERVER_URL + '/visit/visit-private.php', param)
      .subscribe(
        data => { this.visit = data.visit; this.pictures = data.pictures; this.categVisit = data.categories; this.getCategory(); },
        error => console.log('Failure', error)
      );
  }

  /**
   * Convertit un tableau d'objet de nombres en tabeau simple de string
   * @return string[] Tableau d'id sous forme de string
   */
  convertArray(): string[] {
    const temp: string[] = [];
    for (const i of this.categVisit) {
      temp.push(String(i.id));
    }
    return temp;
  }

  /**
   * Récupère la liste de catégories disponibles
   */
  getCategory(): void {
    this.http.get<Category[]>(AppComponent.SERVER_URL + '/home/getCategory.php')
      .subscribe(data => { this.categories = data['data']; this.createFormVisit(); } );
  }

  /**
   * Crée le formulaire pour la modification de la visite
   */
  createFormVisit(): void {
    this.formGroupVisit = this.formBuilder.group({
      title: [this.visit[0].titre, Validators.required],
      description: [this.visit[0].description],
      categ: [this.convertArray()],
      visible: [this.visit[0].estVisible === '1'] // Correction pb de conversion avec Boolean
    });
  }

  /**
   * Gestion de l'ouverture d'un composant pour l'ajout des images
   */
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    // Id de la visite, on passe cette valeur au dialogue
    dialogConfig.data = this.idVisit;

    // Appel de la boite de dialogue de choix des images
    const dialogRef = this.matDialog.open(VisitModifDialogComponent, dialogConfig);

    //
    dialogRef.afterClosed().subscribe(value => {

      // Reload de la page si modif des images de la visite
      if (value === true){
        window.location.reload();
      }
    });
  }

  /**
   * Envoie les modifications de la visite en backend
   * @param formData Tableau contenant les infos de la visite
   */
  onSubmit(formData): void {
    // Création du paramètre GET
    const param = {params: new HttpParams().set('idVisit', this.idVisit)};
    this.http.put(AppComponent.SERVER_URL + '/visit/visit-private.php', JSON.stringify(formData), param)
      .subscribe(
        data => {console.log('Success', data); window.location.reload(); },
        error => console.log('Failure', error)
      );
  }

  /**
   * Supresssion d'une image de la visite
   * @param idMedia Id du media à supprimer de la visite
   */
  deletePicture(idMedia): void {
    // Création des paramètres GET
    const param = {params: new HttpParams().set('idMedia', idMedia).set('idVisit', this.idVisit)};
    this.http.delete(AppComponent.SERVER_URL + '/visit/visit-private.php', param)
      .subscribe(
        data => { console.log('Success', data); window.location.reload(); },
        error => console.log('Failure', error)
      );
  }

  /**
   * Suppression de la visite
   */
  deleteVisit(): void {
    // Création du paramètre GET
    const param = {params: new HttpParams().set('idVisit', this.idVisit)};
    this.http.delete(AppComponent.SERVER_URL + '/visit/visit-private.php', param)
      .subscribe(
        data => { console.log('Success', data); window.location.replace('/profil'); },
        error => console.log('Failure', error)
      );
  }
}
