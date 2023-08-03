import { Component, OnInit, OnDestroy } from '@angular/core';
import { Trip } from '../../../../models/route/trip';
import { AdminService } from '../../../../admin.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-trip-list',
  templateUrl: './view-trip-list.component.html',
  styleUrls: ['./view-trip-list.component.scss']
})
export class ViewTripListComponent implements OnInit, OnDestroy {
  
  constructor(private adminService: AdminService, private router: Router) { }

  ngOnDestroy(): void {
    this.tripSubscriptions.unsubscribe()
  }

  ngOnInit(): void {
    this.tripSubscriptions = this.getTrips()
  }

  displayedColumns : string[] = ['id','routeId', 'date','manage']

  trips: Trip[ ] = []
  tripSubscriptions!: Subscription
  getTrips(){
    return this.adminService.getTrip().subscribe((res)=>{
      this.trips = res
    })
  }

  viewList(id: number){
    this.router.navigateByUrl('/admin/sales/viewpicklist/triplist/products/' + id)
  }

}
