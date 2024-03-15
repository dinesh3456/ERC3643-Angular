import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  componentToShow: string = '';
  isWalletConnected: boolean = false;

  onButtonClicked(component: string) {
    if (this.isWalletConnected) {
      this.componentToShow = component;
    } else {
      alert('Please connect your wallet first.');
    }
  }

  onWalletConnected(connected: boolean) {
    this.isWalletConnected = connected;
  }
}
