import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { SignService } from '../../../services/sign.service';

import { ethers } from 'ethers';
import contractAbi from '../../../abi/factoryToken.json';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css'],
})
export class CreateTokenComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;

  userAddress: string = '';
  private addressSubscription!: Subscription;

  signer: any;
  private signerSubscription!: Subscription;

  isLoading: boolean = false

  constructor(private fb: FormBuilder, private signService: SignService) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      userAddress: ['', Validators.required],
      tokenName: ['', Validators.required],
      tokenSymbol: ['', Validators.required],
      decimals: ['', Validators.required],
      onchainId: ['', Validators.required],
    });

    this.addressSubscription = this.signService.address$.subscribe(
      (address) => {
        this.userAddress = address;

        this.myForm.patchValue({
          userAddress: address,
        });
      }
    );

    this.signerSubscription = this.signService.signer$.subscribe((signer) => {
      this.signer = signer;
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted!');
      console.log(this.myForm.value);
    } else {
      console.log('Please fill in all required fields.');
    }
  }

  ngOnDestroy(): void {
    this.addressSubscription.unsubscribe();
    this.signerSubscription.unsubscribe();
  }

  async createToken() {
    this.isLoading = true
    this.onSubmit()

    try {
      var owner = this.userAddress;
      var name = this.myForm.value.tokenName;
      var symbol = this.myForm.value.tokenSymbol;
      var decimals = this.myForm.value.decimals;
      var onchainId = this.myForm.value.onchainId;

      const ethereum = (window as CustomWindow).ethereum;
      let account = '';

      if (ethereum !== undefined) {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        account = accounts[0];
        console.log(account);
        console.log('here is the user address:', this.userAddress);
      }

      const contractAddress = '0x2E51e10cD104fFA6E8CAa5df1810262a61fA3a48';

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractFactory = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      const tx = await contractFactory
        .connect(this.signer)
        ['deployall'](owner, name, symbol, decimals, onchainId, {
          gasLimit: 30000000,
        });

      await tx.wait();
      console.log('here is the transaction details:', tx);
      this.isLoading = false
    } catch (error) {
      console.error(error);
      this.isLoading = false
    }
  }
}
