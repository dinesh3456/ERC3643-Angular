import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SignService {
  private _signerSubject = new BehaviorSubject<any>(null);
  signer$ = this._signerSubject.asObservable();
  private _addressSubject = new BehaviorSubject<string>('');
  address$ = this._addressSubject.asObservable();

  constructor() {}

  async connectToWeb3(): Promise<void> {
    try {
      const customWindow = window as CustomWindow;

      if (customWindow.ethereum) {
        const accounts = await customWindow.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const provider = new ethers.providers.Web3Provider(
          customWindow.ethereum
        );
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        this._signerSubject.next(signer);
        const address = await signer.getAddress();
        this._addressSubject.next(address);
      } else {
        console.error('Ethereum provider not detected');
      }
    } catch (error) {
      console.error('Error connecting to Ethereum provider:', error);
    }
  }

  async getSigner() {
    await this.connectToWeb3();
    return this._signerSubject.value;
  }
}
