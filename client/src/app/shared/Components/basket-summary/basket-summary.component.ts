import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BasketService} from "../../../basket/basket.service";
import {Observable} from "rxjs";
import {IBasket, IBasketItem} from "../../models/basket";
import {IOrderItem} from "../../models/order";

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket = true;
  @Input() isOrder = false;
  @Input() items: IBasketItem[] | IOrderItem[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  decrementItemQuantity(item: IBasketItem){
    this.decrement.emit(item);

  }

  incrementItemQuantity(item: IBasketItem){
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem){
    this.remove.emit(item);
  }

}
