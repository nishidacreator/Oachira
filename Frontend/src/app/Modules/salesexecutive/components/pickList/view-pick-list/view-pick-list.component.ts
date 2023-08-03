import { Component, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { DailyCollection } from '../../../models/dailyCollection';
import { SalesExecutiveService } from '../../../sales-executive.service';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { PickList } from '../../../models/pickList';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-pick-list',
  templateUrl: './view-pick-list.component.html',
  styleUrls: ['./view-pick-list.component.scss']
})
export class ViewPickListComponent implements OnInit {

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
    this.router.navigateByUrl('/salesexecutive/picklist/view/picklistdetails/'+id)
  }   
  
}

