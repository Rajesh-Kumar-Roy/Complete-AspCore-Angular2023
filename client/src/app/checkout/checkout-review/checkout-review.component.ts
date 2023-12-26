import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {IBasket} from "../../shared/models/basket";
import {BasketService} from "../../basket/basket.service";

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  basket$!: Observable<IBasket>;
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.basket$ = this.basketService.basket$;
  }

}
