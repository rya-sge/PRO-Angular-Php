/**
 * Date de création     : 24.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Affichage des visites
 * Remarque             : -
 */

import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

/**
 * Classe pour modéliser les visites récupérées depuis le backend
 */
class Visit {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-list-visit',
  templateUrl: './list-visit.component.html',
  styleUrls: ['./list-visit.component.scss']
})
export class ListVisitComponent implements OnInit {

  // Tableau d'objet category pour récupérer les données du backend
  visitList: Visit[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getVisits();
  }

  /**
   * Récupération des visites
   */
  getVisits(): void {
    this.http.get<Visit[]>(AppComponent.SERVER_URL + '/home/getAllVisit.php')
      .pipe(map((data: Visit[]) => {
          this.visitList = data['data'];
          return this.visitList;
        }), catchError(error => {
          return throwError('Something went wrong for getVisits()');
        })
      ).subscribe(
      (res: Visit[]) => {
        this.visitList = res;
      });
  }

}
