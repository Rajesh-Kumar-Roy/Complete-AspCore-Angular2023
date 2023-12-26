import { Component, OnInit } from '@angular/core';
import {IOrder} from "../../shared/models/order";
import {ActivatedRoute} from "@angular/router";
import {BreadcrumbService} from "xng-breadcrumb";
import {OrderService} from "../order.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order!: IOrder;
  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService
  ,private orderService: OrderService) {
    this.breadcrumbService.set('@OrderDetailed','');
  }

  ngOnInit(): void {
    // @ts-ignore
    this.orderService.getOrderDetailed(+this.route.snapshot.paramMap.get('id')).subscribe((order: IOrder) =>{
      this.order = order;
      this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
    }, error => {
      console.log(error);
    })
  }
}
