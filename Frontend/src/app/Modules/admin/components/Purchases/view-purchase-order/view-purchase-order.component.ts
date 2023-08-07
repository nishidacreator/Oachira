import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { PurchaseEntry } from '../../../models/purchaseEntry';
import { PurchaseEntryDetails } from '../../../models/purchaseEntryDetails';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.scss']
})
export class ViewPurchaseOrderComponent implements OnInit {
  


  constructor(private adminSerivce: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.pESubscription.unsubscribe()
  }

  id: any
  ngOnInit(): void {
   this.id = this.route.snapshot.params['id']

    this.pESubscription = this.getPurchaseEntryDetails()
  }

  displayedColumns : string[] = ['id','productId', 'quantity']

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
    this.router.navigateByUrl('salesexecutive/picklist/view/picklistdetails/editdetails/'+ id)
  }

  // deleteDetails(id : number){
  //   this.sEService.deletePickListDetails(id).subscribe((res)=>{
  //   })
  //   this.getPickListDetails()
  // }
  
}





