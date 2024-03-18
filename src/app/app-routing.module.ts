import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateIdentityComponent } from './components/SidebarComponents/create-identity/create-identity.component';
import { CreateClaimIssuerComponent } from './components/SidebarComponents/create-claim-issuer/create-claim-issuer.component';
import { CreateTokenComponent } from './components/SidebarComponents/create-token/create-token.component';

const routes: Routes = [
  { path: '', component: CreateIdentityComponent },
  { path: 'create-claim-issuer', component: CreateClaimIssuerComponent },
  { path: 'create-token', component: CreateTokenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
