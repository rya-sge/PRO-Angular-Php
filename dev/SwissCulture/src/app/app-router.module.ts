import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {PageNotFoundComponent} from './shared/error/page-not-found/page-not-found.component';
import {FacebookComponent} from './authentification/facebook/facebook.component';
import {InstitutionPublicComponent} from './profile/institution-public/institution-public.component';
import {PrivateComponent} from './profile/private/private.component';
import {MediaManagerComponent} from './media-manager/media-manager.component';
import {VisitCreationComponent} from './visit/visit-creation/visit-creation.component';
import {CategoryVisitComponent } from './category-visit/category-visit.component';
import {VisitListInstitComponent} from './visit/visit-list-instit/visit-list-instit.component';
import {AuthGuard} from './authentification/security-service/auth.guard';
import {InstitutionGuard} from './authentification/security-service/institution.guard';
import {VisitComponent} from './visit/visit.component';
import {ListInstitutionComponent} from './list-institution/list-institution.component';
import {ListVisitComponent} from './list-visit/list-visit.component';
import {VisitModifComponent} from './visit/visit-modif/visit-modif.component';
import {TermsOfUseComponent} from "./shared/terms-of-use/terms-of-use.component";

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path : 'accueil', component: AccueilComponent},
  { path : 'login', component: FacebookComponent},
  { path : 'institution/:id', component: InstitutionPublicComponent},
  { path : 'category-visit/:id', component: CategoryVisitComponent},
  { path : 'profil', component: PrivateComponent, canActivate: [AuthGuard]},
  { path : 'mediaManager', component: MediaManagerComponent, canActivate: [InstitutionGuard]},
  { path : 'visite/:id', component: VisitComponent},
  { path : 'list-institution', component: ListInstitutionComponent},
  { path : 'list-visit', component: ListVisitComponent},
  { path : 'visite-modif/:id', component: VisitModifComponent, canActivate: [InstitutionGuard]},
  { path : 'conditions-utilisation', component: TermsOfUseComponent},
  { path: '**', component: PageNotFoundComponent }  // erreur 404: redirection vers l'accueil
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule {
}
