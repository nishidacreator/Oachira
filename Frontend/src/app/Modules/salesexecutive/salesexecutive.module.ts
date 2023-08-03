import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesexecutiveRoutingModule } from './salesexecutive-routing.module';
import { PickListComponent } from './components/pickList/pick-list/pick-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../shared-components/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DailyCollectionComponent } from './components/collection/daily-collection/daily-collection.component';
import { ViewCollectionComponent } from './components/collection/view-collection/view-collection.component';
import { ViewPickListComponent } from './components/pickList/view-pick-list/view-pick-list.component';
import { ViewTodayCollectionComponent } from './components/collection/view-today-collection/view-today-collection.component';
import { ViewPickListDetailsComponent } from './components/pickList/view-pick-list-details/view-pick-list-details.component';
import { AddProductsComponent } from './components/pickList/add-products/add-products.component';
import { EditListDetailsComponent } from './components/pickList/edit-list-details/edit-list-details.component';


@NgModule({
  declarations: [
    PickListComponent,
    NavbarComponent,
    DashboardComponent,
    DailyCollectionComponent,
    ViewCollectionComponent,
    ViewPickListComponent,
    ViewTodayCollectionComponent,
    ViewPickListDetailsComponent,
    AddProductsComponent,
    EditListDetailsComponent
  ],
  imports: [
    CommonModule,
    SalesexecutiveRoutingModule,
    MaterialModule
  ]
})
export class SalesexecutiveModule { }
