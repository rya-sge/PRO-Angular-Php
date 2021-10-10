/**
 * Date de création :  09.04
 * Dernier contributeur : David Pellissier
 * Groupe : PRO-A-07
 * Description :
 * Composant permettant d'enregistrer des informations d'une institution
 * Remarque: il faut passer l'objet Institution en entrée du composant
 * Sources:
 * - regex pour URL: https://stackoverflow.com/a/3809435
 * - recherche dans un tableau: https://stackoverflow.com/a/8217584
 */

import {Component, Input, OnInit} from '@angular/core';
import {Institution} from '../../shared/objects/Institution';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {SecurityService} from '../../authentification/security-service/security.service';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {HttpClient} from '@angular/common/http';
import {City} from '../../shared/objects/City';
import {Watermark} from '../../shared/objects/Watermark';
import {AppComponent} from '../../app.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-institution-prive',
  templateUrl: './institution-private.component.html',
  styleUrls: ['./institution-private.component.scss']
})
export class InstitutionPrivateComponent implements OnInit {
  urlRegex = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

  securityObject: AppUserAuth = null;
  waiting = 2; // défaut
  ready = false;

  // formulaire
  formGroup: FormGroup;
  control = new FormControl();
  // Messages
  postMsg: string;
  postError: boolean;
  // liste des villes pour l'autocomplétion
  cities: City[] = null;
  filteredCities: Observable<string[]>;
  citiesNames: string[];

  // liste des domaines
  domains: string[];

  @Input() institutionObject: Institution;
  @Input() watermark: Watermark;

  constructor(private securityService: SecurityService, private formBuilder: FormBuilder, private http: HttpClient){
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.getCities();
    this.getDomains();
    this.createForm();
  }

  private _filter(value: string): string[] {
    if (typeof value === 'string' && value !== ''){
      const filterValue = value.toLowerCase();
      return this.citiesNames.filter(option => option.toLowerCase().startsWith(filterValue));
    }
    return null;
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group({
      nom: [this.institutionObject.nom, Validators.required],
      url: [this.institutionObject.url, Validators.pattern(this.urlRegex)],
      description: [this.institutionObject.description],
      adresse: this.formBuilder.group({
        npa : [this.institutionObject.ville.npa, Validators.required],
        ville: [this.institutionObject.ville.nom, Validators.required],
        rue : [this.institutionObject.rue, Validators.required]}),
      domaine: [this.institutionObject.domaine, Validators.required],
      watermark: this.formBuilder.group({
        type: [this.watermark.type, Validators.required],
        texte: [this.watermark.texte, Validators.maxLength(255)]
      })
      }
    );
  }

  // Nécessaire pour attendre que les 2 requêtes aient eu un résultat, afin de continuer
  waitingManager(): void {
    --this.waiting;

    if (this.waiting === 0){
      this.ready = true;
    }
  }

  submitInstitution(post): void {
    const address = this.formGroup.get('adresse');
    const valNpa: number = address.get('npa').value;
    const valName: string = address.get('ville').value;
    const city: City = {npa: valNpa, nom: valName};

    // Vérification que la ville et le npa soient correctement associés
    if (this.cities.some(c => c.nom === city.nom && c.npa === city.npa)) {
      this.ready = false;
      this.sendNewValues(post);

      this.postError = false;
    }
    else {
      this.postMsg = 'Erreur: le NPA et la ville ne correspondent pas';
      this.postError = true;
    }

    this.formGroup.markAsUntouched();
  }

  getCities(): void {
    this.http.get<City[]>(AppComponent.SERVER_URL + '/profile/getCities.php')
      .subscribe(data =>
      {
        this.cities = data;
        this.citiesNames = data.map(c => c.nom) ;
        this.filteredCities = this.formGroup.controls.adresse.valueChanges.pipe(
          startWith(''),
          map(name => this._filter(name.ville))
        );
        this.waitingManager();
      });
  }

  getDomains(): void {
    this.http.get<Domain[]>(AppComponent.SERVER_URL + '/profile/getDomains.php')
      .subscribe(data => { this.domains = data.map(domain => domain.name); this.waitingManager(); } );
  }

  getNpa(city: string): number {
    return this.cities.find(c => c.nom === city).npa;
  }

  sendNewValues(data): void {
    this.http.post(AppComponent.SERVER_URL + '/profile/updateInstitution.php', data).subscribe(
      success => {this.postMsg = 'Les informations ont été mises à jour, veuillez rafraîchir la page'; this.ready = true; },
      error => { this.postError = true; this.postMsg = 'Erreur lors de la mise à jour'; } );
  }
}

// Utilisé pour la requête GET Domains
interface Domain {
  name: string;
}

