import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouteManagementComponent } from '../../route/route-management/route-management.component';

@Component({
  selector: 'app-trip-management',
  templateUrl: './trip-management.component.html',
  styleUrls: ['./trip-management.component.scss']
})
export class TripManagementComponent implements OnInit {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RouteManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){}


  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings') 
    this.dialogRef.close();
  }

  manageVehicle(){
    this.router.navigateByUrl('admin/settings/trip/vehicle');
    this.dialogRef.close();
  }

  manageTripDays(){
    this.router.navigateByUrl('admin/settings/trip/deliverydays')
    this.dialogRef.close();
  }

  manageTrip(){
    this.router.navigateByUrl('admin/settings/trip/addtrip')
    this.dialogRef.close();
  }
}
