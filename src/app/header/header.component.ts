import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../Auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = "MEAN";
  private AuthenticatedSubs = new Subscription();
  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.AuthenticatedSubs = this.authService
      .isAuthenticatedListner()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.AuthenticatedSubs.unsubscribe();
  }

  onSignout() {
    this.authService.signOut();
  }
}
