import { Router } from '@angular/router';
import { VendorManagementComponent } from './../vendor-management/vendor-management.component';
import { WarehouseManagementComponent } from './../warehouse-management/warehouse-management.component';
import { BrandManagementComponent } from '../products/brand-management/brand-management.component';
import { ManufacturerManagementComponent } from './../manufacturer-management/manufacturer-management.component';
import { CurrencyManagementComponent } from './../currency-management/currency-management.component';
import { CustomerManagementComponent } from '../customers/customer-management/customer-management.component';
import { UnitManagementComponent } from '../products/unit-management/unit-management.component';
import { ProductManagementComponent } from '../products/product-management/product-management.component';
import { CategoryManagementComponent } from '../products/category-management/category-management.component';
import { RoleManagementComponent } from '../users/role-management/role-management.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementComponent } from '../users/user-management/user-management.component';
import { VehicleManagementComponent } from '../trip/vehicle-management/vehicle-management.component';
import { RouteManagementComponent } from '../route/route-management/route-management.component';
import { TripManagementComponent } from '../trip/trip-management/trip-management.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(public dialog: MatDialog, private router: Router) {}

  manageUser(){
    const dialogRef = this.dialog.open(UserManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  manageRole(){
    this.router.navigateByUrl('admin/settings/role/addrole')
  }

  

  manageProducts(){
    const dialogRef = this.dialog.open(ProductManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }


  manageCustomers(){
    const dialogRef = this.dialog.open(CustomerManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  manageVendors(){
    this.router.navigateByUrl('/admin/settings/vendor')
  }

  manageCurrency(){
    const dialogRef = this.dialog.open(CurrencyManagementComponent, {
      height: '500px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  manageManufacturers(){
    const dialogRef = this.dialog.open(ManufacturerManagementComponent, {
      height: '230px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  manageTax(){
    this.router.navigateByUrl('/admin/settings/tax')
  }

  manageWarehouse(){
    this.router.navigateByUrl('/admin/settings/warehouse')
  }

  manageRoute(){
    const dialogRef = this.dialog.open(RouteManagementComponent, {
      height: '400px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  manageTrip(){
    this.router.navigateByUrl('admin/settings/trip/addtrip')
    // this.dialogRef.close();
  }

}
