import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateIdentityComponent } from './components/SidebarComponents/create-identity/create-identity.component';
import { CreateClaimIssuerComponent } from './components/SidebarComponents/create-claim-issuer/create-claim-issuer.component';
import { CreateTokenComponent } from './components/SidebarComponents/create-token/create-token.component';
import { MintTokenComponent } from './components/SidebarComponents/mint-token/mint-token.component';

const routes: Routes = [
  { path: '', component: CreateIdentityComponent },
  { path: 'create-claim-issuer', component: CreateClaimIssuerComponent },
  { path: 'create-token', component: CreateTokenComponent },
  { path: 'mint-token', component: MintTokenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
