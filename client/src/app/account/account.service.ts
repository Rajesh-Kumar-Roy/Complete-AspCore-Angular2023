import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, of, ReplaySubject} from "rxjs";
import {IUser} from "../shared/models/user";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {IAddress} from "../shared/models/address";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
 baseUrl = environment.apiUrl;

 private currentUserSource = new ReplaySubject<IUser | null>(1);
 currentUser$ = this.currentUserSource.asObservable();
  constructor(private  http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string| null){
    if(token === null){
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);


    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      // @ts-ignore
      map((user: IUser) =>{
        if(user){
          localStorage.setItem('token',user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }
  login(values: any){
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      // @ts-ignore
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token',user.token);
          this.currentUserSource.next(user);
        }
    })
    );
  }

  register(values: any){
    return this.http.post(this.baseUrl + 'account/register',values).pipe(
      // @ts-ignore
      map((user: IUser) =>{
        if(user){
          localStorage.setItem('token',user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string){
    return this.http.get(this.baseUrl+'account/emailexists?email='+email);
  }

  getUserAddress(){
    return this.http.get<IAddress>(this.baseUrl+'account/address');
  }

  updateUserAddress(address: IAddress){
    return this.http.put<IAddress>(this.baseUrl+'account/address', address);
  }
}
