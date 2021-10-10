import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {SecurityService} from '../../authentification/security-service/security.service';
import {AppUserAuth} from '../../authentification/security-service/app-user-auth';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  public mobile = false;

  securityObject: AppUserAuth = null;

  constructor(private securityService : SecurityService) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    if (window.screen.width <= 750) {
      this.mobile = true;
    }
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  logout(): void {
    this.securityService.logout();
  }

}
