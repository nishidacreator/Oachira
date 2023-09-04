import { SecondaryUnit } from '../../../models/settings/secondaryUnit';
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, startWith, map, Subscription, findIndex, filter } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Product } from '../../../models/settings/product';
import { Vendor } from '../../../models/settings/vendor';
import { Tax } from '../../../models/settings/tax';
import { User } from '../../../models/settings/user';
import { ActivatedRoute, Router } from '@angular/router';
import { BoldReportComponents } from '@boldreports/angular-reporting-components';
import { InvoiceNumberComponent } from '../../Setting/prefixes/invoice-number/invoice-number.component';
import { PurchaseEntry } from '../../../models/purchase/purchaseEntry';
import { VendorManagementComponent } from '../../Setting/vendor-management/vendor-management.component';

@Component({
  selector: "app-add-purchase-entry",
  templateUrl: "./add-purchase-entry.component.html",
  styleUrls: ["./add-purchase-entry.component.scss"],
})
export class AddPurchaseEntryComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;

    //purchaseOrderId
    this.purchaseOrderId = this.route.snapshot.params["id"];
  }

  ngOnDestroy() {
    // this.brandSubscription?.unsubscribe()
    this.productSubscription?.unsubscribe();
    this.submitSubscription.unsubscribe();
    this.vendorSubscriptions.unsubscribe();
    // this.taxIdSubscription.unsubscribe()
  }

  id!: number;
  purchaseOrderId: any;
  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
    this.productSubscription = this.getProducts();
    this.getTax();
    this.getUnit();
    this.generateInvoiceNum();

    if (this.purchaseOrderId) {
      this.getPurchaseOrder();
    }

    this.purchaseEntryForm.valueChanges.subscribe((changes) => {
      this.purchaseEntryForm.value;
    });
  }

  purchaseEntryForm = this.fb.group({
    purchaseInvoice: ["", Validators.required],
    vendorId: [Validators.required],
    purchaseAmount: [""],
    userId: [],
    eWayBillNo: ["", Validators.required],
    purachseDate: ["", Validators.required],
    purchaseEntryDetails: [],
  });

  productForm = this.fb.group({
    products: this.fb.array([]),
  });

  products(): FormArray {
    return this.productForm.get("products") as FormArray;
  }

  newProduct(initialValue?: any): FormGroup {
    return this.fb.group({
      productId: [
        initialValue ? initialValue.productId : "",
        Validators.required,
      ],
      quantity: [
        initialValue ? initialValue.quantity : null,
        Validators.required,
      ],
      discount: [null],
      rate: [null, Validators.required],
      grossAmount: [""],
      // secondaryUnitId: ['', Validators.required],
      taxId: [""],
      taxAmount: [""],
      netAmount: [""],
      mrp: [""],
    });
  }

  // displayedColumns : String[] = ['productName','code','barCode','primaryUnitId','categoryId','brandId','manage']

  //Search in MatSelect
  myControl = new FormControl<string | Product>("");
  filteredOptions: Product[] = [];
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
  // End

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
      purchaseInvoice: this.purchaseEntryForm.get("purchaseInvoice")?.value,
      vendorId: this.purchaseEntryForm.get("vendorId")?.value,
      purchaseAmount: this.purchaseEntryForm.get("purchaseAmount")?.value,
      userId: this.id,
      eWayBillNo: this.purchaseEntryForm.get("eWayBillNo")?.value,
      purachseDate: this.purchaseEntryForm.get("purachseDate")?.value,
      purchaseEntryDetails: this.productForm.getRawValue().products,
      purchaseOrderId: this.purchaseOrderId,
    };
    console.log(data);
    this.submitSubscription = this.adminService
      .addPurachaseEntry(data)
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
    this.purchaseEntryForm.reset();
    this.purchaseEntryForm.setErrors(null);
    Object.keys(this.purchaseEntryForm.controls).forEach((key) => {
      this.purchaseEntryForm.get(key)?.setErrors(null);
    });

    this.productForm.reset();
    this.productForm.setErrors(null);
    Object.keys(this.productForm.controls).forEach((key) => {
      this.productForm.get(key)?.setErrors(null);
    });

    this.router.navigateByUrl("/admin/purachases/purchaseentry");
  }

  invoiceNumber!: string;
  generateInvoiceNumber() {
    const dialogRef = this.dialog.open(InvoiceNumberComponent, {
      height: "800px",
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let data = result;
        console.log(data);

        this.purchaseEntryForm
          .get("purchaseInvoice")
          ?.setValue(data.invoiceNum);
      }
    });
  }

  purchases: PurchaseEntry[] = [];
  userSub!: Subscription;
  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  generateInvoiceNum() {
    this.userSub = this.adminService.getPurchaseEntry().subscribe((res) => {
      this.purchases = res;
      console.log(this.purchases);

      // Check if there are any employees in the array
      if (this.purchases.length > 0) {
        const maxId = this.purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.purchaseInvoice.substring(5), 10);
          console.log(idNumber);

          this.prefix = this.extractLetters(inv.purchaseInvoice);

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

      this.purchaseEntryForm.get("purchaseInvoice")?.setValue(this.ivNum);
    });
  }

  generateRandomString(characters: string, length: number): string {
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomString;
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, "");
  }

  //PURCHASE ENTRY DETAILS
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

  tax$!: Observable<Tax[]>;
  getTax() {
    this.tax$ = this.adminService.getTax();
  }

  viewPurchaseEntry() {
    this.router.navigateByUrl(
      "admin/purchases/purchaseentry/viewpurchaseentry"
    );
  }

  netAmount!: any;
  productIndex!: number;
  calculateAmount() {
    this.productIndex = this.productForm.getRawValue().products.length - 1;
    let quantity = this.products().at(this.productIndex).get("quantity")?.value;
    let rate = this.products().at(this.productIndex).get("rate")?.value;
    let discount = this.products().at(this.productIndex).get("discount")?.value;
    console.log(quantity, rate, discount);

    if (quantity && rate) {
      this.netAmount = quantity * rate - discount;
      this.products()
        .at(this.productIndex)
        .get("netAmount")
        ?.setValue(this.netAmount);
    }
  }

  igst!: number;
  grossAmount!: number;
  taxAmount!: number;
  taxIdSubscription!: Subscription;
  getTaxAmount(id: number) {
    this.taxIdSubscription = this.adminService
      .getTaxById(id)
      .subscribe((res) => {
        this.igst = res.igst;
        if (this.netAmount && this.igst) {
          this.taxAmount = this.netAmount * (this.igst / 100);
          this.grossAmount = this.netAmount + this.taxAmount;
          console.log(this.grossAmount);
          this.products()
            .at(this.productIndex)
            .get("taxAmount")
            ?.setValue(this.taxAmount);
          this.products()
            .at(this.productIndex)
            .get("grossAmount")
            ?.setValue(this.grossAmount);
        }
      });
  }

  i = 0;
  purchaseAmount: any = 0;
  getPurchaseAmount() {
    this.productIndex = this.productForm.getRawValue().products.length - 1;
    if (this.status) {
      let grossAmount = this.products()
        .at(this.productIndex)
        .get("grossAmount")?.value;
      if (grossAmount) {
        if (this.productIndex === this.i) {
          this.i = this.i + 1;
          this.purchaseAmount = grossAmount + this.purchaseAmount;
          this.purchaseEntryForm
            .get("purchaseAmount")
            ?.setValue(this.purchaseAmount);
        }
      }
    }
  }

  addUser() {
    this.router.navigateByUrl("admin/settings/user/adduser");
  }

  addVendor() {
    const dialogRef = this.dialog.open(VendorManagementComponent, {
      width: "1000px",
      data: { status: "dialogue" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getVendor();
    });
  }

  addNewProduct() {
    this.router.navigateByUrl("admin/settings/product/addproduct");
  }

  getPurchaseOrder() {
    this.adminService
      .getPurchaseOrderById(this.purchaseOrderId)
      .subscribe((res) => {
        console.log(res);

        let vendor: any = res.vendor.id;
        let date: any = res.requestedPurchaseDate;

        this.purchaseEntryForm.patchValue({
          vendorId: vendor,
          purachseDate: date,
        });

        this.adminService
          .getPurchaseOrderDetailsById(res.id)
          .subscribe((details) => {
            const productsArray = [];

            for (let i = 0; i < details.length; i++) {
              const product: any = {
                productId: details[i].product.id,
                quantity: details[i].quantity,
              };
              this.products().push(this.newProduct(product)); // Create a FormGroup for each product
            }
          });
      });
  }

  getProduct() {}
}