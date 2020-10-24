import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfigService} from "../autre/config.service";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";


@Injectable ()
export class CoinapiInterceptor implements HttpInterceptor{
  constructor(
    private configServ : ConfigService
  ) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          if(res.body?.coinapi){
            this.configServ.emmitCoinapi(res.body.coinapi)
          }
        }
      })
    )
  }
}


export const CoinapiInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useClass : CoinapiInterceptor,
  multi : true
}
