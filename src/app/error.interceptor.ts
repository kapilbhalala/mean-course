import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, pipe, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private matDialog: MatDialog) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "unidentified error occured";
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.matDialog.open(ErrorComponent, {
          data: { message: errorMessage }
        });
        return throwError(error);
      })
    );
  }
}
