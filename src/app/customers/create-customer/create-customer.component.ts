import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { CustomerService } from "../customerService";
import { ActivatedRoute, Params, ParamMap } from "@angular/router";
import { CustomerModel } from "../customerModel";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: "app-create-customer",
  templateUrl: "./create-customer.component.html",
  styleUrls: ["./create-customer.component.css"]
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  private mode = "create";
  private customerID: string;
  customerForm: FormGroup;
  isLoading = false;
  customer: CustomerModel;
  imagePreview: string;
  authStatusStub: Subscription;

  constructor(
    public customerService: CustomerService,
    public activatedRoutes: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusStub = this.authService
      .isAuthenticatedListner()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.customerForm = new FormGroup({
      customer_name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      pincode: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      city: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.activatedRoutes.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("customerID")) {
        this.isLoading = true;
        this.mode = "edit";
        this.customerID = paramMap.get("customerID");
        this.customerService
          .editCustomer(this.customerID)
          .subscribe(customerData => {
            this.isLoading = false;
            // tslint:disable-next-line:max-line-length
            this.customer = {
              id: customerData._id,
              customer_name: customerData.customer_name,
              pincode: customerData.pincode,
              city: customerData.city,
              address: customerData.address,
              imagePath: customerData.imagePath,
              creator: customerData.creator
            };
            this.customerForm.setValue({
              customer_name: customerData.customer_name,
              pincode: customerData.pincode,
              city: customerData.city,
              address: customerData.address,
              image: customerData.imagePath
            });
            this.imagePreview = customerData.imagePath;
          });
      } else {
        this.mode = "create";
        this.customerID = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusStub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //Set single value in form Using patchValue
    this.customerForm.patchValue({ image: file });
    this.customerForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveCustomer() {
    if (this.customerForm.invalid) {
      return true;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.customerService.addCustomer(
        this.customerForm.value.customer_name,
        this.customerForm.value.pincode,
        this.customerForm.value.city,
        this.customerForm.value.address,
        this.customerForm.value.image
      );
    } else {
      this.customerService.updateCustomer(
        this.customerID,
        this.customerForm.value.customer_name,
        this.customerForm.value.pincode,
        this.customerForm.value.city,
        this.customerForm.value.address,
        this.customerForm.value.image
      );
    }
    this.customerForm.reset();
  }
}
