import { Component, OnInit } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { IdentityService } from '../../../services/identityService/identity.service';

import abiFactory from '../../../abi/abiFactory.json';
import Web3 from 'web3';
import { Identity, IdentitySDK } from '@onchain-id/identity-sdk';
import { ethers } from 'ethers';
import ONCHAINID from '@onchain-id/solidity';
import {
  ClaimScheme,
  ClaimTopic,
} from '@onchain-id/identity-sdk/dist/claim/Claim.interface';

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

  isLoading: boolean = false

  constructor(private signService: SignService, private fb: FormBuilder, private id: IdentityService) {
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
    console.log(this.myForm)
    this.isLoading = true

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
  
      const identity = await identityFactory.deploy(
        this.userAddress,
        false
      );
      await identity.deployed();
  
      console.log('Identity deployed to:', identity.address);
  
      this.identityAddressMessage = 'Identity deployed to: ' + identity.address;
  
      this.id.updateIdentity(identity)
    } catch (error) {
      console.log(error)
    }

    this.isLoading = false

    //Identity deployed to: 0xDa81baE19a28618557aB2393E4e0E3C26dc1b3c8

    // const identity1 = await Identity.at(
    //   identity.address,
    //   this.signService.signer
    // );

    // // prepare the claim
    // const claim = new IdentitySDK.Claim({
    //   address: identity.address,
    //   data: '/* data of the claim */',
    //   issuer: '0x7Fc89057b2b08Ca3dF45299B25d986f4f16C78d1',
    //   emissionDate: new Date(),
    //   scheme: 8,
    //   topic: 1,
    // });

    // // sign the claim
    // const customSigner = new IdentitySDK.SignerModule({
    //   publicKey: await this.signService.signer.getAddress(),
    //   signMessage: this.signService.signer.signMessage.bind(
    //     this.signService.signer
    //   ),
    // });
    // await claim.sign(customSigner);

    // // emit the claim
    // const tx = await identity1['addClaim'](
    //   claim.topic || ClaimTopic.KYC,
    //   claim.scheme || ClaimScheme.SOME,
    //   claim.issuer || (await this.signService.signer.getAddress()),
    //   claim.signature || '',
    //   claim.data || '',
    //   claim.uri ||  '',
    //   { signer: this.signService.signer }
    // );
    // await tx.wait();
    // console.log('Claim emitted:', tx.hash);
  }

  ngOnDestroy(): void {
    this.addressSubscription.unsubscribe();
    this.signerSubscription.unsubscribe();
  }
}
