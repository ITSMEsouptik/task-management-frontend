import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { AuthServiceService } from "../auth/auth-service.service";

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const token = inject(AuthServiceService).getToken();
    const newReq = token ? req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    }) : req
    return next(newReq).pipe(catchError(err => {
        return of(err)
    }))
}