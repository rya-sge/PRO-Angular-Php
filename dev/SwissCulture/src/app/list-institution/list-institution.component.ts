/**
 * Date de création     : 24.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Affichage de toutes les institutions
 * Remarque             : -
 */

import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

/**
 * Classe pour modéliser les institutions récupérées depuis le backend
 */
class Institution {
  id: number;
  description: string;
}

@Component({
  selector: 'app-list-institution',
  templateUrl: './list-institution.component.html',
  styleUrls: ['./list-institution.component.scss']
})
export class ListInstitutionComponent implements OnInit {

  // Tableau d'objet category pour récupérer les données du backend
  institutionsList: Institution[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getInstitutions();
  }

  /**
   * Récupération des visites
   */
  getInstitutions(): void {
    this.http.get<Institution[]>(AppComponent.SERVER_URL + '/home/getAllInstitutions.php')
      .pipe(map((data: Institution[]) => {
          this.institutionsList = data['data'];
          return this.institutionsList;
        }), catchError(error => {
          return throwError('Something went wrong for getInstitutions()');
        })
      ).subscribe(
      (res: Institution[]) => {
        this.institutionsList = res;
      });
  }
}
