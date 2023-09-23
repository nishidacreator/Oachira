import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../admin.service';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { ExcelExportService, GridComponent, PageService, PdfExportService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { Subscription, forkJoin, map } from 'rxjs';
// import { BoldReportsAngularModule } from '@boldreports/angular-reporting-components/src/core';

@Component({
  selector: 'app-view-trip-prouct-list',
  templateUrl: './view-trip-prouct-list.component.html',
  styleUrls: ['./view-trip-prouct-list.component.scss'],
  providers: [ToolbarService, PageService, ExcelExportService, PdfExportService]
})
export class ViewTripProuctListComponent implements OnInit,AfterViewInit, OnDestroy {
  public grid!: GridComponent;
  public toolbar: string[] | undefined;
  public pageSettings: Object | undefined;


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
    
    this.tripSubscription = this.getTrip();
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

  ngAfterViewInit(): void {
    this.toolbar = [ 'PdfExport'];
    this.pageSettings = { pageSize: 10 };
  }
  pdfprint=true;
  toolbarClick(args: ClickEventArgs): void {
    console.log(this.combinedArray,this.grid);
    switch (args.item.id) {
        case 'AdvancedExport_pdfexport':
            this.grid.pdfExport(this.getPdfExportProperties());
            break;
    }
}
// toolbarClick(args: ClickEventArgs): void {
//   if (this.grid && args.item.id === 'AdvancedExport_pdfexport' && this.grid.pdfExport) {
//     this.grid.pdfExport(this.getPdfExportProperties());
//   }
// }

private getDate(): string {
    let date: string = '';
    date += ((new Date()).getMonth().toString()) + '/' + ((new Date()).getDate().toString());
    return date += '/' + ((new Date()).getFullYear().toString());
}



private getPdfExportProperties(): any {
    return {
        header: {
            fromTop: 0,
            height: 120,
            contents: [
                {
                    type: 'Text',
                    value: 'INVOICE',
                    position: { x: 280, y: 0 },
                    style: { textBrushColor: '#C25050', fontSize: 25 },
                },
                {
                    type: 'Text',
                    value: 'INVOICE NUMBER',
                    position: { x: 500, y: 30 },
                    style: { textBrushColor: '#C67878', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: 'Date',
                    position: { x: 600, y: 30 },
                    style: { textBrushColor: '#C67878', fontSize: 10 },
                }, {
                    type: 'Text',
                    value: '223344',
                    position: { x: 500, y: 50 },
                    style: { textBrushColor: '#000000', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: this.getDate(),
                    position: { x: 600, y: 50 },
                    style: { textBrushColor: '#000000', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: 'CUSTOMER ID',
                    position: { x: 500, y: 70 },
                    style: { textBrushColor: '#C67878', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: 'TERMS',
                    position: { x: 600, y: 70 },
                    style: { textBrushColor: '#C67878', fontSize: 10 },
                }, {
                    type: 'Text',
                    value: '223',
                    position: { x: 500, y: 90 },
                    style: { textBrushColor: '#000000', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: 'Net 30 days',
                    position: { x: 600, y: 90 },
                    style: { textBrushColor: '#000000', fontSize: 10 },
                },
                {
                    type: 'Text',
                    value: 'Oachira Traders',
                    position: { x: 20, y: 30 },
                    style: { textBrushColor: '#C67878', fontSize: 20 }
                },
                {
                    type: 'Text',
                    value: '2501 Aerial Center Parkway',
                    position: { x: 20, y: 65 },
                    style: { textBrushColor: '#000000', fontSize: 11 }
                },
                {
                    type: 'Text',
                    value: 'Tel +1 888.936.8638 Fax +1 919.573.0306',
                    position: { x: 50, y: 80 },
                    style: { textBrushColor: '#000000', fontSize: 20 }
                },
            ]
        },
        footer: {
            fromBottom: 160,
            height: 100,
            contents: [
                {
                    type: 'Text',
                    value: 'Thank you for your business !',
                    position: { x: 250, y: 20 },
                    style: { textBrushColor: '#C67878', fontSize: 14 }
                },
                {
                    type: 'Text',
                    value: '! Visit Again hello !',
                    position: { x: 300, y: 45 },
                    style: { textBrushColor: '#C67878', fontSize: 14 }
                }
            ]
        },
        
        fileName: "pdfdocument.pdf"
    };
}
}

