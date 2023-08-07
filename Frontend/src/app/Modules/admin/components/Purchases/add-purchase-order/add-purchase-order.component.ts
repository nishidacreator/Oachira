import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { AdminService } from "../../../admin.service";
import { Product } from "../../../models/product";
import { SecondaryUnit } from "../../../models/secondaryUnit";
import { Vendor } from "../../../models/vendor";

@Component({
  selector: "app-add-purchase-order",
  templateUrl: "./add-purchase-order.component.html",
  styleUrls: ["./add-purchase-order.component.scss"],
})
export class AddPurchaseOrderComponent implements OnInit {
  purchaseOrderNoCount = 1;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    public dialogRef: MatDialogRef<AddPurchaseOrderComponent>,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  id!: number;
  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
    this.productSubscription = this.getProducts();

    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  purchaseOrderForm = this.fb.group({
    purchaseOrderNo: ["", Validators.required],
    vendorId: [Validators.required],
    userId: [Validators.required],
    requestedPurchaseDate: [""],
    purchaseOrderDetails: [],
  });

  productsListForm = this.fb.group({
    products: this.fb.array([]),
  });

  products(): FormArray {
    return this.productsListForm.get("products") as FormArray;
  }

  newProduct(): FormGroup {
    return this.fb.group({
      productId: ["", Validators.required],
      quantity: ["", Validators.required],
    });
  }

  myControl = new FormControl<string | Product>("");
  filteredOptions: Product[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.product.filter(
      (option) =>
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase())) ||
        (option.code &&
          option.code.toLowerCase().includes(value?.toLowerCase())) ||
        (option.barCode &&
          option.barCode.toLowerCase().includes(value?.toLowerCase()))
    );
  }

  vendor: Vendor[] = [];
  vendorSubscriptions!: Subscription;
  getVendor() {
    return this.adminService.getVendor().subscribe((res) => {
      this.vendor = res;
    });
  }

  product: Product[] = [];
  filteredProduct$!: Observable<Product[]>;
  productSubscription!: Subscription;
  getProducts() {
    return this.adminService.getProduct().subscribe((res) => {
      this.product = res;
      this.filteredOptions = this.product;
    });
  }

  entryStatus = false;
  private submitSubscription: Subscription = new Subscription();
  onSubmit() {
    this.entryStatus = true;

    let data = {
      purchaseOrderNo: this.purchaseOrderForm.get("purchaseOrderNo")?.value,
      vendorId: this.purchaseOrderForm.get("vendorId")?.value,
      userId: this.id,
      requestedPurchaseDate: this.purchaseOrderForm.get("requestedPurchaseDate")
        ?.value,
      purchaseOrderDetails: this.productsListForm.getRawValue().products,
    };
    console.log(data);
    this.submitSubscription = this.adminService
      .addPurchaseOrder(data)
      .subscribe(
        (res) => {
          this._snackBar.open("Purchase added successfully...", "", {
            duration: 3000,
          });
          this.clearControls();
        },
        (error) => {
          alert(error);
        }
      );
  }

  clearControls() {
    this.purchaseOrderForm.reset();
    this.purchaseOrderForm.setErrors(null);
    Object.keys(this.purchaseOrderForm.controls).forEach((key) => {
      this.purchaseOrderForm.get(key)?.setErrors(null);
    });
  }

  //PURCHASE ORDER DETAILS
  status: boolean = false;
  addProduct() {
    this.status = true;
    this.products().push(this.newProduct());
  }

  removeProduct(i: number) {
    this.products().removeAt(i);
  }

  unit$!: Observable<SecondaryUnit[]>;
  getUnit() {
    this.unit$ = this.adminService.getSecondaryUnit();
  }

  viewPurchaseOrder() {
    this.router.navigateByUrl(
      "admin/purchases/purchaseorder/viewpurchaseorder"
    );
  }

  addUser() {
    this.router.navigateByUrl("admin/settings/user/adduser");
  }

  addVendor() {
    this.router.navigateByUrl("admin/settings/vendor");
  }

  addNewProduct() {
    this.router.navigateByUrl("admin/settings/product/addproduct");
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
