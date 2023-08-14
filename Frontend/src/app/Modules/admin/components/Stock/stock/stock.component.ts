import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';
import { Stock } from '../../../models/stock/stock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  ngOndestroy(){
    this.getSub.unsubscribe();
  }

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.getStock()
  }

  getSub!: Subscription;
  stock: Stock[] = []; 
  getStock(){
    this.getSub = this.adminService.getStocks().subscribe(res=>{
      console.log(res);
      this.stock = res;
    })
  }

  viewDetails(id: number){
    this.router.navigateByUrl('/admin/inventrory/viewstock/detail/' + id);
  }

}
