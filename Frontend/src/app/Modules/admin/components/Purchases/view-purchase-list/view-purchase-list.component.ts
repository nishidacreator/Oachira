import { Component, OnInit } from '@angular/core';
import { PurchaseEntryDetails } from '../../../models/purchaseEntryDetails';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-purchase-list',
  templateUrl: './view-purchase-list.component.html',
  styleUrls: ['./view-purchase-list.component.scss']
})
export class ViewPurchaseListComponent implements OnInit {

  constructor(private adminSerivce: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe()
  }

  id: any
  ngOnInit(): void {
   this.id = this.route.snapshot.params['id']
   console.log(this.id)

    this.pESubscription = this.getPurchaseEntryDetails()
  }

  displayedColumns : string[] = ['id','productId','mrp', 'quantity', 'unitPrice','discount','netAmount','tax','taxAmount','grossAmount', 'manage']

  pEDetails: PurchaseEntryDetails[] = []
  pESubscription!: Subscription
  customer : any
  getPurchaseEntryDetails(){
    return this.adminSerivce.getPurchaseEntryDetailsByEntry(this.id).subscribe((res)=>{
      this.pEDetails = res
      console.log(this.pEDetails)
    })
  } 

  addProducts(){
    this.router.navigateByUrl('admin/purchases/purchaseentry/viewpurchaseentry/viewlist/addmore/' + this.id)
  }

  cId!: number
  editDetails(id : number){
    this.router.navigateByUrl('admin/purchases/purchaseentry/viewpurchaseentry/viewlist/editlist/'+ id)
  }

  // deleteDetails(id : number){
  //   this.sEService.deletePickListDetails(id).subscribe((res)=>{
  //   })
  //   this.getPickListDetails()
  // }

  viewInvoice(){
    this.router.navigateByUrl('admin/purchases/viewPurchaseDetaills/invoices/' + this.id)
  }
  
}


