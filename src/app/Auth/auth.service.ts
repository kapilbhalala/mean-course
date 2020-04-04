import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "./user-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users/";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private isAuthenticatedSubject = new Subject<boolean>();
  private authStatus: boolean = false;
  private tokenTimer: number;
  private userID: string;

  constructor(private httpClient: HttpClient, private router: Router) {}

  isAuthenticatedListner() {
    return this.isAuthenticatedSubject.asObservable();
  }

  signUp(email: string, password: string) {
    const user: UserModel = { email: email, password: password };
    this.httpClient.post(BACKEND_URL + "signup", user).subscribe(
      response => {
        this.router.navigate(["/"]);
      },
      error => {
        this.isAuthenticatedSubject.next(false);
      }
    );
  }

  signIn(email: string, password: string) {
    const user: UserModel = { email: email, password: password };
    this.httpClient
      .post<{ token: string; expiresIn: number; userID: string }>(
        BACKEND_URL + "signin",
        user
      )
      .subscribe(
        response => {
          const token = response.token;
          if (token) {
            this.userID = response.userID;
            this.authStatus = true;
            this.token = token;
            const expiresIn = response.expiresIn;
            this.setAuthTimer(expiresIn);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.saveAuthData(token, expirationDate, this.userID);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(["/"]);
          }
        },
        error => {
          this.isAuthenticatedSubject.next(false);
        }
      );
  }

  setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.signOut();
    }, expiresIn * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.authStatus = true;
      this.userID = authInformation.userID;
      this.isAuthenticatedSubject.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  signOut() {
    this.authStatus = false;
    this.token = null;
    this.userID = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/"]);
  }

  getAuthStatus() {
    return this.authStatus;
  }
  getToken() {
    return this.token;
  }
  getUserID() {
    return this.userID;
  }

  private saveAuthData(token: string, expirationDate: Date, userID: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userID", userID);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userID");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userID = localStorage.getItem("userID");
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userID: userID
    };
  }
}
