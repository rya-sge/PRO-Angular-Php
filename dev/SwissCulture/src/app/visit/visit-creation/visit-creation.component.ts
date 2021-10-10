/**
 * Date de création : 07.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour la création des visites
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SecurityService} from '../../authentification/security-service/security.service';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {Category} from '../../accueil/accueil.component';

@Component({
  selector: 'app-visit-creation',
  templateUrl: './visit-creation.component.html',
  styleUrls: ['./visit-creation.component.scss']
})
export class VisitCreationComponent implements OnInit {

  securityObject: AppUserAuth = null;
  msg: string; // Message de succès lors de la création d'une visite
  categories: Category[]; // Tableau contenant toutes las catégories disponibles
  // formulaire
  formGroup: FormGroup;
  control = new FormControl();

  constructor(private securityService: SecurityService, private formBuilder: FormBuilder, private http: HttpClient){
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.getCategory();
  }

  /**
   * Récupère toutes les catégories disponibles
   */
  getCategory(): void {
    this.http.get<Category[]>(AppComponent.SERVER_URL + '/home/getCategory.php')
      .subscribe(data => { this.categories = data['data']; this.createForm(); } );
  }

  /**
   * Crée le formulaire ainsi que la validation pour la création de visite
   */
  createForm(): void {
    this.formGroup = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null],
      categ: [null]
    });
  }

  /**
   * Gère l'envoi des infos en backend
   * @param post Tableau contenant les infos de création de la visite
   */
  onSubmit(post): void {
    this.http.post(AppComponent.SERVER_URL + '/visit/visit-private.php', JSON.stringify(post))
      .subscribe(
      data => {
        this.msg = 'La visite a été créée avec succès !';
        this.formGroup.reset(); // Efface le formulaire une fois envoyé
      },
      error => console.log('Failure', error)
    );
  }

}
