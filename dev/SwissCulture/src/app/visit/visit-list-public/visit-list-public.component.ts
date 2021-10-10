/**
 * Date de création : 13.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour l'affichage de la liste des visites version publique
 */

import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Visit} from '../../shared/objects/Visit';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-visit-list-public',
  templateUrl: './visit-list-public.component.html',
  styleUrls: ['./visit-list-public.component.scss']
})

export class VisitListPublicComponent implements OnInit {

  visits: Visit[] = null;
  // Définit qu'est-ce que material affiche
  displayedColumns = ['title', 'description', 'viewButton'];

  @Input() idInstitution: string;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getListVisit();
  }

  /**
   * @brief Récupère la liste des visites visibles d'une institution donnée
   */
  getListVisit(): void {
    const param = {params: new HttpParams().set('idInstit', this.idInstitution)};
    this.http.get<Visit[]>(AppComponent.SERVER_URL + '/visit/visit-public.php', param)
      .subscribe(
        data => { this.visits = data; },
        error => console.log('Failure', error)
      );
  }
}
