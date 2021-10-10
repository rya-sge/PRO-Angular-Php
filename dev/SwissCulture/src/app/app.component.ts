import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Url du server, à modifier selon la configuration personnelle
  static SERVER_URL_ROOT = 'http://localhost';
  static SERVER_BACKEND = AppComponent.SERVER_URL_ROOT + '/Backend';
  static SERVER_URL = AppComponent.SERVER_BACKEND + '/api';
  static SERVEUR_AUTHENTIFICATION = AppComponent.SERVER_URL + '/authentification';
  static MOBILE_SIZE = 750;
  static SERVER_DOMAINE = ['www.swissculture.tk'];
  static API_FACEBOOK_ID = 'YOUR_APP_ID';
}

