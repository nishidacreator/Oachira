import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { PurchaseOrderDetails } from '../../../models/purchaseOrderDetails';

@Component({
  selector: "app-view-purchase-order",
  templateUrl: "./view-purchase-order.component.html",
  styleUrls: ["./view-purchase-order.component.scss"],
})
export class ViewPurchaseOrderComponent implements OnInit {
  id: any;
  displayedColumns: string[] = ["id", "productId", "quantity"];
  pEDetails: PurchaseOrderDetails[] = [];
  pESubscription!: Subscription;
  customer: any;

  constructor(
    private adminSerivce: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.pESubscription = this.getPurchaseOrderDetails();
  }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe();
  }

  getPurchaseOrderDetails() {
    return this.adminSerivce
      .getPurchaseOrderDetailsById(this.id)
      .subscribe((res) => {
        this.pEDetails = res;
        console.log(this.pEDetails);
      });
  }

  addProducts() {
    this.router.navigateByUrl(
      "admin/purchases/purchaseorder/viewpurchaseorder/addmore/" +
        this.id
    );
  }

}





