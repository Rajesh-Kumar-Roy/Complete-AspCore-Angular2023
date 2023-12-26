import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account/account.service";
import {Observable} from "rxjs";
import {IBasketTotals} from "../shared/models/basket";
import {BasketService} from "../basket/basket.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  basketTotal$!: Observable<IBasketTotals>;
  constructor(private  fb: FormBuilder, private accountService: AccountService,
              private  basketService: BasketService) { }

  ngOnInit(): void {
    //this.createCheckoutForm();
    this.getAddressFormValues();
    //@ts-ignore
    this.basketTotal$ = this.basketService.basketTotal$;
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
