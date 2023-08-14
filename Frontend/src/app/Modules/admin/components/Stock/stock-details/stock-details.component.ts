import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stock } from '../../../models/stock/stock';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss']
})
export class StockDetailsComponent implements OnInit {

  ngOnDestroy(){
    this.stockSub.unsubscribe();
  }

  id!: number
  constructor(private adminService: AdminService, private route: ActivatedRoute) { 
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getStockById()
  }

  stockSub!: Subscription;
  detailSub!: Subscription;
  stock!: Stock;
  details!: any;
  getStockById(){
    this.stockSub = this.adminService.getStocksById(this.id).subscribe(res=>{
      this.stock = res;

      if(this.stock.type === true){
        this.detailSub = this.adminService.getPurchaseTransactionByStockId(this.id).subscribe(res=>{
          console.log(res)
          this.details = res
        })
      }
    })
  }

}
