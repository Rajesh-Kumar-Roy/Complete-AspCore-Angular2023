import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BasketService} from "../../basket/basket.service";
import {CheckoutService} from "../checkout.service";
import {ToastrService} from "ngx-toastr";
import {IBasket} from "../../shared/models/basket";
import {IOrder, IOrderToCreate} from "../../shared/models/order";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  constructor(
    private  basketService: BasketService,
    private checkoutService: CheckoutService,
    private  toastrService: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  submitOrder(){
    const basket= this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    // @ts-ignore
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder)=>{
      this.toastrService.success('Order Create Successful');
      // @ts-ignore
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras : NavigationExtras = {state: order}
      this.router.navigate(['checkout/success'], navigationExtras);
      console.log(order);
    },error => {
      this.toastrService.error(error.message);
      console.log(error);
    });
  }

  // private getOrderToCreate(basket: IBasket | null) {
  //   return{
  //     basketId: basket?.id,
  //     deliveryMethod: +this.checkoutForm.get('deliveryForm')?.value,
  //     shipToAddress: this.checkoutForm.get('addressForm')?.value
  //   }
  // }

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
}
