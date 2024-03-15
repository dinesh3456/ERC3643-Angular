import { Component } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Web3 from 'web3';

import abiFactory from '../../../abi/abiFactory.json';

import { Subscription } from 'rxjs';
import { IdentityService } from '../../../services/identityService/identity.service';

import { Identity, IdentitySDK } from '@onchain-id/identity-sdk';
import ONCHAINID from '@onchain-id/solidity';
import { PublicKey } from '@onchain-id/identity-sdk/dist/core/SignerModule';
import { ClaimTopic } from '@onchain-id/identity-sdk/dist/claim/Claim.interface';
import { ClaimScheme } from '@onchain-id/identity-sdk/dist/claim/Claim.interface';

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
  private identitySubscription!: Subscription

  idCreated: boolean = false;
  claimIssuerAddressMessage: string = '';

  constructor(private signService: SignService, private fb: FormBuilder, private id: IdentityService) {
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
          userAddress: address
        })
      }
    );

    this.signerSubscription = this.signService.signer$.subscribe(
      (signer) => {
        this.signer = signer;
      }
    )

    this.identitySubscription = this.id.identity$.subscribe(
      (identity) => {
        this.identity = identity
      }
    )
  }

  async createClaimIssuer() {
    if (!this.myForm.get('userAddress')?.value.trim()) {
      alert('Please enter a valid user address.');
      return;
    }

    const identity1 = await Identity.at(
      this.identity.address,
      this.signer
    );

    const claim = new IdentitySDK.Claim({
      address: this.identity.address,
      data: '0x7Fc89057b2b08Ca3dF45299B25d986f4f16C78d1',
      issuer: '0xe43412B75EdFB5304181b4bC352096f73F7a7DBf',
      emissionDate: new Date(),
      scheme: 8,
      topic: 1,
    });

    const customSigner = new IdentitySDK.SignerModule({
      publicKey: (await this.signer.getAddress()),
      signMessage: this.signer.signMessage.bind(
        this.signer
      ),
    });
    await claim.sign(customSigner);

    const tx = await identity1['addClaim'](
      claim.topic || ClaimTopic.KYC,
      claim.scheme || ClaimScheme.SOME,
      claim.issuer || this.userAdderss,
      claim.signature || '',
      claim.data || '',
      claim.uri ||  '',
      { signer: this.signer }
    );
    await tx.wait();
    console.log('Claim emitted:', tx.hash);
  }
}
