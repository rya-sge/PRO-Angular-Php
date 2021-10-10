/**
 * Date de création     : 19.05.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Affichage des visites pour une catégorie donnée
 * Remarque             : -
 */

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppComponent} from "../app.component";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import { ActivatedRoute } from '@angular/router';

/**
 * Classe pour modéliser les visites récupérées depuis le backend
 */
class Visit {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-category-visit',
  templateUrl: './category-visit.component.html',
  styleUrls: ['./category-visit.component.scss']
})
export class CategoryVisitComponent implements OnInit {

  // Tableau d'objet category pour récupérer les données du backend
  visitList: Visit[];

  //ID de la catégorie
  idCategory: number;
  private sub: any;

  constructor(private http: HttpClient, private route:ActivatedRoute) { }

  ngOnInit(): void {
    //Récupère le paramètre de la route
    this.sub = this.route.params.subscribe(params => {
      this.idCategory = params['id'];
    });

    this.getVisits();
  }

  /**
   * Récupération des visites
   */
  getVisits() {
    this.http.post<Visit[]>(AppComponent.SERVER_URL + '/home/getVisitPerCategory.php', this.idCategory)
      .pipe(map((data: Visit[]) => {
          this.visitList = data['data'];
          return this.visitList;
        }), catchError(error => {
          return throwError('Something went wrong for getVisits()');
        })
      ).subscribe(
      (res: Visit[]) => {
        this.visitList = res;
      })
  }
}
