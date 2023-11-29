import { Component, OnInit } from '@angular/core';
import {IProduct} from "../../shared/models/product";
import {ShopService} from "../shop.service";
import {ActivatedRoute} from "@angular/router";
import {BreadcrumbService} from "xng-breadcrumb";
import {BasketService} from "../../basket/basket.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;
  quantity: number = 1;

  constructor(private shopService: ShopService,
              private  activateRoute: ActivatedRoute,
              private bcsService: BreadcrumbService,
              private  basketService: BasketService) {
    this.bcsService.set("@productDetails",'');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket(){
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity(){
    this.quantity++;
  }

  decrementQuantity(){
    this.quantity > 1 ? this.quantity-- : this.quantity;
  }
  loadProduct(){
    // @ts-ignore
    this.shopService.getProduct(+this.activateRoute.snapshot.paramMap.get('id')).subscribe(product=>{
      this.product = product;
      this.bcsService.set('@productDetails',product.name);
    },error => {
      console.log(error);
    })
  }

}
