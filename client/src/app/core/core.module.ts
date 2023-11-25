import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {RouterModule} from "@angular/router";


let imp = [
  NavBarComponent,
];
@NgModule({
  declarations: [
    imp
  ],
    imports: [
        CommonModule,
        RouterModule
    ],
  exports:[
    imp
  ]
})
export class CoreModule { }
