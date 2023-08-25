import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { RouteManagementComponent } from '../../route/route-management/route-management.component';
import { Route } from 'src/app/Modules/admin/models/route/route';
import { DeliveryDays } from 'src/app/Modules/admin/models/route/deliveryDays';

@Component({
  selector: 'app-trip-days',
  templateUrl: './trip-days.component.html',
  styleUrls: ['./trip-days.component.scss']
})
export class TripDaysComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router){}

  ngOnDestroy(){
    this.daysSubscription?.unsubscribe()
  }

  deliveryDaysForm = this.fb.group({

    routeId: ['', Validators.required],
    weekDays : ['', Validators.required],
  });

  displayedColumns : string[] = ['id','routeId', 'weekDay','manage']

  ngOnInit(): void {
    this.getRoute()

    this.daysSubscription = this.getTripDays()
  }

  route$! : Observable<Route[]> ;
  getRoute(){
    this.route$ = this.adminService.getRoute()
  } 

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN', index: 0},
    {name: 'Monday', abbreviation: 'MON', index: 1},
    {name: 'Tuesday', abbreviation: 'TUE', index: 2},
    {name: 'Wednesday', abbreviation: 'WED', index: 3},
    {name: 'Thursday', abbreviation: 'THU', index: 4},
    {name: 'Friday', abbreviation: 'FRI', index: 5},
    {name: 'Saturday', abbreviation: 'SAT', index: 6},
  ];

  homeClick(){
    const dialogRef = this.dialog.open(RouteManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  onSubmit(){
    this.adminService.addDeliveryDays(this.deliveryDaysForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Trip Days added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getTripDays()
    this.deliveryDaysForm.reset()
    this.deliveryDaysForm.setErrors(null)
    Object.keys(this.deliveryDaysForm.controls).forEach(key=>{this.deliveryDaysForm.get(key)?.setErrors(null)})
  }

  days : DeliveryDays[] = [];
  daysSubscription? : Subscription
  getTripDays(){
    return this.adminService.getDeliveryDays().subscribe((res)=>{
      this.days = res
    })
  }  

  deleteDays(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteDeliveryDays(id).subscribe((res)=>{
          this.getTripDays()
          this._snackBar.open("Trip Days deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  dayId : any;
  isDisabled = true;
  editDays(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let day: any = this.days.find(x =>x.id == id)
    
    //Populate the object by the ID
    let routeId = day.routeId;
    let weekDays = day.weekDay.toString().split(",");
    
    this.deliveryDaysForm.patchValue({
      routeId : routeId,
      weekDays : weekDays
    })
    this.dayId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeId : this.deliveryDaysForm.get('routeId')?.value,
      weekDays : this.deliveryDaysForm.get('weekDays')?.value,
    }
    
    this.adminService.updateDeliveryDays(this.dayId, data).subscribe((res)=>{
      this._snackBar.open("Trip Days updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addRoute(){
    this.router.navigateByUrl('admin/settings/route/addroute')
  }
}



