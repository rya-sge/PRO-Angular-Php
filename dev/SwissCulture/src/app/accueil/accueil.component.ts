/**
 * Date de création     : 01.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Page d'accueil de la webApp
 * Remarque             : Pour passer des paramètres dans une route :
 *                        https://www.tektutorialshub.com/angular/angular-passing-parameters-to-route/
 */

import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

/**
 * Classe pour modéliser les institutions récupérées depuis le backend
 */
class Institution {
  id: number;
  name: string;
}

/**
 * Classe pour modéliser les visites récupérées depuis le backend
 */
class Visit {
  id: number;
  name: string;
}

/**
 * Classe pour modéliser les categories récupérées depuis le backend
 */
export class Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.getInstitution();
    this.getVisit();
    this.getCategory();
  }

  // Tableau d'objet Institution pour récupérer les données du backend
  institutionList: Institution[];

  // Tableau d'objet Institution pour récupérer les données du backend
  visitList: Visit[];

  // Tableau d'objet category pour récupérer les données du backend
  categoryList: Category[];

  @Input() categoryColSize = 4;
  @Input() colSize = 3;

  ngOnInit(): void {
  }

  onResize(event): void {
    this.categoryColSize = (event.target.innerWidth <= 600) ? 1 : 4;
    this.colSize = (event.target.innerWidth <= 600) ? 1 : 3;
  }

  /**
   * Récupération des institutions
   */
  getInstitution(): void {
    this.http.get<Institution[]>(AppComponent.SERVER_URL + '/home/getInstitution.php')
      .pipe(map((data: Institution[]) => {
          this.institutionList = data['data'];
          return this.institutionList;
        }), catchError(error => {
          return throwError('Something went wrong for getInstitution()');
        })
      ).subscribe(
      (res: Institution[]) => {
        this.institutionList = res;
      });
  }

  /**
   * Récupération des visites
   */
  getVisit(): void {
    this.http.get<Visit[]>(AppComponent.SERVER_URL + '/home/getVisit.php')
      .pipe(map((data: Visit[]) => {
          this.visitList = data['data'];
          return this.visitList;
        }), catchError(error => {
          return throwError('Something went wrong for getVisit()');
        })
      ).subscribe(
      (res: Visit[]) => {
        this.visitList = res;
      });
  }

  /**
   * Récupération des categories
   */
  getCategory(): void {
    this.http.get<Category[]>(AppComponent.SERVER_URL + '/home/getCategory.php')
      .pipe(map((data: Category[]) => {
          this.categoryList = data['data'];
          return this.categoryList;
        }), catchError(error => {
          return throwError('Something went wrong for getCategory()');
        })
      ).subscribe(
      (res: Category[]) => {
        this.categoryList = res;
      });
  }
}
