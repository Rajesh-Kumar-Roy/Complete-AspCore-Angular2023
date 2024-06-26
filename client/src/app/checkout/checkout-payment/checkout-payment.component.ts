import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BasketService} from "../../basket/basket.service";
import {CheckoutService} from "../checkout.service";
import {ToastrService} from "ngx-toastr";
import {IBasket} from "../../shared/models/basket";
import {IOrder, IOrderToCreate} from "../../shared/models/order";
import {NavigationExtras, Router} from "@angular/router";

//@ts-ignore
declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;
  @ViewChild('cardNumber',{static: true}) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry',{static: true}) cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc',{static: true}) cardCvcElement!: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid=false;
  cardExpiryValid = false;
  cardCvcValid = false;
  constructor(
    private  basketService: BasketService,
    private checkoutService: CheckoutService,
    private  toastrService: ToastrService,
    private router: Router
    ) { }

  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51ORzdGHtvKc2A3rALTLv8ZFmjAeV2WSVaW3tRKldjvVXekEWU6SQNlTBpQ1oyx779zL1iwHJoB2GIBq9CLiwBIQt00xtilOSjX')
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change',this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change',this.cardHandler);



    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change',this.cardHandler);

  }

  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  // @ts-ignore
  onChange(event: any){
    console.log(event);
    if(event.error){
      this.cardErrors = event.error.message;
    }else{
      this.cardErrors = null;
    }
    switch (event.elementType){
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }
  async submitOrder(){
    this.loading = true;
    const basket= this.basketService.getCurrentBasketValue();
    try{
      const createdOrder = await this.createOrder(basket);
      const  paymentResult = await this.confirmPaymentWithStripe(basket);

      if(paymentResult.paymentIntent){
        // @ts-ignore
        this.basketService.deleteBasket(basket);
        // @ts-ignore
        const navigationExtras : NavigationExtras = {state: createdOrder}
        this.router.navigate(['checkout/success'], navigationExtras);

      }else {
        this.toastrService.error(paymentResult.error.message);
      }
      this.loading = false;
    }catch (error){
      console.log(error);
      this.loading = false;
    }
  }

  // private getOrderToCreate(basket: IBasket | null) {
  //   return{
  //     basketId: basket?.id,
  //     deliveryMethod: +this.checkoutForm.get('deliveryForm')?.value,
  //     shipToAddress: this.checkoutForm.get('addressForm')?.value
  //   }
  // }



  private async createOrder(basket: IBasket | null) {
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).toPromise()
  }

  private getOrderToCreate(basket: IBasket | null): IOrderToCreate {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value;
    if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return {
      //@ts-ignore
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

  private async confirmPaymentWithStripe(basket: IBasket | null) {
    return  this.stripe?.confirmCardPayment(basket?.clientSecret,{
      payment_method:{
        card:this.cardNumber,
        billing_details:{
          name:this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    })
  }
}
