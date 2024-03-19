import { Component } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import contractABI from '../../../abi/abiFactory.json';
import { bytecode } from '../../../bytecode/abiFactory.js';

import { Subscription } from 'rxjs';
import { IdentityService } from '../../../services/identityService/identity.service';
import Web3 from 'web3';
import { ethers } from 'ethers';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Component({
  selector: 'app-create-claim-issuer',
  templateUrl: './create-claim-issuer.component.html',
  styleUrl: './create-claim-issuer.component.css',
})
export class CreateClaimIssuerComponent {
  myForm!: FormGroup;

  userAdderss: string = '';
  private addressSubscription!: Subscription;

  signer: any;
  private signerSubscription!: Subscription;

  identity: any;
  private identitySubscription!: Subscription;

  idCreated: boolean = false;
  claimIssuerAddressMessage: string = '';

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
      userAddress: [this.userAdderss || '', Validators.required],
    });

    this.addressSubscription = this.signService.address$.subscribe(
      (address) => {
        this.userAdderss = address;

        this.myForm.patchValue({
          userAddress: address,
        });
      }
    );

    this.signerSubscription = this.signService.signer$.subscribe((signer) => {
      this.signer = signer;
    });

    this.identitySubscription = this.id.identity$.subscribe((identity) => {
      this.identity = identity;
    });
  }

  async createClaimIssuer() {
    this.isLoading = true;
    try {
      const customWindow = window as CustomWindow;
      let account = '';
      const ethereum = (window as CustomWindow).ethereum;

      if (ethereum !== undefined) {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        account = accounts[0];
        console.log(account);
        console.log('here is the user address:', this.userAdderss);
      }

      const _claimTopics: number[] = [1];
      const provider = new ethers.providers.Web3Provider(customWindow.ethereum);
      const signer = provider.getSigner();
      const contractFactory = new ethers.ContractFactory(
        contractABI,
        bytecode,
        signer
      );
      const contract = await contractFactory.deploy();
      await contract.deployed();
      console.log('contract deployed to:', contract.address);
      console.log('bytecode', bytecode);

      const tx = await contract['createClaimIssuer'](this.userAdderss, {
        gasLimit: 3000000,
      });
      console.log('Claim issuer created. Transaction hash:', tx.hash);
      await tx.wait();

      const claimIssuerAddress = await contract['getClaimIssuer'](
        this.userAdderss
      );
      console.log('Claim issuer address:', claimIssuerAddress);
      this.claimIssuerAddressMessage =
        'Claim issuer created with address: ' + claimIssuerAddress;

      this.isLoading = false;
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }
}
