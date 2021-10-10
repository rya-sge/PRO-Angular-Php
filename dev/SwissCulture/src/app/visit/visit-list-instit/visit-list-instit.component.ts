/**
 * Date de création : 13.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier de front-end pour l'affichage de la liste des visites version institution
 */

import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SecurityService} from '../../authentification/security-service/security.service';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {Visit} from '../../shared/objects/Visit';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-visit-list-instit',
  templateUrl: './visit-list-instit.component.html',
  styleUrls: ['./visit-list-instit.component.scss']
})

export class VisitListInstitComponent implements OnInit {

  securityObject: AppUserAuth = null;
  visits: Visit[] = null;
  displayedColumns = ['titre', 'description', 'estVisible', 'modifyButton'];

  constructor(private securityService: SecurityService, private http: HttpClient) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.getListVisit();
  }

  /**
   * @brief Récupère la liste des visites d'une institution actuellement connectée
   */
  getListVisit(): void {
    this.http.get<Visit[]>(AppComponent.SERVER_URL + '/visit/visit-private.php')
      .subscribe(
        data => { this.visits = data; },
        error => console.log('Failure', error)
      );
  }

  /**
   * @brief Converti un booléen en texte pour l'affichage
   * @param boolToConvert Le Booléen a convertir
   */
  convertBool(boolToConvert): string {
    if (boolToConvert === '1') {
      return 'Oui';
    } else {
      return 'Non';
    }
  }
}
