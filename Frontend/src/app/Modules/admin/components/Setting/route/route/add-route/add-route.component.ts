import { DeliveryDays } from 'src/app/Modules/admin/models/route/deliveryDays';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../../admin.service';
import { Vehicle } from '../../../../../models/vehicle/vehicle';
import { User } from 'src/app/Modules/auth/models/user';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { Route } from '../../../../../models/route/route';
import { RouteManagementComponent } from '../../route-management/route-management.component';
import { Router } from '@angular/router';
import { BranchManagementComponent } from '../../../branch/branch-management/branch-management.component';
import { Branch } from 'src/app/Modules/admin/models/settings/branch';
import { AddUserComponent } from '../../../users/add-user/add-user.component';
import { VehicleManagementComponent } from '../../../trip/vehicle-management/vehicle-management.component';
import { AddRouteDaysComponent } from '../add-route-days/add-route-days.component';
import { TripDaysComponent } from '../../../trip/trip-days/trip-days.component';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {

  branchId!: number
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService, private router: Router,
    @Optional() public dialogRef: MatDialogRef<AddRouteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      this.branchId = user.branch
    }


  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    this.userSubscription.unsubscribe()
    this.branchSubscription.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
  }

  routeForm = this.fb.group({
    routeName: ['', Validators.required],
    vehicleId : ['', Validators.required],
    driverId : ['', Validators.required],
    salesManId :['',Validators.required],
    salesExecutiveId : ['', Validators.required],
    branchId : [0]
  });

  displayedColumns : string[] = ['id','routeName', 'vehicleId','vehicleDriverId','salesManId', 'salesExecutiveId','manage']

  addStatus!: string;
  ngOnInit(): void {
    this.routeForm.get('branchId')?.setValue(this.branchId)

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    } 

    this.getVehicle(this.branchId)
    this.getDriver(this.branchId)
    this.getRoute()
    this.getBranch()
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

  vehicleSub!: Subscription;
  vehicles: Vehicle[] = [];
  getVehicle(id:number){
    this.vehicleSub = this.adminService.getVehicle().subscribe(result => {
      this.vehicles = result.filter(vehicle => vehicle.branchId === id)
    })
  }

  driver : User[] = [];
  salesMan : User[] = [];
  salesExecutive : User[] = [];
  userSubscription! : Subscription;
  getDriver(id: number){
    this.userSubscription = this.authService.getUser().subscribe((res)=>{
      this.driver = res.filter(x => x.role.roleName.toLowerCase() == 'driver' && x.branchId === id);
      this.salesMan = res.filter(x => x.role.roleName.toLowerCase() == 'salesman'&& x.branchId === id);
      this.salesExecutive = res.filter(x=>x.role.roleName.toLowerCase() == 'salesexecutive'&& x.branchId === id);
    })
  }

  branches: Branch[] = [];
  branchSubscription!: Subscription;
  getBranch(){
    this.branchSubscription = this.adminService.getBranch().subscribe(b => {
      this.branches = b
    })
  }

  byBranch(id: number){
    this.getVehicle(id);
    this.getDriver(id);
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
    this.routeSubscription = this.adminService.getRoute().subscribe((res)=>{
      this.routes = res
      this.filtered = this.routes
      console.log(this.routes)
    })
  }  

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.routes.filter(element =>
      element.routeName.toLowerCase().includes(filterValue) 
      // || element.id.toString().includes(filterValue)
      // || element.status.toString().includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteRoute(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteRoute(id).subscribe((res)=>{
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

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeName : this.routeForm.get('routeName')?.value,
      vehicleId : this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId : this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
    }
    
    this.edit = this.adminService.updateRoute(this.routeId, data).subscribe((res)=>{
      this._snackBar.open("Route updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addUser(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDriver(this.branchId)
    })
  }

  addVehicle(){
    const dialogRef = this.dialog.open(VehicleManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getVehicle(this.branchId)
    })
  }

  addBranch(){
    const dialogRef = this.dialog.open(BranchManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranch()
    })
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
  submit!: Subscription;
  onSubmit(){
    let data ={
      routeName: this.routeForm.get('routeName')?.value,
      vehicleId :this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId :this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
      branchId : this.routeForm.get('branchId')?.value,
      collectionDays : this.collectionDays
    }

    this.adminService.addRoute(data).subscribe((res)=>{
      this.result = res
      this.submitted = true
      this.clearControls()
    })
  }

  collectionDays: any[] =[];
  addCollectionDays(){
    const dialogRef = this.dialog.open(AddRouteDaysComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result != undefined){
        let collectionDays = result.days
        for(let i = 0; i < collectionDays.length; i++){
          this.collectionDays[i] = {
            weekDays : collectionDays[i]
          }
        }
      }
    })
  }

  addDeliveryDays(){
    const dialogRef = this.dialog.open(TripDaysComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.collectionDays = result.days
      console.log(this.collectionDays)
    })
  }

  addDetails(){
    if(this.result){
      let len = this.routes.length;
      let lenght = len + 1;
      console.log(lenght)
      this.router.navigateByUrl('/admin/settings/route/routedetails/'+ lenght)
    }
    else{
      this.router.navigateByUrl('/admin/settings/route/routedetails')
    }
  }
}


