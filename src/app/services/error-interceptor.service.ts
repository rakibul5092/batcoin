import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SNACKBARTYPE } from 'nextsapien-component-lib';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public snackBarDismissed: boolean = true;

  constructor(private router: Router, private snackBar: MatSnackBar, private translateService: TranslateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        (event) => {},
        (error: HttpErrorResponse) => {
          if (error.url.search(environment.url) > -1 && (error.status === 403 || (error.status === 401 && this.snackBarDismissed))) {
            this.translateService.get(['LIB.AUTH.SESSION_EXPIRED']).subscribe((res) => {
              this.snackBarDismissed = false;
              this.snackBar
                .open(res['LIB.AUTH.SESSION_EXPIRED'], '', {
                  duration: 5000,
                  panelClass: [SNACKBARTYPE.error],
                })
                .afterDismissed()
                .subscribe((ele) => {
                  this.snackBarDismissed = true;
                });
            });
            setTimeout(() => {
              this.router.navigate(['../auth']);
            }, 500);
          }
        },
      ),
    );
  }
}
