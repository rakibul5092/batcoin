import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { fromPaginator, PaginatorActions } from 'nextsapien-component-lib';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromPaginator.State>, private translateService: TranslateService) {}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = {
      'Accept-Language': this.translateService.currentLang ? this.translateService.currentLang : 'en',
    };
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      if (req.url.search(environment.url) > -1) {
        headers['Authorization'] = 'Bearer ' + idToken;
      }
      req = req.clone({
        setHeaders: headers,
      });
      return next.handle(req).pipe(
        map((evt) => {
          if (evt instanceof HttpResponse) {
            this.store.dispatch(
              PaginatorActions.setCurrentEntityCount({
                paginator: {
                  count: evt.headers.get('count'),
                  model: evt.headers.get('model'),
                },
              }),
            );
          }
          return evt;
        }),
      );
    } else {
      req = req.clone({
        setHeaders: headers,
      });
      return next.handle(req);
    }
  }
}
