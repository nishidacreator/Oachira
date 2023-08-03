import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Vehicle } from '../../../../models/vehicle/vehicle';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.vehicleSubscription?.unsubscribe()
  }

  vehicleForm = this.fb.group({
    registrationNumber: ['', Validators.required],
    vehicleType: ['', Validators.required],
    taxExpiry : ['', Validators.required],
    insuranceExpiry : ['', Validators.required],
    polutionExpiry : ['', Validators.required],
    capacity : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','registrationNumber','vehicleType','taxExpiry','insuranceExpiry','polutionExpiry','capacity','manage']

  ngOnInit(): void {
    this.vehicleSubscription = this.getVehicle()
  }

  vehicles =[
    {name: '4 Wheeler'},
    {name: '3 Wheeler'},
  ];

  onSubmit(){
    this.adminService.addVehicle(this.vehicleForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Vehicle added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getVehicle()
    this.vehicleForm.reset()
    this.vehicleForm.setErrors(null)
    Object.keys(this.vehicleForm.controls).forEach(key=>{this.vehicleForm.get(key)?.setErrors(null)})
  }

  vehicle: Vehicle[] = [];
  vehicleSubscription? : Subscription
  getVehicle(){
    return this.adminService.getVehicle().subscribe((res)=>{
      this.vehicle = res
    })
  }   

  deleteVehicle(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteVehicle(id).subscribe((res)=>{
          this.getVehicle()
          this._snackBar.open("Vehicle deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  vehicleId : any;
  editVehicle(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let vehi: any= this.vehicle.find(x =>x.id == id)
    
    //Populate the object by the ID
    let registrationNumber = vehi.registrationNumber.toString();
    let vehicleType = vehi.vehicleType.toString();
    let taxExpiry = vehi.taxExpiry.toString();
    let insuranceExpiry = vehi.insuranceExpiry.toString();
    let polutionExpiry = vehi.polutionExpiry.toString();
    let capacity = vehi.capacity.toString();
    
    this.vehicleForm.patchValue({
      registrationNumber : registrationNumber,
      vehicleType : vehicleType,
      taxExpiry : taxExpiry,
      insuranceExpiry : insuranceExpiry,
      polutionExpiry : polutionExpiry,
      capacity : capacity
    })
    this.vehicleId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      registrationNumber : this.vehicleForm.get('registrationNumber')?.value,
      vehicleType : this.vehicleForm.get('vehicleType')?.value,
      taxExpiry : this.vehicleForm.get('taxExpiry')?.value,
      insuranceExpiry : this.vehicleForm.get('insuranceExpiry')?.value,
      polutionExpiry : this.vehicleForm.get('polutionExpiry')?.value,
      capacity : this.vehicleForm.get('capacity')?.value
    }
    
    this.adminService.updateVehicle(this.vehicleId, data).subscribe((res)=>{
      this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
      this.getVehicle();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

}
