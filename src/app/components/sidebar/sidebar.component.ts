import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  buttons: Array<any> = [
    { name: "Create Identity", path: "/" },
    { name: "Create Claim Issuer", path: "/create-claim-issuer" },
    { name: "Create Token", path: "/create-token" },
    { name: "Mint Token", path: "/mint-token" }
  ];
  activePath: string = '/';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activePath = event.url;
    });
  }

  navigateToUrl(path: string) {
    this.router.navigateByUrl(path);
  }
}