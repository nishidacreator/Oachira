import { MaterialModule } from '../shared-components/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/Setting/settings/settings.component';
import { BranchManagementComponent } from './components/Setting/branch-management/branch-management.component';
import { BrandManagementComponent } from './components/Setting/products/brand-management/brand-management.component';
import { CategoryManagementComponent } from './components/Setting/products/category-management/category-management.component';
import { CurrencyManagementComponent } from './components/Setting/currency-management/currency-management.component';
import { CustomerManagementComponent } from './components/Setting/customers/customer-management/customer-management.component';
import { ManufacturerManagementComponent } from './components/Setting/manufacturer-management/manufacturer-management.component';
import { ProductManagementComponent } from './components/Setting/products/product-management/product-management.component';
import { RoleManagementComponent } from './components/Setting/users/role-management/role-management.component';
import { RouteManagementComponent } from './components/Setting/route/route-management/route-management.component';
import { UnitManagementComponent } from './components/Setting/products/unit-management/unit-management.component';
import { UserManagementComponent } from './components/Setting/users/user-management/user-management.component';
import { VehicleManagementComponent } from './components/Setting/trip/vehicle-management/vehicle-management.component';
import { VendorManagementComponent } from './components/Setting/vendor-management/vendor-management.component';
import { WarehouseManagementComponent } from './components/Setting/warehouse-management/warehouse-management.component';
import { TaxManagementComponent } from './components/Setting/tax-management/tax-management.component';
import { CustomerCategoryComponent } from './components/Setting/customers/customer-category/customer-category.component';
import { CustomerGradeComponent } from './components/Setting/customers/customer-grade/customer-grade.component';
import { AddCustomerComponent } from './components/Setting/customers/add-customer/add-customer.component';
import { AddPurchaseEntryComponent } from './components/Purchases/add--purchase-entry/add-purchase-entry.component';
import { AddRouteDaysComponent } from './components/Setting/route/route/add-route-days/add-route-days.component';
import { AddRouteDetailsComponent } from './components/Setting/route/route/add-route-details/add-route-details.component';
import { AddRouteComponent } from './components/Setting/route/route/add-route/add-route.component';
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
import { AddProductComponent } from './components/Setting/products/add-product/add-product.component';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
import { BoldReportDesignerModule  } from '@boldreports/angular-reporting-components';

// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
// Report Designer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-designer.min';
// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
import { TripManagementComponent } from './components/Setting/trip/trip-management/trip-management.component';
import { InvoiceNumberComponent } from './components/Setting/prefixes/invoice-number/invoice-number.component';
import { ViewPurchaseEntryComponent } from './components/Purchases/view-purchase-entry/view-purchase-entry.component';
import { ViewPurchaseListComponent } from './components/Purchases/view-purchase-list/view-purchase-list.component';
import { AddMoreProductsComponent } from './components/Purchases/add-more-products/add-more-products.component';
import { PurchaseOrderComponent } from './components/Purchases/purchase-order/purchase-order.component';
import { ViewPurchaseOrderComponent } from './components/Purchases/view-purchase-order/view-purchase-order.component';
import { AddPurchaseOrderComponent } from './components/Purchases/add-purchase-order/add-purchase-order.component';
import { ViewInvoiceComponent } from './components/Purchases/view-invoice/view-invoice.component';
import { StockComponent } from './components/Stock/stock/stock.component';
import { StockDetailsComponent } from './components/Stock/stock-details/stock-details.component';
import { EditPurchaseEntryDetailsComponent } from './components/Purchases/edit-purchase-entry-details/edit-purchase-entry-details.component';
import { AddVehicleComponent } from './components/Setting/trip/add-vehicle/add-vehicle.component';
import { ViewContactsComponent } from './components/Setting/customers/view-contacts/view-contacts.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    AddProductComponent,
    TestComponent,
    RouteMapComponent,
    TripProductDetailsComponent,
    ViewTripProuctListComponent,
    ViewTripListComponent,
    TripDaysComponent,
    AddMoreTripDetailsComponent,
    ViewTripDetailsComponent,
    AddTripComponent,
    ViewCollectionComponent,
    EditListDetailsComponent,
    AddProductsComponent,
    ViewPickListDetailsComponent,
    PickListComponent,
    AddUserComponent,
    AddRouteComponent,
    AddRouteDetailsComponent,
    AddRouteDaysComponent,
    AddPurchaseEntryComponent,
    AddCustomerComponent,
    CustomerGradeComponent,
    CustomerCategoryComponent,
    TaxManagementComponent,
    WarehouseManagementComponent,
    VendorManagementComponent,
    VehicleManagementComponent,
    UserManagementComponent,
    UnitManagementComponent,
    RouteManagementComponent,
    RoleManagementComponent,
    ProductManagementComponent,
    ManufacturerManagementComponent,
    CustomerManagementComponent,
    CurrencyManagementComponent,
    CategoryManagementComponent,
    BrandManagementComponent,
    BranchManagementComponent,
    TripManagementComponent,
    InvoiceNumberComponent,
    ViewPurchaseEntryComponent,
    ViewPurchaseListComponent,
    AddMoreProductsComponent,
    PurchaseOrderComponent,
    ViewPurchaseOrderComponent,
    AddPurchaseOrderComponent,
    ViewInvoiceComponent,
    StockComponent,
    StockDetailsComponent,
    EditPurchaseEntryDetailsComponent,
    AddVehicleComponent,
    ViewContactsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    MaterialModule,
    BoldReportViewerModule,
    BoldReportDesignerModule
  ]
})
export class AdminModule { }
