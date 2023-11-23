import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "./nav-bar/nav-bar.component";


let imp = [
  NavBarComponent,
];
@NgModule({
  declarations: [
    imp
  ],
  imports: [
    CommonModule
  ],
  exports:[
    imp
  ]
})
export class CoreModule { }
