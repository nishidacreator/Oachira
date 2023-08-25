import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { VehicleType } from 'src/app/Modules/admin/models/vehicle/vehicle-type';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.vehicleTypeSubscription?.unsubscribe()
  }

  addVehicleType = this.fb.group({
    typeName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','vehicleType']

  ngOnInit(): void {
    this.vehicleTypeSubscription = this.getVehicle()
  }


  onSubmit(){
    this.adminService.addVehicleType(this.addVehicleType.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Vehicle added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getVehicle()
    this.addVehicleType.reset()
    this.addVehicleType.setErrors(null)
    Object.keys(this.addVehicleType.controls).forEach(key=>{this.addVehicleType.get(key)?.setErrors(null)})
  }

  vehicle: VehicleType[] = [];
  vehicleTypeSubscription? : Subscription
  getVehicle(){
    return this.adminService.getVehicleType().subscribe((res)=>{
      this.vehicle = res
    })
  }   

  deleteVehicle(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
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
    let typeName = vehi.typeName.toString();
    
    this.addVehicleType.patchValue({
      typeName : typeName,
    })
    this.vehicleId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      vehicleType : this.addVehicleType.get('vehicleType')?.value,
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
