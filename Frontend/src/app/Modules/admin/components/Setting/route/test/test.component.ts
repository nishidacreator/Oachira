import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { User } from 'src/app/Modules/admin/models/user';
import { Vehicle } from '../../../../models/vehicle/vehicle';
import { RouteManagementComponent } from '../route-management/route-management.component';
import { Route } from '../../../../models/route/route';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService, private router: Router){}

  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    this.userSubscription.unsubscribe()
  }

  routeForm = this.fb.group({
    routeName: ['', Validators.required],
    vehicleId : ['', Validators.required],
    driverId : ['', Validators.required],
    salesManId :['',Validators.required],
    salesExecutiveId : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','routeName', 'vehicleId','vehicleDriverId','salesManId','manage']

  ngOnInit(): void {
    this.getVehicle()
    this.userSubscription = this.getDriver()

    this.routeSubscription = this.getRoute()
  }

  homeClick(){
    const dialogRef = this.dialog.open(RouteManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  vehicle$! : Observable<Vehicle[]> ;
  getVehicle(){
    this.vehicle$ = this.adminService.getVehicle()
  }

  driver : User[] = [];
  salesMan : User[] = [];
  salesExecutive : User[] = [];
  userSubscription! : Subscription;
  getDriver(){
    return this.authService.getUser().subscribe((res)=>{
      this.driver = res.filter(x => x.role.roleName.toLowerCase() == 'driver');
      this.salesMan = res.filter(x => x.role.roleName.toLowerCase() == 'salesman');
      this.salesExecutive = res.filter(x=>x.role.roleName.toLowerCase() == 'salesexecutive')
    })
  }

  clearControls(){
    this.getRoute()
    this.routeForm.reset()
    this.routeForm.setErrors(null)
    Object.keys(this.routeForm.controls).forEach(key=>{this.routeForm.get(key)?.setErrors(null)})
  }

  routes : Route[] = [];
  routeSubscription? : Subscription
  getRoute(){
    return this.adminService.getRoute().subscribe((res)=>{
      this.routes = res
    })
  }  

  deleteRoute(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteRoute(id).subscribe((res)=>{
          this.getRoute()
          this._snackBar.open("Route deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  routeId : any;
  editRoute(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let route: any = this.routes.find(x =>x.id == id)
    
    //Populate the object by the ID
    let routeName = route.routeName.toString();
    let vehicleId = route.vehicleId;
    let driverId = route.driverId;
    let salesManId = route.salesManId;
    let salesExecutiveId = route.salesExecutiveId;
    
    this.routeForm.patchValue({
      routeName : routeName,
      vehicleId : vehicleId,
      driverId : driverId,
      salesManId : salesManId,
      salesExecutiveId : salesExecutiveId
    })
    this.routeId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeName : this.routeForm.get('routeName')?.value,
      vehicleId : this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId : this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
    }
    
    this.adminService.updateRoute(this.routeId, data).subscribe((res)=>{
      this._snackBar.open("Route updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addUser(){
    this.router.navigateByUrl('admin/settings/user/adduser')
  }

  addVehicle(){
    this.router.navigateByUrl('admin/settings/vehicle')
  }

  routeDaysForm = this.fb.group({
    weekDays : ['', Validators.required],
  });

  weekDays =[
    {name: 'Sunday', abbreviation: 'SUN', index: 0},
    {name: 'Monday', abbreviation: 'MON', index: 1},
    {name: 'Tuesday', abbreviation: 'TUE', index: 2},
    {name: 'Wednesday', abbreviation: 'WED', index: 3},
    {name: 'Thursday', abbreviation: 'THU', index: 4},
    {name: 'Friday', abbreviation: 'FRI', index: 5},
    {name: 'Saturday', abbreviation: 'SAT', index: 6},
  ];
  isDisabled = true;

  tripDaysForm = this.fb.group({
    weekDays : ['', Validators.required],
  });

  result : any
  submitted = false;
  onSubmit(){
    let data ={
      routeName: this.routeForm.get('routeName')?.value,
      vehicleId :this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId :this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value
    }

    this.adminService.addRoute(data).subscribe((res)=>{
      this.result = res
    })
    this.submitted = true
    this.clearControls()
  }

  addCollectionDays(){
    this.router.navigateByUrl('/admin/settings/route/collectiondays/'+ this.result.id)
  }

  addDeliveryDays(){
    this.router.navigateByUrl('/admin/settings/route/deliverydays')
  }

  addDetails(){
    this.router.navigateByUrl('/admin/settings/route/routedetails')
  }
}


