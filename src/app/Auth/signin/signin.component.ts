import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  authSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubs = this.authService
      .isAuthenticatedListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }
  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  onSignIn(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.signIn(loginForm.value.email, loginForm.value.password);
  }
}
