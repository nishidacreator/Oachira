import { Component, OnInit } from '@angular/core';
// import { ChartDataset, ChartOptions, ChartType } from 'chart.js';



export interface GroceryProduct {
  serialNumber: number;
  name: string;
  sale: number;
  purchase: number;
}


const GROCERY_DATA: GroceryProduct[] = [
  { serialNumber: 1, name: 'Apple', sale: 2, purchase: 1 },
  { serialNumber: 2, name: 'Banana', sale: 1, purchase: 1 },
  { serialNumber: 3, name: 'Carrot', sale: 1, purchase: 1 },
  { serialNumber: 4, name: 'Tomato', sale: 3, purchase: 2 },
  { serialNumber: 5, name: 'Potato', sale: 2, purchase: 1 },
  { serialNumber: 6, name: 'Milk', sale: 4, purchase: 3 },
  { serialNumber: 7, name: 'Bread', sale: 2, purchase: 1 },
  { serialNumber: 8, name: 'Eggs', sale: 1, purchase: 1 },
  { serialNumber: 9, name: 'Cheese', sale: 5, purchase: 4 },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // public barChartOptions: any = {
  //   responsive: true,
  // };
  // public barChartLabels: string[] = GROCERY_DATA.map(product => product.name);
  // public barChartType: string = 'bar';
  // public barChartLegend = true;
  // public barChartData: any[] = [
  //   { data: GROCERY_DATA.map(product => product.sale), label: 'Sales' },
  //   { data: GROCERY_DATA.map(product => product.purchase), label: 'Purchases' },
  // ];

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = GROCERY_DATA;

}
