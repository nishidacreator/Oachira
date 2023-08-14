import { Component, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { AdminService } from "../../../admin.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { PurchaseOrder } from "../../../models/purchaseOrder";

@Component({
  selector: "app-purchase-order",
  templateUrl: "./purchase-order.component.html",
  styleUrls: ["./purchase-order.component.scss"],
})
export class PurchaseOrderComponent implements OnInit {
  id!: number;
  pEntry: PurchaseOrder[] = [];
  pESubscription!: Subscription;

  displayedColumns: string[] = ["id","orderNo","vendorId","requestedPurchaseDate","manage","purchaseEntry"];

  constructor(
    public adminService: AdminService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pESubscription = this.getPurchaseOrder();
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe();
  }

  getPurchaseOrder() {
    return this.adminService.getPurchaseOrder().subscribe((res) => {
      this.pEntry = res.filter((x) => x.userId === this.id);
    });
  }

  addPurchaseOrder() {
   this.router.navigateByUrl('admin/purachases/addpurchaseorder')
  }

  viewPurchaseOrderDetails(id : number){
    this.router.navigateByUrl('admin/purchases/purchaseorder/viewpurchaseorder/'+ id)
  }  

  addPurchaseEntry(id : number){
    this.router.navigateByUrl('admin/purachases/purchaseentry/'+id)
  }

  viewPurchaseEntry(id : number){
    this.router.navigateByUrl('admin/purachases/purchaseentry/'+id)
  }
}
