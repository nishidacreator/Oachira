import { Component, OnInit } from '@angular/core';
import { PurchaseEntry } from '../../../models/purchaseEntry';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-view-purchase-entry',
  templateUrl: './view-purchase-entry.component.html',
  styleUrls: ['./view-purchase-entry.component.scss']
})
export class ViewPurchaseEntryComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router, private route:ActivatedRoute) { }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe()
  }

  id: any;
  date: any;
  purchaseOrderId: any;
  ngOnInit(): void {
    this.pESubscription = this.getPurchaseEntry()

    //USER
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id   
  }

  displayedColumns : string[] = ['id','purachseDate','vendorId', 'purchaseInvoice', 'eWayBillNo', 'purchaseAmount', 'manage']

  pEntry: PurchaseEntry[] = []
  pESubscription!: Subscription
  getPurchaseEntry(){
    return this.adminService.getPurchaseEntry().subscribe(res=>{
      this.pEntry = res.filter(x=> x.user.id === this.id)
    })
  }

  viewPurchaseListDetails(id : number){
    this.router.navigateByUrl('admin/purchases/purchaseentry/viewpurchaseentry/viewlist/'+ id)
  }   
  addPurchaseEntry() {
    this.router.navigateByUrl('admin/purachases/addpurchaseentry')
   }

}


