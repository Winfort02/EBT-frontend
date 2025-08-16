import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const newRequest = req.clone({
    headers: req.headers.set('content-type', 'application/json'),
    withCredentials: true
  });
  return next(newRequest).pipe(
   catchError((error: HttpErrorResponse) => {
      if (error.status == HttpStatusCode.Unauthorized || error.status == HttpStatusCode.Forbidden) {
         router.navigate(['auth/login']);
      } else if (error.status === 0) {
        router.navigate(['auth/access']);
      }
      return throwError(() => error);
   })
  );
}