import { CustomerModel } from "./customerModel";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/customers/";

@Injectable({ providedIn: "root" })
export class CustomerService {
  private customers: CustomerModel[] = [];
  private customerUpdated = new Subject<{
    customers: CustomerModel[];
    totalCustomers: number;
  }>();

  constructor(private httpClient: HttpClient, private routes: Router) {}

  getCustomers(pageLength: number, currentPage: number) {
    const params = `?pagesize=${pageLength}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; customers: any; totalCustomers: number }>(
        BACKEND_URL + params
      )
      .pipe(
        map(customerData => {
          return {
            customers: customerData.customers.map(customer => {
              return {
                customer_name: customer.customer_name,
                pincode: customer.pincode,
                city: customer.city,
                address: customer.address,
                imagePath: customer.imagePath,
                id: customer._id,
                creator: customer.creator
              };
            }),
            totalCustomers: customerData.totalCustomers
          };
        })
      )
      .subscribe(transformedCustomers => {
        this.customers = transformedCustomers.customers;
        this.customerUpdated.next({
          customers: [...this.customers],
          totalCustomers: transformedCustomers.totalCustomers
        });
      });
  }

  getUpdatedCustomerListner() {
    return this.customerUpdated.asObservable();
  }

  editCustomer(customerID: string) {
    return this.httpClient.get<{
      _id: string;
      customer_name: string;
      pincode: string;
      city: string;
      address: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + customerID);
  }

  addCustomer(
    customerName: string,
    pincode: string,
    city: string,
    address: string,
    image: File
  ) {
    const customerFormData = new FormData();

    customerFormData.append("customer_name", customerName);
    customerFormData.append("pincode", pincode);
    customerFormData.append("city", city);
    customerFormData.append("address", address);
    customerFormData.append("image", image, customerName);

    this.httpClient
      .post<{ message: string; customer: CustomerModel }>(
        BACKEND_URL,
        customerFormData
      )
      .subscribe(responseData => {
        this.routes.navigate(["/"]);
      });
  }

  updateCustomer(
    customerID: string,
    customerName: string,
    pincode: string,
    city: string,
    address: string,
    image: File | string
  ) {
    let customerData: FormData | CustomerModel;
    if (typeof image === "object") {
      customerData = new FormData();
      customerData.append("id", customerID);
      customerData.append("customer_name", customerName);
      customerData.append("pincode", pincode);
      customerData.append("city", city);
      customerData.append("address", address);
      customerData.append("image", image, customerName);
    } else {
      customerData = {
        id: customerID,
        customer_name: customerName,
        pincode: pincode,
        city: city,
        address: address,
        imagePath: image,
        creator: null
      };
    }

    this.httpClient
      .put(BACKEND_URL + customerID, customerData)
      .subscribe(responseData => {
        this.routes.navigate(["/"]);
      });
  }

  deleteCustomer(customerID: string) {
    return this.httpClient.delete(BACKEND_URL + customerID);
  }
}
