import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Route } from 'src/app/Modules/admin/models/route/route';
import { RouteDetails } from 'src/app/Modules/admin/models/route/routeDetails';
@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.routeSubscription = this.getRoute()
  }

  panelOpenState = false;
  
  route : Route[] = [];
  routeSubscription! : Subscription;
  getRoute(){
    return this.adminService.getRoute().subscribe((res)=>{
      this.route = res
    })
  }

  details : RouteDetails[] = [];
  sortedItems: any[] = [];
  getCustomers(id : any){
    this.panelOpenState = true
    //Route details
    this.adminService.getRouteDetailsByRouteId(id).subscribe((res)=>{
      this.details = res
      this.sortedItems = this.details.sort((a, b) => a.routeIndex - b.routeIndex);
    })
   
  }

}
