import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {BusyService} from "../services/busy.service";
import {finalize,delay} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable()
export class LoadingInterceptor implements  HttpInterceptor{
  constructor(private busyService: BusyService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.method === 'POST' && req.url.includes('orders')){
      return next.handle(req);
    }
    if(req.url.includes('emailexists')){
      return next.handle(req);
    }
    this.busyService.busy();
    return  next.handle(req).pipe(
      delay(1000),
      finalize(() =>{
        this.busyService.idle();
      })
    );
  }

}
