import { NgModule } from '@angular/core';

import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CreateIdentityComponent } from './components/SidebarComponents/create-identity/create-identity.component';
import { CreateClaimIssuerComponent } from './components/SidebarComponents/create-claim-issuer/create-claim-issuer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConnectWalletButtonComponent } from './components/navbar/connect-wallet-button/connect-wallet-button.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainComponent } from './components/main/main.component';
import { CreateTokenComponent } from './components/SidebarComponents/create-token/create-token.component';
import { LoaderComponent } from './components/home/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateIdentityComponent,
    CreateClaimIssuerComponent,
    HomeComponent,
    NavbarComponent,
    ConnectWalletButtonComponent,
    SidebarComponent,
    MainComponent,
    CreateTokenComponent,
    LoaderComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, ReactiveFormsModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
