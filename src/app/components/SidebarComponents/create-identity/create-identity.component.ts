import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SignService } from '../../../services/sign.service';
import { Subscription } from 'rxjs';
import { IdentityService } from '../../../services/identityService/identity.service';

import { ethers } from 'ethers';
import ONCHAINID from '@onchain-id/solidity';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Component({
  selector: 'app-create-identity',
  templateUrl: './create-identity.component.html',
  styleUrls: ['./create-identity.component.css'],
})
export class CreateIdentityComponent implements OnInit {
  myForm!: FormGroup;

  userAddress: string = '';
  private addressSubscription!: Subscription;

  signer: any;
  private signerSubscription!: Subscription;

  idCreated: boolean = false;
  identityAddressMessage: string = '';

  isLoading: boolean = false;

  constructor(
    private signService: SignService,
    private fb: FormBuilder,
    private id: IdentityService
  ) {
    this.idCreated = false;
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      userAddress: [this.userAddress || '', Validators.required],
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

  async createIdentity() {
    console.log(this.myForm);
    this.isLoading = true;

    try {
      if (!this.myForm.get('userAddress')?.value.trim()) {
        alert('Please enter a valid user address.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const identityFactory = new ethers.ContractFactory(
        ONCHAINID.contracts.Identity.abi,
        ONCHAINID.contracts.Identity.bytecode,
        this.signer
      );

      const identity = await identityFactory.deploy(this.userAddress, false);
      await identity.deployed();

      console.log('Identity deployed to:', identity.address);

      this.identityAddressMessage = 'Identity deployed to: ' + identity.address;

      this.id.updateIdentity(identity);
    } catch (error) {
      console.log(error);
    }

    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.addressSubscription.unsubscribe();
    this.signerSubscription.unsubscribe();
  }
}
