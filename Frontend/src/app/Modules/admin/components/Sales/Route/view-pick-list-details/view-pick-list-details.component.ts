import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PickListDetails } from 'src/app/Modules/salesexecutive/models/pickListDetails';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';

@Component({
  selector: 'app-view-pick-list-details',
  templateUrl: './view-pick-list-details.component.html',
  styleUrls: ['./view-pick-list-details.component.scss']
})
export class ViewPickListDetailsComponent implements OnInit {

  constructor(private sEService: SalesExecutiveService, private router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.collectionSubscription.unsubscribe()
  }

  id: any
  ngOnInit(): void {
   this.id = this.route.snapshot.params['id']

    this.collectionSubscription = this.getPickListDetails()
  }

  displayedColumns : string[] = ['id','productId', 'quantity', 'manage']

  collection: PickListDetails[] = []
  collectionSubscription!: Subscription
  customer : any
  getPickListDetails(){
    return this.sEService.getPickListDetails(this.id).subscribe((res)=>{
      this.collection = res
    })
  } 

  addProducts(){
    this.router.navigateByUrl('admin/sales/viewpicklist/view/picklistdetails/addmore/'+ this.id)
  }

  cId!: number
  editDetails(id : number){
    this.router.navigateByUrl('admin/sales/viewpicklist/view/picklistdetails/editdetails/'+ id)
  }

  deleteDetails(id : number){
    this.sEService.deletePickListDetails(id).subscribe((res)=>{
    })
    this.getPickListDetails()
  }
  
}


