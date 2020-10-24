import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {NzNotificationService} from "ng-zorro-antd";

@Injectable ()

export class MessageInterceptor implements HttpInterceptor{

  constructor(public notificationServ : NzNotificationService) {
  }

  intercept(req: HttpRequest <any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          if(res.body && (res.body.title || res.body.message))
            this.notificationServ.success( res.body.title || 'Succès',res.body.message || null,
              {nzDuration: 3500});
        }
      }),
      catchError((res: any) => {
        if(res instanceof HttpErrorResponse) {
          try {
            this.notificationServ.error( res.error.title || 'Une erreur est survenue',res.error.message ||null,
              {nzDuration: 3500});
          } catch(e) {
            this.notificationServ.error( 'Une erreur est survenue',null,
              {nzDuration: 3500});
          }
        }
        return of(res);
      })
    );
  }
}

export const MessageInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useClass : MessageInterceptor,
  multi : true
}
