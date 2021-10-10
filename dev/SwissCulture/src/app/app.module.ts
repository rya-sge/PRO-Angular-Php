/*
Sources : https://www.techiediaries.com/angular/jwt-authentication-angular-9-example/
 https://www.npmjs.com/package/@auth0/angular-jwt
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouterModule } from './app-router.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisitComponent } from './visit/visit.component';
import { LayoutModule } from './shared/layout/layout.module';
import { AccueilComponent } from './accueil/accueil.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './material.module';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig} from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
import { FacebookComponent } from './authentification/facebook/facebook.component';
import { UploadImgComponent } from './upload-img/upload-img.component';
import { InstitutionPublicComponent} from './profile/institution-public/institution-public.component';
import { InstitutionPrivateComponent} from './profile/institution-private/institution-private.component';
import {PrivateComponent, DialogSuppressionCompteComponent, DialogCreationInstitutionComponent} from './profile/private/private.component';
import { JwtModule } from '@auth0/angular-jwt';
import {TokenInterceptor} from './authentification/security-service/TokenInterceptor';
import { MediaManagerComponent } from './media-manager/media-manager.component';
import { LightboxModule } from 'ngx-lightbox';
import { MediaManagerDialogComponent } from './media-manager-dialog/media-manager-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VisitCreationComponent } from './visit/visit-creation/visit-creation.component';
import { CategoryVisitComponent } from './category-visit/category-visit.component';
import { VisitListInstitComponent } from './visit/visit-list-instit/visit-list-instit.component';
import { VisitListPublicComponent } from './visit/visit-list-public/visit-list-public.component';
import { ListInstitutionComponent } from './list-institution/list-institution.component';
import { ListVisitComponent } from './list-visit/list-visit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { VisiteImageDialogueComponent } from './visit/visite-image-dialogue/visite-image-dialogue.component';
import { VisitModifComponent } from './visit/visit-modif/visit-modif.component';
import { VisitModifDialogComponent } from './visit/visit-modif/visit-modif-dialog/visit-modif-dialog.component';
import {TermsOfUseComponent} from './shared/terms-of-use/terms-of-use.component';

export function tokenGetter(): string {
  return localStorage.getItem('bearerToken');
}

@NgModule({
    declarations: [
        VisitComponent,
        AccueilComponent,
        InstitutionPublicComponent,
        InstitutionPrivateComponent,
        FacebookComponent,
        UploadImgComponent,
        DialogSuppressionCompteComponent, DialogCreationInstitutionComponent, MediaManagerComponent, MediaManagerDialogComponent,
        VisitCreationComponent,
        CategoryVisitComponent,
        PrivateComponent,
        DialogSuppressionCompteComponent,
        DialogCreationInstitutionComponent,
        MediaManagerComponent,
        MediaManagerDialogComponent,
        VisitCreationComponent,
        VisitListInstitComponent,
        VisitListPublicComponent,
        ListInstitutionComponent,
        ListVisitComponent,
        VisiteImageDialogueComponent,
        VisitModifComponent,
        VisitModifDialogComponent, TermsOfUseComponent
    ],
  imports: [
    NgImageFullscreenViewModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    LayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    MatGridListModule,
    MatIconModule,
    HttpClientModule,
    SocialLoginModule,
    LightboxModule,
    MatDialogModule,

    /*
    On envoie le token que vers notre domaine(allowdDomains)
    login.php n'a pas besoin de recevoir le token(disallowdRoutes)
     */
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('bearerToken');
        },
        allowedDomains: AppComponent.SERVER_DOMAINE,
        // Enlever pour effectuer les tests
        // disallowedRoutes: ['http://localhost/v7/Backend/api/login.php'],
        skipWhenExpired: true // Ne pas envoyer token si expiré
      },
    }),
    FormsModule,
    NgbModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(AppComponent.API_FACEBOOK_ID)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { // Intercepter les requêtes http pour y injecter le token
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

