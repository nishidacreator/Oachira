import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../../admin.service';
import { Route } from '../../../../../models/route/route';
import { CollectionDays } from '../../../../../models/route/collectionDays';
import { RouteManagementComponent } from '../../route-management/route-management.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-route-days',
  templateUrl: './add-route-days.component.html',
  styleUrls: ['./add-route-days.component.scss']
})
export class AddRouteDaysComponent implements OnInit {

  id: number = 0;
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router, private route: ActivatedRoute){
      this.id = route.snapshot.params['id'];
    }

  ngOnDestroy(){
    this.daysSubscription?.unsubscribe()
    if(this.routeSub){
      this.routeSub.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
    if(this.edit){
      this.edit.unsubscribe()
    }
    if(this.submit){
      this.submit.unsubscribe()
    }
  }

  routeDaysForm = this.fb.group({
    routeId: ['', Validators.required],
    weekDays : ['', Validators.required],
  });

  displayedColumns : string[] = ['id','routeId', 'weekDay','manage']

  ngOnInit(): void {
    if(this.id != undefined){
      this.getRouteById()
    }
    this.getRoute()
    this.getRouteDays()
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

  routeSub!: Subscription;
  getRouteById(){
    this.routeSub = this.adminService.getRouteById(this.id).subscribe(result => {
      let routeName: any = result.id;

      this.routeDaysForm.patchValue({
        routeId: routeName
      })
    })
  }

  submit!: Subscription;
  onSubmit(){
    this.submit = this.adminService.addCollectionDays(this.routeDaysForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getRouteDays()
    this.routeDaysForm.reset()
    this.routeDaysForm.setErrors(null)
    Object.keys(this.routeDaysForm.controls).forEach(key=>{this.routeDaysForm.get(key)?.setErrors(null)})
  }

  days : CollectionDays[] = [];
  daysSubscription!: Subscription
  getRouteDays(){
    this.daysSubscription = this.adminService.getCollectionDays().subscribe((res)=>{
      this.days = res
    })
  }  

  delete!: Subscription;
  deleteDays(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteCollectionDays(id).subscribe((res)=>{
          this.getRouteDays()
          this._snackBar.open("Route Days deleted successfully...","" ,{duration:3000})
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
    
    this.routeDaysForm.patchValue({
      routeId : routeId,
      weekDays : weekDays
    })
    this.dayId = id;
  }

  edit!: Subscription
  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeId : this.routeDaysForm.get('routeId')?.value,
      weekDays : this.routeDaysForm.get('weekDays')?.value,
    }
    
    this.edit = this.adminService.updateCollectionDays(this.dayId, data).subscribe((res)=>{
      this._snackBar.open("Route Days updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addRoute(){
    this.router.navigateByUrl('admin/settings/route/addroute')
  }
}


