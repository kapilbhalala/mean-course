import { Component, OnDestroy, OnInit } from "@angular/core";
import { CustomerModel } from "../customerModel";
import { CustomerService } from "../customerService";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: "app-view-customer",
  templateUrl: "./view-customer.component.html",
  styleUrls: ["./view-customer.component.css"]
})
export class ViewCustomerComponent implements OnInit, OnDestroy {
  customers: CustomerModel[] = [];
  customerSubscription: Subscription;
  isAuthSubs: Subscription;
  isUserAuthenticated: boolean = false;
  isLoading = false;
  pageLength = 3;
  currentPage = 1;
  totalCustomers = 0;
  userID: string;
  displayedColumns: string[] = [
    "customer_name",
    "pincode",
    "city",
    "address",
    "imagePath"
  ];

  constructor(
    public customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.customerService.getCustomers(this.pageLength, this.currentPage);
    this.userID = this.authService.getUserID();
    this.customerSubscription = this.customerService
      .getUpdatedCustomerListner()
      .subscribe(
        (customersData: {
          customers: CustomerModel[];
          totalCustomers: number;
        }) => {
          this.isLoading = false;
          this.customers = customersData.customers;
          this.totalCustomers = customersData.totalCustomers;
        }
      );
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.isAuthSubs = this.authService
      .isAuthenticatedListner()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userID = this.authService.getUserID();
        this.hideShowTableColumns();
      });
    this.hideShowTableColumns();
  }
  hideShowTableColumns() {
    if (this.isUserAuthenticated) {
      this.displayedColumns.push("id");
    }
    if (!this.isUserAuthenticated) {
      const index = this.displayedColumns.indexOf("id");
      if (index > -1) {
        this.displayedColumns.splice(index, 1);
      }
    }
  }
  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  onChangePageEvent(pageEvent: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageLength = pageEvent.pageSize;
    this.customerService.getCustomers(this.pageLength, this.currentPage);
  }

  onDelete(customerID: string) {
    this.isLoading = true;
    this.customerService.deleteCustomer(customerID).subscribe(() => {
      this.customerService.getCustomers(this.pageLength, this.currentPage);
    });
  }
}
