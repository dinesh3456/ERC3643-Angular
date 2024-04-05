import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SignService } from '../../../services/sign.service';
import { Subscription } from 'rxjs';

import { ethers } from 'ethers';
import contractAbi from '../../../abi/factoryToken.json';
import { bytecode } from '../../../bytecode/factoryToken.js';

@Component({
  selector: 'app-mint-token',
  templateUrl: './mint-token.component.html',
  styleUrl: './mint-token.component.css',
})
export class MintTokenComponent {
  myForm!: FormGroup;

  userAddress: string = '';
  private addressSubscription!: Subscription;

  signer: any;
  private signerSubscription!: Subscription;

  isLoading: boolean = false

  constructor(private fb: FormBuilder, private signService: SignService) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ownerAddress: ['', Validators.required],
      tokenId: ['', Validators.required],
      tokenAmount: ['', Validators.required],
      userAddress: ['', Validators.required],
    });

    this.addressSubscription = this.signService.address$.subscribe(
      (address) => {
        this.userAddress = address;

        this.myForm.patchValue({
          ownerAddress: address,
        });
      }
    );

    this.signerSubscription = this.signService.signer$.subscribe((signer) => {
      this.signer = signer;
    });
  }

  mintToken() {
    console.log(this.myForm);
  }

  ngOnDestroy(): void {
    this.signerSubscription.unsubscribe();
    this.addressSubscription.unsubscribe();
  }
}
