import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService, private router: Router){}

  ngOnDestroy(){
    this.routeSubscription?.unsubscribe()
    this.userSubscription.unsubscribe()
    this.submitSubscription.unsubscribe()
    this.deleteSubscription.unsubscribe()
    this.updateSubscription.unsubscribe()
  }

  routeForm = this.fb.group({
    routeName: ['', Validators.required],
    vehicleId : ['', Validators.required],
    driverId : ['', Validators.required],
    salesManId :['',Validators.required],
    salesExecutiveId : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','routeName', 'vehicleId', 'manage']

  ngOnInit(): void {
    this.getVehicle()
    this.userSubscription = this.getDriver()
    // this.routeSubscription = this.getRoute()
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
      this.driver = res.filter(x => x.role.roleName == 'Driver');
      this.salesMan = res.filter(x => x.role.roleName == 'Salesman');
      this.salesExecutive = res.filter(x=>x.role.roleName == 'SalesExecutive')
    })
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.submitSubscription = this.adminService.addRoute(this.routeForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Route added successfully...","" ,{duration:3000})
      console.log("added successfully")
      this.getRoute()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
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
      this.filtered = this.routes
    })
  } 
  
  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.routes.filter(element =>
      element.routeName.toLowerCase().includes(filterValue) 
      // && element.code.toLowerCase().includes(filterValue)
      // && element.barCode.toLowerCase().includes(filterValue)
    );
  }

  private deleteSubscription : Subscription = new Subscription();
  deleteRoute(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSubscription = this.adminService.deleteRoute(id).subscribe((res)=>{
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

  private updateSubscription : Subscription = new Subscription();
  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeName : this.routeForm.get('routeName')?.value,
      vehicleId : this.routeForm.get('vehicleId')?.value,
      driverId : this.routeForm.get('driverId')?.value,
      salesManId : this.routeForm.get('salesManId')?.value,
      salesExecutiveId : this.routeForm.get('salesExecutiveId')?.value,
    }
    
    this.updateSubscription = this.adminService.updateRoute(this.routeId, data).subscribe((res)=>{
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
}


