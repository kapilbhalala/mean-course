import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignUp(signUpForm: NgForm) {
    if (signUpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.signUp(signUpForm.value.email, signUpForm.value.password);
  }
}
