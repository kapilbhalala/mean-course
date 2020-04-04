import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ViewCustomerComponent } from "./customers/view-customer/view-customer.component";
import { CreateCustomerComponent } from "./customers/create-customer/create-customer.component";
import { SigninComponent } from "./Auth/signin/signin.component";
import { SignupComponent } from "./Auth/signup/signup.component";
import { AuthGuard } from "./Auth/auth.guard";

const routes: Routes = [
  { path: "", component: ViewCustomerComponent },
  {
    path: "create",
    component: CreateCustomerComponent,
  },
  {
    path: "edit/:customerID",
    component: CreateCustomerComponent,
  },
  {
    path: "auth",
    loadChildren: () => import("./Auth/auth.module").then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
