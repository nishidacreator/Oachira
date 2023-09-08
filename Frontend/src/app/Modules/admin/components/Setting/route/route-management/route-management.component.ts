import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerManagementComponent } from '../../customers/customer-management/customer-management.component';

@Component({
  selector: 'app-route-management',
  templateUrl: './route-management.component.html',
  styleUrls: ['./route-management.component.scss']
})
export class RouteManagementComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RouteManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){}


  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings') 
    this.dialogRef.close();
  }

  manageRouteDays(){
    this.router.navigateByUrl('admin/settings/route/collectiondays') 
    this.dialogRef.close();
  }

  manageRouteDetails(){
    this.router.navigateByUrl('admin/settings/route/routedetails')
    this.dialogRef.close();
  }

  addRoute(){
    this.router.navigateByUrl('admin/settings/route/addroute')
    this.dialogRef.close();
  }

  manageTripDays(){
    this.router.navigateByUrl('admin/settings/route/deliverydays')
    this.dialogRef.close();
  }

  manageTrip(){
    this.router.navigateByUrl('admin/settings/route/addtrip')
    this.dialogRef.close();
  }
}
