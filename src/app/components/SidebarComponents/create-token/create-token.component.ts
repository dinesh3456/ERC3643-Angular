import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignService } from '../../../services/sign.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css'],
})
export class CreateTokenComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  userAddress: string = '';

  private addressSubscription!: Subscription;

  constructor(private fb: FormBuilder, private signService: SignService) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      userAddress: ['', Validators.required],
      tokenName: ['', Validators.required],
      tokenSymbol: ['', Validators.required],
      decimals: ['', Validators.required],
      eventName: ['', Validators.required],
    });

    this.addressSubscription = this.signService.address$.subscribe(
      (address) => {
        this.userAddress = address;
        
        this.myForm.patchValue({
          userAddress: address
        });
      }
    );
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
  }
}