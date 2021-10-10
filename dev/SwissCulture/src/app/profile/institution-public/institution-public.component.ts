/**
 * Date de création :  06.04
 * Dernier contributeur : David Pellissier
 * Groupe : PRO-A-07
 * Description :
 * Composant affichant le profil public de l'institution
 * Remarque: l'id de l'institution est passée par la route, dans l'url. Exemple: <serveur>/institution/23
 */

import { Component, OnInit } from '@angular/core';
import {Institution, cityToString} from '../../shared/objects/Institution';
import {VisitComponent} from '../../visit/visit.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-institution-public',
  templateUrl: './institution-public.component.html',
  styleUrls: ['./institution-public.component.scss']
})
export class InstitutionPublicComponent implements OnInit {

  idInstitution: string;
  institutObject: Institution = null;
  profileImg: string;
  categories: string[] = null;
  visites: VisitComponent[];
  address: string;
  mobile: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

    if (window.screen.width <= AppComponent.MOBILE_SIZE) { // 768px portrait
      this.mobile = true;
    }

    this.idInstitution = this.route.snapshot.paramMap.get('id');
    this.getInstitution();
    this.profileImg = this.getProfileImage();
    /* on pourra calculer les catégories selon les visites disponibles */
    this.getCategories();
  }

  getInstitution(): void {
    const request = this.http.post<Institution>(AppComponent.SERVER_URL + '/profile/getInstitutionPublic.php',
      { id : this.idInstitution});

    request.subscribe(data => {
      this.institutObject = data;
      this.address = cityToString(this.institutObject.rue, this.institutObject.ville);
      },
      error => {
        if (this.institutObject == null) {
          this.router.navigate(['404']);
        }
      }
    );
  }

  getProfileImage(): string {
    return AppComponent.SERVER_BACKEND  + '/media/' + this.idInstitution + '/profil.jpg';
  }
  getCategories(): void {
    const request = this.http.post<string[]>(AppComponent.SERVER_URL + '/profile/getInstitutionCategories.php',
      { id : this.idInstitution});
    request.subscribe(data => {
      this.categories = data;
    });
  }

}
