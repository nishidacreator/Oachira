import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../../admin.service';
import { TripDetails } from '../../../../models/route/tripDetails';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-trip-details',
  templateUrl: './view-trip-details.component.html',
  styleUrls: ['./view-trip-details.component.scss']
})
export class ViewTripDetailsComponent implements OnInit {

    constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute) { }
  
    ngOnDestroy(): void {
      this.detailsSubscription.unsubscribe()
    }
  
    id: any
    ngOnInit(): void {
     this.id = this.route.snapshot.params['id']
  
      this.detailsSubscription = this.getTripDetails()
    }
  
    displayedColumns : string[] = ['id','customerId', 'amount', 'invoiceNo', 'manage']
  
    details: TripDetails[] = []
    detailsSubscription!: Subscription
    customer : any
    getTripDetails(){
      return this.adminService.getTripDetails(this.id).subscribe((res)=>{
        this.details = res
      })
    } 
  
    addProducts(){
      this.router.navigateByUrl('admin/settings/route/addtrip/tripdetails/addmore/'+this.id)
    }
  
    cId!: number
    editDetails(id : number){
      // this.router.navigateByUrl('sales/picklist/view/picklistdetails/editdetails/'+ id)
    }
  
    deleteDetails(id : number){
      // this.sEService.deletePickListDetails(id).subscribe((res)=>{
      //   console.log(res)
      // })
      // this.getPickListDetails()
    }
    
  }
  
  
  