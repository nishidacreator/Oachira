import { ChangeDetectorRef, Component, OnInit, Renderer2 } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { SecondaryUnit } from "../../../models/secondaryUnit";
import { Product } from "../../../models/product";
import { Vendor } from "../../../models/vendor";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AdminService } from "../../../admin.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PurchaseEntry } from "../../../models/purchaseEntry";
import { AddPurchaseOrderComponent } from "../add-purchase-order/add-purchase-order.component";

@Component({
  selector: "app-purchase-order",
  templateUrl: "./purchase-order.component.html",
  styleUrls: ["./purchase-order.component.scss"],
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrderNoCount = 1;
  id!: number;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    ///
    this.pESubscription = this.getPurchaseEntry();
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ///

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe();
  }

  date: any;

  displayedColumns: string[] = [
    "purchaseOrderId",
    "vendorId",
    "requestedPurchaseDate",
    "manage",
    "addPurchaseEntry",
  ];

  pEntry: PurchaseEntry[] = [];
  pESubscription!: Subscription;
  getPurchaseEntry() {
    return this.adminService.getPurchaseEntry().subscribe((res) => {
      this.pEntry = res.filter((x) => x.userId === this.id);
      console.log(this.pEntry);
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddPurchaseOrderComponent, {
      height: '800px',
      width: '600px',
      data: {},
    });
  }

  viewPurchaseOrderDetails(id : number){
    // console.log(id)
    this.router.navigateByUrl('admin/purchases/purchaseorder/viewpurchaseorder/'+ id)
  }  

  addPurchaseEntry(id : number){
    this.router.navigateByUrl('admin/purachases/purchaseentry/'+id)
  }
}
