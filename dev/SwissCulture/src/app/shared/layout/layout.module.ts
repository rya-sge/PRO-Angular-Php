import {NgModule} from '@angular/core';
import { AppRouterModule } from '../../app-router.module';
import {CommonModule} from '@angular/common';

import { HeaderComponent} from './header.component';
import { FooterComponent} from './footer.component';

import { SidenavListComponent} from './sidenav-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidenavListComponent],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, MatSnackBarModule, MatMenuModule,
    AppRouterModule, CommonModule, MatTooltipModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidenavListComponent
  ]
})
export class LayoutModule { }
