import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../../admin.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Route } from '../../../../models/route/route';
import { Customer } from '../../../../models/customer/customer';
import { Product } from '../../../../models/settings/product';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { PickList } from 'src/app/Modules/salesexecutive/models/pickList';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnInit {

  constructor(private sEService: SalesExecutiveService, private router: Router) { }

  ngOnDestroy(): void {
    this.collectionSubscription.unsubscribe()
  }

  id: any;
  date: any;
  ngOnInit(): void {
    this.collectionSubscription = this.getPickList()

    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id
  }

  displayedColumns : string[] = ['id','customerId', 'routeId', 'status', 'manage']

  collection: PickList[] = []
  collectionSubscription!: Subscription
  getPickList(){
    return this.sEService.getPickList().pipe(map(x=> x
      .filter(y=> y.status === 'pending')
    ))
    .subscribe((res)=>{
      this.collection = res
    })
  }

  viewPickListDetails(id : number){
    this.router.navigateByUrl('/admin/sales/viewpicklist/details/'+id)
  } 
  
  viewTripList(){
    this.router.navigateByUrl('/admin/sales/viewpicklist/triplist')
  }

  viewRouteMap(){
    this.router.navigateByUrl('/admin/sales/viewpicklist/routemap')
  }
  
}

