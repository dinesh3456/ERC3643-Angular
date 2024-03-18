import { Component } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//import contractABI from '../../../abi/TrustedIssuersRegistry.json';
import contractABI from '../../../abi/abiFactory.json';
import {bytecode} from '../../../bytecode/abiFactory.js';

import { Subscription } from 'rxjs';
import { IdentityService } from '../../../services/identityService/identity.service';
import Web3 from 'web3';
import { ethers } from 'ethers';

// import { Identity, IdentitySDK } from '@onchain-id/identity-sdk';
// import ONCHAINID from '@onchain-id/solidity';
// import { PublicKey } from '@onchain-id/identity-sdk/dist/core/SignerModule';
// import { ClaimTopic } from '@onchain-id/identity-sdk/dist/claim/Claim.interface';
// import { ClaimScheme } from '@onchain-id/identity-sdk/dist/claim/Claim.interface';

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
      try {
        const customWindow = window as CustomWindow;
        let account = '';
        const ethereum = (window as CustomWindow).ethereum;

        if (ethereum !== undefined) {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          account = accounts[0];
          console.log(account);
          console.log("here is the user address:", this.userAdderss);
        }

        //const factoryIdentity = "0xe2899bddFD890e320e643044c6b95B9B0b84157A";



        const _claimTopics: number[] = [1];
        const provider = new ethers.providers.Web3Provider(customWindow.ethereum);
        const signer = provider.getSigner();
        const contractFactory = new ethers.ContractFactory(contractABI, bytecode, signer);
        const contract = await contractFactory.deploy();
        await contract.deployed();
        console.log('contract deployed to:', contract.address);
        console.log("bytecode", bytecode);

        // const contract = new ethers.Contract(contractAddress, contractABI, signer);
        //const init = await contract['init']({gasLimit : 3000000});
       // console.log('init', init);
       // console.log("intialization done");
       // await init.wait();
       const tx = await contract['createClaimIssuer'](this.userAdderss, { gasLimit: 3000000 });
       console.log("Claim issuer created. Transaction hash:", tx.hash);
       await tx.wait();

       // Get claim issuer address
       const claimIssuerAddress = await contract['getClaimIssuer'](this.userAdderss);
       console.log('Claim issuer address:', claimIssuerAddress);
       this.claimIssuerAddressMessage = 'Claim issuer created with address: ' + claimIssuerAddress;
      } catch (error) {
        console.error('Error:', error);
      }
    }


      // Catch the event and display in the frontend

    }


// async createClaimIssuer() {
  //   if (!this.myForm.get('userAddress')?.value.trim()) {
  //     alert('Please enter a valid user address.');
  //     return;
  //   }

  //   const identity1 = await Identity.at(
  //     this.identity.address,
  //     this.signer
  //   );

  //   const claim = new IdentitySDK.Claim({
  //     address: this.identity.address,
  //     data: '0x7Fc89057b2b08Ca3dF45299B25d986f4f16C78d1',
  //     issuer: '0xe43412B75EdFB5304181b4bC352096f73F7a7DBf',
  //     emissionDate: new Date(),
  //     scheme: 8,
  //     topic: 1,
  //   });

  //   const customSigner = new IdentitySDK.SignerModule({
  //     publicKey: (await this.signer.getAddress()),
  //     signMessage: this.signer.signMessage.bind(
  //       this.signer
  //     ),
  //   });
  //   await claim.sign(customSigner);

  //   const tx = await identity1['addClaim'](
  //     claim.topic || ClaimTopic.KYC,
  //     claim.scheme || ClaimScheme.SOME,
  //     claim.issuer || this.userAdderss,
  //     claim.signature || '',
  //     claim.data || '',
  //     claim.uri ||  '',
  //     { signer: this.signer }
  //   );
  //   await tx.wait();
  //   console.log('Claim emitted:', tx.hash);
  // }


//     async connectContract() {
//       var Abi;
//       await fetch('./abi/abiFactory.json')
//         .then(response => response.json())
//         .then(data => {
//           // Handle the retrieved JSON data
//           Abi = data;
//         })
//         .catch(error => {
//           console.error('Error loading JSON file:', error);
//         });

//       const contractABI = Abi;
//       const contractAddress = factoryIdentity;
//       window.web3 = await new Web3(window.ethereum);
//       window.contract = await new window.web3.eth.Contract(contractABI, contractAddress);
//       document.getElementById("contractArea").innerHTML = "Connected to Contract";
//     }

//     async getIdentity() {
//       var identity = document.getElementById("AddressForIdentity").value;
//       const data = await window.contract.methods.getidentity(identity).call();
//       console.log(data);
//       document.getElementById("gotidentityAddress").innerHTML = "identity  = " + data;
//     }
// }

