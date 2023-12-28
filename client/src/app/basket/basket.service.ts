import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Basket, IBasket, IBasketItem, IBasketTotals} from "../shared/models/basket";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {IProduct} from "../shared/models/product";
import {IDeliveryMethod} from "../shared/models/deliveryMethod";

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket| null>(null);
  basket$=this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$  = this.basketTotalSource.asObservable();
  shipping = 0;
  constructor(private http: HttpClient) { }


  createPaymentIntent(){
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id,{})
      .pipe(
        //@ts-ignore
        map((basket: IBasket) =>{
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue());
        })
      );
  }
  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    // @ts-ignore
    basket?.deliveryMethodId = deliveryMethod.id;
    // @ts-ignore
    basket?.shippingPrice =deliveryMethod.price;
    this.calculateTotals();
    this.setBasket(basket);
  }
  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id='+id)
      .pipe(
        // @ts-ignore
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          // @ts-ignore
          this.shipping = basket.shippingPrice;
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket| null){
    // @ts-ignore
    return this.http.post(this.baseUrl + 'basket',basket).subscribe((response: IBasket)=>{
      this.basketSource.next(response);
      this.calculateTotals();
    },error => {
      console.log(error);
    })
  }

  getCurrentBasketValue(): IBasket | null{
    return this.basketSource.value;
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket?.items.findIndex(x=>x.id === item.id) ?? 0;
    // @ts-ignore
      basket.items[foundItemIndex].quantity++;
      // @ts-ignore
      this.setBasket(basket);
  }

    decrementItemQuantity(item: IBasketItem){
        const basket = this.getCurrentBasketValue();
        const foundItemIndex = basket?.items.findIndex(x=>x.id === item.id) ?? 0;
        // @ts-ignore
        if(basket.items[foundItemIndex].quantity > 0){
            // @ts-ignore
            basket.items[foundItemIndex].quantity--;
            // @ts-ignore
            this.setBasket(basket);
        }else{

        }

        this.removeItemFromBasket(item);

    }

  addItemToBasket(item: IProduct, quantity =1){
    const itemToAdd: IBasketItem =this.mapProductItemToBasketItem(item,quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  private createBasket(): IBasket{
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem{
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    const shipping =this.shipping;
    const subtotal = basket?.items.reduce((a,b) => (b.price * b.quantity)+ a, 0) ?? 0;
    const total = subtotal +shipping;
    this.basketTotalSource.next({shipping, total,subtotal});
  }
  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number) {
    console.log(items);
    const index = items.findIndex(i=>i.id === itemToAdd.id);
        if(index === -1){
          itemToAdd.quantity = quantity;
          items.push(itemToAdd);
        }else{
          items[index].quantity += quantity;
        }
        return items;
  }

     removeItemFromBasket(item: IBasketItem) {
        const basket = this.getCurrentBasketValue();
        if(basket?.items.some(x => x.id === item.id)){
          basket.items = basket?.items.filter(i=>i.id !== item.id);
          if(basket.items.length > 0){
            this.setBasket(basket);
          }else{
            this.deleteBasket(basket);
          }
        }
    }

    deleteLocalBasket(id: string | null){
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }
    deleteBasket(basket: IBasket) {
        return this.http.delete(this.baseUrl + 'basket?id='+basket.id).subscribe(()=>{
          this.basketSource.next(null);
          this.basketTotalSource.next(null);
          localStorage.removeItem('basket_id');
        },error => {
          console.log(error);
        });
    }
}
