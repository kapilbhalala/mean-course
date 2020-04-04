import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";
import { CreateCustomerComponent } from "./create-customer/create-customer.component";
import { ViewCustomerComponent } from "./view-customer/view-customer.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
  declarations: [CreateCustomerComponent, ViewCustomerComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class CustomerModule {}
