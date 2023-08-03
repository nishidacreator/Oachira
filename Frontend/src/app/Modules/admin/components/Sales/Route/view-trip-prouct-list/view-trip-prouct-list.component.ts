import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../admin.service';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { Subscription, forkJoin, map } from 'rxjs';
// import { BoldReportsAngularModule } from '@boldreports/angular-reporting-components/src/core';

@Component({
  selector: 'app-view-trip-prouct-list',
  templateUrl: './view-trip-prouct-list.component.html',
  styleUrls: ['./view-trip-prouct-list.component.scss']
})
export class ViewTripProuctListComponent implements OnInit, OnDestroy {


  constructor(private route: ActivatedRoute, private adminService: AdminService, private sEService: SalesExecutiveService,
    private router: Router) { 
        
    }

    testData ={
      "number": "123",
      "seller": {
          "name": "Next Step Webs, Inc.",
          "road": "12345 Sunny Road",
          "country": "Sunnyville, TX 12345"
      },
      "buyer": {
          "name": "Acme Corp.",
          "road": "16 Johnson Road",
          "country": "Paris, France 8060"
      },
      "items": [{
          "name": "Website design",
          "price": 300
      }]
  }

  ngOnDestroy(): void {
    this.tripSubscription.unsubscribe()
  }

  tripId : any;
  ngOnInit(): void {
    this.tripId = this.route.snapshot.params['id'];
    
    this.tripSubscription = this.getTrip()
  }

  routeId! : number;
  productList : any[] = [];
  countMapArray : any[] = [];
  combinedArray: { productId: string, productName: string, count: number }[] = [];
  tripSubscription! : Subscription;
  pickListId: any;
  getTrip(){
    return this.adminService.getTripById(this.tripId).subscribe((res)=>{
      this.routeId = res.routeId
      this.sEService.getPickListByRouteId(this.routeId).pipe(map((x)=> x.filter((y)=>y.status === 'pending')))
      .subscribe((res)=>{
        const observables = res.map((pick) => {
          return this.sEService.getPickListDetails(pick.id);
        });

        forkJoin(observables).subscribe((pickListDetails) => {
          const countMap = new Map<any, any>(); // Map to store productId and its count
          const productMap = new Map<any, any>();

          for (let i = 0; i < pickListDetails.length; i++) {
            for (let j = 0; j < pickListDetails[i].length; j++) {
              this.productList.push(pickListDetails[i][j]);

              const productId = pickListDetails[i][j].product.id;
              const productCount = pickListDetails[i][j].quantity;
              const productName = pickListDetails[i][j].product.productName;

              if (countMap.has(productId)) {
                countMap.set(productId, countMap.get(productId) + productCount);
              } else {
                countMap.set(productId, productCount);
              }

              if (!productMap.has(productId)) {
                productMap.set(productId, productName);
              }
            }
          } 
          for (const [productId, count] of countMap) {
            const productName = productMap.get(productId);
            this.combinedArray.push({ productId, productName, count });
          } 
        });
    })
  })}

  viewDetails(id : any){
    this.router.navigateByUrl('/admin/sales/viewpicklist/triplist/products/view/' + id + '/' + this.routeId)
  }

}
