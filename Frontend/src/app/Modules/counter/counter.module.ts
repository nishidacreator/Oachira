import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterRoutingModule } from './counter-routing.module';
import { CounterViewComponent } from './components/counter-view/counter-view.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from '../shared-components/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
  
    CounterViewComponent,
       NavbarComponent
  ],
  imports: [
    CommonModule,
    CounterRoutingModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class CounterModule { }
