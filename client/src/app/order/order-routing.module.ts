import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderComponent} from "./order.component";
import {OrderDetailsComponent} from "./order-details/order-details.component";

const routes: Routes = [
  {path: '', component:OrderComponent},
  {path: ':id', component:OrderDetailsComponent, data:{breadcrumb: {alias: 'OrderDetailed'}}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
