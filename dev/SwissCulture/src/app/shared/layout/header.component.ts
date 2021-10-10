import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';
import {SecurityService} from '../../authentification/security-service/security.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  mobile: boolean;
  securityObject: AppUserAuth = null;
  title = ''; // source pour plus tard: https://angular.io/guide/router-tutorial-toh#adding-routable-animations

  constructor(private securityService: SecurityService, private snackBar: MatSnackBar) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.securityService.isLogged();
    if (window.screen.width <= AppComponent.MOBILE_SIZE) { // 768px portrait
      this.mobile = true;
    }
    if (this.securityObject.isAuthenticated && this.securityObject.isInstitution && !this.securityObject.isValid){
      this.snackBar.open(
        'Votre compte n\'a pas été validé, veuillez faire une demande dans votre page de profil.',
        'Ignorer',
        { horizontalPosition: 'center', verticalPosition: 'bottom'});
    }

  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logout(): void {
    this.securityService.logout();
  }

}
