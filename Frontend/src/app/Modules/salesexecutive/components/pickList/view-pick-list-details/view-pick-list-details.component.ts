import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { PickList } from '../../../models/pickList';
import { SalesExecutiveService } from '../../../sales-executive.service';
import { PickListDetails } from '../../../models/pickListDetails';

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
    this.router.navigateByUrl('salesexecutive/picklist/view/picklistdetails/addmore/'+this.id)
  }

  cId!: number
  editDetails(id : number){
    this.router.navigateByUrl('salesexecutive/picklist/view/picklistdetails/editdetails/'+ id)
  }

  deleteDetails(id : number){
    this.sEService.deletePickListDetails(id).subscribe((res)=>{
    })
    this.getPickListDetails()
  }
  
}


