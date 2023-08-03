import { Component, OnDestroy, OnInit } from '@angular/core';
import { DailyCollection } from '../../../models/dailyCollection';
import { Observable, Subscription, map } from 'rxjs';
import { SalesExecutiveService } from '../../../sales-executive.service';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.scss']
})
export class ViewCollectionComponent implements OnInit, OnDestroy {

  constructor(private sEService: SalesExecutiveService) { }

  ngOnDestroy(): void {
    this.collectionSubscription.unsubscribe()
  }

  id: any;
  ngOnInit(): void {
    this.collectionSubscription = this.getCollection()

    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id
  }

  displayedColumns : string[] = ['id','customerId', 'amount', 'invoiceNo', 'paymentMode','remarks']

  collection: DailyCollection[] = []
  collectionSubscription!: Subscription
  getCollection(){
    return this.sEService.getCollection().pipe(map(x=> x.filter(y=> y.salesExecutiveId === this.id)))
    .subscribe((res)=>{
      this.collection = res
    })
  }
}
