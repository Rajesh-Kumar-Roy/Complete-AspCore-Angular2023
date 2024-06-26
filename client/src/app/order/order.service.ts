import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getOrdersForUser(){
    return this.http.get(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number){
    return this.http.get(this.baseUrl + 'orders/'+id);
  }
}
