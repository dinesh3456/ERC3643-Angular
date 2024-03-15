import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connect-wallet-button',
  templateUrl: './connect-wallet-button.component.html',
  styleUrls: ['./connect-wallet-button.component.css'] // Corrected styleUrl to styleUrls
})
export class ConnectWalletButtonComponent implements OnInit, OnDestroy {
  address: any;
  signer: any;
  private addressSubscription!: Subscription;

  constructor(public signService: SignService) { }

  ngOnInit(): void {
    this.addressSubscription = this.signService.address$.subscribe(
      (address) => {
        this.address = address;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.addressSubscription) {
      this.addressSubscription.unsubscribe();
    }
  }

  async connectSigner() {
    await this.signService.getSigner()
  }
}