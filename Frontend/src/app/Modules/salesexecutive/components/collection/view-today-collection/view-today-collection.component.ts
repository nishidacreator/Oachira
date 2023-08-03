import { Component, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { DailyCollection } from '../../../models/dailyCollection';
import { SalesExecutiveService } from '../../../sales-executive.service';

@Component({
  selector: 'app-view-today-collection',
  templateUrl: './view-today-collection.component.html',
  styleUrls: ['./view-today-collection.component.scss']
})
export class ViewTodayCollectionComponent implements OnInit {

  constructor(private sEService: SalesExecutiveService) { }

  ngOnDestroy(): void {
    this.collectionSubscription.unsubscribe()
  }

  id: any;
  date: any;
  ngOnInit(): void {
    this.collectionSubscription = this.getCollection()

    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id
    
    this.date = new Date().toISOString().split("T")[0]
  }

  displayedColumns : string[] = ['id','customerId', 'amount', 'invoiceNo', 'paymentMode','remarks']

  collection: DailyCollection[] = []
  collectionSubscription!: Subscription
  getCollection(){
    return this.sEService.getCollection().pipe(map(x=> x
      .filter(y => y.salesExecutiveId === this.id)
      .filter(z => z.date === this.date)
      ))
    .subscribe((res)=>{
      this.collection = res
    })
  }
}

