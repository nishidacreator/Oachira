import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { PurchaseEntry } from '../../../models/purchaseEntry';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.scss']
})
export class ViewPurchaseOrderComponent implements OnInit {
  constructor(private adminService: AdminService, private router: Router) { }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe()
  }

  id: any;
  date: any;
  ngOnInit(): void {
    this.pESubscription = this.getPurchaseEntry()

    //USER
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id
  }

  displayedColumns : string[] = ['purchaseOrderId','vendorId', 'requestedPurchaseDate','manage']

  pEntry: PurchaseEntry[] = []
  pESubscription!: Subscription
  getPurchaseEntry(){
    return this.adminService.getPurchaseEntry().subscribe(res=>{
      this.pEntry = res.filter(x=> x.userId === this.id)
      console.log(this.pEntry)
    })
  }
  
}
