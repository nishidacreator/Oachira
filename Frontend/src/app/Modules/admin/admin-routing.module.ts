import { StockComponent } from './components/Stock/stock/stock.component';
import { AddCustomerComponent } from './components/Setting/customers/add-customer/add-customer.component';
import { CustomerGradeComponent } from './components/Setting/customers/customer-grade/customer-grade.component';
import { CustomerCategoryComponent } from './components/Setting/customers/customer-category/customer-category.component';
import { TaxManagementComponent } from './components/Setting/tax-management/tax-management.component';
import { UnitManagementComponent } from './components/Setting/products/unit-management/unit-management.component';
import { BrandManagementComponent } from './components/Setting/products/brand-management/brand-management.component';
import { CategoryManagementComponent } from './components/Setting/products/category-management/category-management.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductManagementComponent } from './components/Setting/products/product-management/product-management.component';
import { RoleManagementComponent } from './components/Setting/users/role-management/role-management.component';
import { RouteManagementComponent } from './components/Setting/route/route-management/route-management.component';
import { SettingsComponent } from './components/Setting/settings/settings.component';
import { VehicleManagementComponent } from './components/Setting/trip/vehicle-management/vehicle-management.component';
import { VendorManagementComponent } from './components/Setting/vendor-management/vendor-management.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddPurchaseEntryComponent } from './components/Purchases/add--purchase-entry/add-purchase-entry.component';
import { AddRouteDaysComponent } from './components/Setting/route/route/add-route-days/add-route-days.component';
import { AddRouteDetailsComponent } from './components/Setting/route/route/add-route-details/add-route-details.component';
import { AddRouteComponent } from './components/Setting/route/route/add-route/add-route.component';
import { WarehouseManagementComponent } from './components/Setting/warehouse-management/warehouse-management.component';
import { AddUserComponent } from './components/Setting/users/add-user/add-user.component';
import { PickListComponent } from './components/Sales/Route/pick-list/pick-list.component';
import { ViewPickListDetailsComponent } from './components/Sales/Route/view-pick-list-details/view-pick-list-details.component';
import { AddProductsComponent } from './components/Sales/Route/add-products/add-products.component';
import { EditListDetailsComponent } from './components/Sales/Route/edit-list-details/edit-list-details.component';
import { ViewCollectionComponent } from './components/Collections/view-collection/view-collection.component';
import { AddTripComponent } from './components/Setting/trip/add-trip/add-trip.component';
import { ViewTripDetailsComponent } from './components/Sales/Route/view-trip-details/view-trip-details.component';
import { AddMoreTripDetailsComponent } from './components/Setting/trip/add-more-trip-details/add-more-trip-details.component';
import { TripDaysComponent } from './components/Setting/trip/trip-days/trip-days.component';
import { ViewTripListComponent } from './components/Sales/Route/view-trip-list/view-trip-list.component';
import { ViewTripProuctListComponent } from './components/Sales/Route/view-trip-prouct-list/view-trip-prouct-list.component';
import { TripProductDetailsComponent } from './components/Sales/Route/trip-product-details/trip-product-details.component';
import { RouteMapComponent } from './components/Sales/Route/route-map/route-map.component';
import { TestComponent } from './components/Setting/route/test/test.component';
import { TestReportComponent } from 'src/app/Modules/admin/test-report/test-report.component';
import { AddProductComponent } from './components/Setting/products/add-product/add-product.component';
import { TestPrintComponent } from './test-print/test-print.component';
import { InvoiceNumberComponent } from './components/Setting/prefixes/invoice-number/invoice-number.component';
import { HomeComponent } from './components/home/home.component';
import { ViewPurchaseEntryComponent } from './components/Purchases/view-purchase-entry/view-purchase-entry.component';
import { ViewPurchaseListComponent } from './components/Purchases/view-purchase-list/view-purchase-list.component';
import { AddMoreProductsComponent } from './components/Purchases/add-more-products/add-more-products.component';
import { PurchaseOrderComponent } from './components/Purchases/purchase-order/purchase-order.component';
import { ViewPurchaseOrderComponent } from './components/Purchases/view-purchase-order/view-purchase-order.component';
import { AddPurchaseOrderComponent } from './components/Purchases/add-purchase-order/add-purchase-order.component';
import { ViewInvoiceComponent } from './components/Purchases/view-invoice/view-invoice.component';
import { InvoiceListComponent } from './components/Purchases/invoice-list/invoice-list.component';
import { StockDetailsComponent } from './components/Stock/stock-details/stock-details.component';
// import { TripDetailsComponent } from './components/route/trip-details/trip-details.component';

const routes: Routes = [
 {path: '', component:NavbarComponent,
 children:[
  {path: 'home', component: DashboardComponent},
  {path: '', component:HomeComponent},
  {path: 'settings', component: SettingsComponent},

  {path: 'settings/product/category', component: CategoryManagementComponent},
  {path: 'settings/product/brand', component: BrandManagementComponent},
  {path: 'settings/product/unit', component: UnitManagementComponent},
  {path: 'settings/product/addproduct', component: AddProductComponent},

  {path: 'route', component: RouteManagementComponent},
  {path: 'settings/vendor', component: VendorManagementComponent},
  {path: 'settings/tax', component: TaxManagementComponent},
  {path: 'settings/user/addrole', component: RoleManagementComponent},
  {path: 'settings/warehouse', component: WarehouseManagementComponent},
  {path: 'settings/user/adduser', component: AddUserComponent},

  {path:'test', component: TestReportComponent},
  {path:'test/print', component: TestPrintComponent},

  //customer
  {path: 'settings/customer/customercategory', component: CustomerCategoryComponent},
  {path: 'settings/customer/customergrade', component: CustomerGradeComponent},
  {path: 'settings/customer/customermanage', component: AddCustomerComponent},

  //route
  {path: 'settings/route/collectiondays', component: AddRouteDaysComponent},
  {path: 'settings/route/routedetails', component: AddRouteDetailsComponent},
  {path: 'settings/route/addroute', component: AddRouteComponent},

  {path: 'settings/trip/addtrip', component: AddTripComponent},
  {path: 'settings/route/addtrip/tripdetails/:id', component: ViewTripDetailsComponent},
  {path: 'settings/route/addtrip/tripdetails/addmore/:id', component: AddMoreTripDetailsComponent},
  {path: 'settings/trip/deliverydays', component: TripDaysComponent},
  {path: 'settings/trip/vehicle', component: VehicleManagementComponent},

  //AutoGeneration
  {path: 'settings/autogeneration/invoicenumber', component: InvoiceNumberComponent},

  {path: 'sales/viewpicklist', component: PickListComponent},
  {path: 'sales/viewpicklist/details/:id', component: ViewPickListDetailsComponent},
  {path: 'sales/viewpicklist/view/picklistdetails/addmore/:id', component: AddProductsComponent},
  {path: 'sales/viewpicklist/view/picklistdetails/editdetails/:id', component: EditListDetailsComponent},
  {path: 'collection/route/view', component: ViewCollectionComponent},
  {path: 'sales/viewpicklist/triplist', component: ViewTripListComponent},
  {path: 'sales/viewpicklist/triplist/products/:id', component: ViewTripProuctListComponent},
  {path: 'sales/viewpicklist/triplist/products/view/:id/:routeid', component: TripProductDetailsComponent},
  {path: 'sales/viewpicklist/routemap', component: RouteMapComponent},

  {path :'purachases/purchaseorder', component: PurchaseOrderComponent},
  {path :'purachases/addpurchaseorder', component: AddPurchaseOrderComponent},
  {path :'purchases/purchaseorder/viewpurchaseorder/:id', component: ViewPurchaseOrderComponent},
  {path :'purchases/purchaseorder/viewpurchaseorder/addmore/:id', component: AddMoreProductsComponent},

  {path :'purachases/purchaseentry', component: ViewPurchaseEntryComponent},
  {path :'purachases/addpurchaseentry', component: AddPurchaseEntryComponent},
  {path :'purachases/purchaseentry/:id', component: AddPurchaseEntryComponent},
  {path :'purchases/purchaseentry/viewpurchaseentry', component: ViewPurchaseEntryComponent},
  {path :'purchases/purchaseentry/viewpurchaseentry/viewlist/:id', component: ViewPurchaseListComponent},
  {path :'purchases/purchaseentry/viewpurchaseentry/viewlist/addmore/:id', component: AddMoreProductsComponent},

  {path :'purachases/invoices', component: InvoiceListComponent},
  {path :'purachases/invoices', component: ViewInvoiceComponent},
  {path :'inventory/viewstock', component: StockComponent},
  {path :'inventrory/viewstock/detail/:id', component: StockDetailsComponent},

  {path: 'settings/test', component: TestComponent}
 ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
