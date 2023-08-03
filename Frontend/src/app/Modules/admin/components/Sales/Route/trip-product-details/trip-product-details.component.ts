import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, pipe } from 'rxjs';
import { PickListDetails } from 'src/app/Modules/salesexecutive/models/pickListDetails';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';

@Component({
  selector: 'app-trip-product-details',
  templateUrl: './trip-product-details.component.html',
  styleUrls: ['./trip-product-details.component.scss']
})
export class TripProductDetailsComponent implements OnInit, OnDestroy {

  constructor(private sEService: SalesExecutiveService, private route: ActivatedRoute) { }
  
  ngOnDestroy(): void {
    this.detailsSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.detailsSubscription = this.getPickList()
  }

  pickListDetails : PickListDetails[] = []
  detailsSubscription! : Subscription
  getPickList(){
    const routeId = this.route.snapshot.params['routeid']
    return this.sEService.getPickListDetailsByProductId(this.route.snapshot.params['id'])
    .subscribe((res)=>{
      this.pickListDetails = res.filter(x=>x.pickList.routeId == routeId)
    })
  }

}
