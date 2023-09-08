import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../../admin.service';
import { Customer } from '../../../../../models/customer/customer';
import { Route } from '../../../../../models/route/route';
import { RouteDetails } from '../../../../../models/route/routeDetails';
import { RouteManagementComponent } from '../../route-management/route-management.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-route-details',
  templateUrl: './add-route-details.component.html',
  styleUrls: ['./add-route-details.component.scss']
})
export class AddRouteDetailsComponent implements OnInit {

  id: number = 0;
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
      this.id = route.snapshot.params['id'];
    }

  ngOnDestroy(){
    this.customerSubscription?.unsubscribe()
    this.detailsSubscription?.unsubscribe()
    this.submitSubscription.unsubscribe()
    this.homeSubscription.unsubscribe()
  }

  routeDetailsForm = this.fb.group({
    routeId: ['', Validators.required],
    customerId : ['', Validators.required],
    routeIndex : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','routeId', 'customerId', 'routeIndex', 'manage']

  ngOnInit(): void {
    this.getRoute()
    if(this.id != undefined){
      this.getRouteById()
    }

    this.customerSubscription = this.getCustomers()
    this.detailsSubscription = this.getDetails()
  }

  route$! : Observable<Route[]> ;
  getRoute(){
    this.route$ = this.adminService.getRoute()
  } 

  getRouteById(){
    this.adminService.getRouteById(this.id).subscribe(result => {
      let routeName: any = result.id;

      this.routeDetailsForm.patchValue({
        routeId: routeName
      })
    })
  }


  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.submitSubscription = this.adminService.addRouteDetails(this.routeDetailsForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Route added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  private homeSubscription : Subscription = new Subscription();
  homeClick(){
    const dialogRef = this.dialog.open(RouteManagementComponent, {
      height: '200px',
      width: '800px',
    });

    this.homeSubscription = dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  clearControls(){
    this.getDetails()
    this.routeDetailsForm.reset()
    this.routeDetailsForm.setErrors(null)
    Object.keys(this.routeDetailsForm.controls).forEach(key=>{this.routeDetailsForm.get(key)?.setErrors(null)})
  }

  customers : Customer[] = [];
  customerSubscription? : Subscription
  getCustomers(){
    return this.adminService.getCustomer().subscribe((res)=>{
      this.customers = res.filter(x=>x.customerCategory.categoryName.toLowerCase() === 'route')
    })
  }  

  routeDetails : RouteDetails[] = [];
  detailsSubscription? : Subscription
  getDetails(){
    return this.adminService.getRouteDetails().subscribe((res)=>{
      this.routeDetails = res
    })
  }  

  private deleteSubscription : Subscription = new Subscription();
  deleteDetails(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteRouteDetails(id).subscribe((res)=>{
          this.getDetails()
          this._snackBar.open("Route Details deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  detailsId : any;
  editDetails(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let details: any = this.routeDetails.find(x =>x.id == id)
    
    //Populate the object by the ID
    let routeId = details.routeId
    let customerId = details.customerId;
    let routeIndex = details.routeIndex;
    
    this.routeDetailsForm.patchValue({
      routeId : routeId,
      customerId : customerId,
      routeIndex : routeIndex,
    })
    this.detailsId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      routeId : this.routeDetailsForm.get('routeId')?.value,
      customerId : this.routeDetailsForm.get('customerId')?.value,
      routeIndex : this.routeDetailsForm.get('routeIndex')?.value,
    }
    
    this.adminService.updateRouteDetails(this.detailsId, data).subscribe((res)=>{
      this._snackBar.open("Route Details updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addCustomer(){
    this.router.navigateByUrl('admin/settings/customer/customermanage')
  }

  addRoute(){
    this.router.navigateByUrl('admin/settings/route/addroute')
  }
}


