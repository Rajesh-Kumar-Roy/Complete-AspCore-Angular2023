import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account/account.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  constructor(private  fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit(): void {
    //this.createCheckoutForm();
    this.getAddressFormValues();
  }

  checkoutForm = this.fb.group({
    addressForm: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    }),
    deliveryForm: this.fb.group({
      deliveryMethod: ['', Validators.required]
    }),
    paymentForm: this.fb.group({
      nameOnCard: ['', Validators.required]
    })
  });
  // createCheckoutForm(){
  //   this.checkoutForm = this.fb.group({
  //     addressForm: this.fb.group({
  //       firstName: [null, Validators.required],
  //       lastName: [null, Validators.required],
  //       street: [null, Validators.required],
  //       city: [null, Validators.required],
  //       state: [null, Validators.required],
  //       zipCode: [null, Validators.required],
  //     }),
  //     deliveryForm: this.fb.group({
  //       deliveryMethod: [null, Validators.required],
  //     }),
  //     paymentForm: this.fb.group({
  //       nameOnCard:[null, Validators.required]
  //     })
  //   });
  // }
  getAddressFormValues(){
    this.accountService.getUserAddress().subscribe(address=>{
      if(address){
        this.checkoutForm.get('addressForm')?.patchValue(address);
      }
    },error => {
      console.log(error);
    })
  }

}
