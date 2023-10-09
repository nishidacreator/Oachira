import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup, FormControl} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { AdminService } from "../../../admin.service";
import { Product } from "../../../models/settings/product";
import { Vendor } from "../../../models/settings/vendor";
import { PurchaseOrder } from "../../../models/purchase/purchaseOrder";

@Component({
  selector: "app-add-purchase-order",
  templateUrl: "./add-purchase-order.component.html",
  styleUrls: ["./add-purchase-order.component.scss"],
})
export class AddPurchaseOrderComponent implements OnInit {
  id!: number;
  purchases: PurchaseOrder[] = [];
  userSub!: Subscription;
  ivNum: string = "";
  nextId!: any;
  prefix!: string;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
    this.productSubscription = this.getProducts();
    //User Id
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
  filteredOptions: any
  filterOptions(event: Event) {

    let value = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase())) ||
        (option.code &&
          option.code.toLowerCase().includes(value?.toLowerCase())) ||
        (option.barCode &&
          option.barCode.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  generateInvoiceNum() {
    this.userSub = this.adminService.getPurchaseOrder().subscribe((res) => {
      this.purchases = res;

      // Check if there are any employees in the array
      if (this.purchases.length > 0) {
        const maxId = this.purchases.reduce((prevMax, inv) => {
          console.log(inv);
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.purchaseOrderNo.substring(5), 10);
          console.log(idNumber);

          this.prefix = this.extractLetters(inv.purchaseOrderNo);

          // Check if the extracted numeric part is a valid number
          if (!isNaN(idNumber)) {
            return idNumber > prevMax ? idNumber : prevMax;
          } else {
            // If the extracted part is not a valid number, return the previous max
            return prevMax;
          }
        }, 0);
        // Increment the maxId by 1 to get the next ID
        this.nextId = maxId + 1;
        console.log(this.nextId);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        this.nextId = 0o0;
        this.prefix = "INV";
      }
      console.log(this.nextId + "hih");

      const paddedId = `${this.prefix}${this.nextId
        .toString()
        .padStart(3, "0")}`;

      this.ivNum = paddedId;

      this.purchaseOrderForm.get("purchaseOrderNo")?.setValue(this.ivNum);
    });
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, "");
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
    return this.adminService.getProduct().subscribe((res:any) => {
      // debugger;
      this.product = res.items;
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
          console.log(res);
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

    this.productsListForm.reset();
    this.productsListForm.setErrors(null);
    Object.keys(this.productsListForm.controls).forEach((key) => {
      this.productsListForm.get(key)?.setErrors(null);
    });

    this.router.navigateByUrl("/admin/purachases/purchaseorder");
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
}
