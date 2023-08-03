import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PickListComponent } from './components/pickList/pick-list/pick-list.component';
import { DailyCollectionComponent } from './components/collection/daily-collection/daily-collection.component';
import { ViewPickListComponent } from './components/pickList/view-pick-list/view-pick-list.component';
import { ViewCollectionComponent } from './components/collection/view-collection/view-collection.component';
import { ViewTodayCollectionComponent } from './components/collection/view-today-collection/view-today-collection.component';
import { ViewPickListDetailsComponent } from './components/pickList/view-pick-list-details/view-pick-list-details.component';
import { AddProductsComponent } from './components/pickList/add-products/add-products.component';
import { EditListDetailsComponent } from './components/pickList/edit-list-details/edit-list-details.component';
import { AddCustomerComponent } from '../admin/components/Setting/customers/add-customer/add-customer.component';

const routes: Routes = [
  {path: '', component:NavbarComponent,
  children:[
  {path: 'home', component: DashboardComponent},
  
  {path: 'picklist/add', component: PickListComponent},
  {path: 'picklist/view', component: ViewPickListComponent},
  {path: 'picklist/view/picklistdetails/:id', component: ViewPickListDetailsComponent},
  {path: 'picklist/view/picklistdetails/addmore/:id', component: AddProductsComponent},
  {path: 'picklist/view/picklistdetails/editdetails/:id', component: EditListDetailsComponent},

  {path: 'dailycollection/add', component: DailyCollectionComponent},
  {path: 'dailycollection/view', component: ViewCollectionComponent},
  {path: 'dailycollection/todayview', component: ViewTodayCollectionComponent},

  {path: 'settings/customer/customermanage', component: AddCustomerComponent},
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesexecutiveRoutingModule { }
