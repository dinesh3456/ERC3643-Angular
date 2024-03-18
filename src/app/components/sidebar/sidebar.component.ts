import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  buttons: Array<any> = [
    { name: "Create Identity", path: "/" },
    { name: "Create Claim Issuer", path: "/create-claim-issuer" },
    { name: "Create Token", path: "/create-token" },
  ]

  constructor (private router: Router) { }

  navigateToUrl (path: string) {
    this.router.navigateByUrl(path)
  }
}