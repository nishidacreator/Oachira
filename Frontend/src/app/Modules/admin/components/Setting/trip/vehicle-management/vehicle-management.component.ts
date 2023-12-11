import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Vehicle } from '../../../../models/vehicle/vehicle';
import { VehicleType } from 'src/app/Modules/admin/models/vehicle/vehicle-type';
import { Branch } from 'src/app/Modules/admin/models/settings/branch';
import { BranchManagementComponent } from '../../branch/branch-management/branch-management.component';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent {

  branchId!: number;
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,  @Optional() public dialogRef: MatDialogRef<VehicleManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      this.branchId = user.branch
    }

  ngOnDestroy() {
    this.vehicleSubscription?.unsubscribe()
    this.branchSubscription.unsubscribe()
  }

  vehicleForm = this.fb.group({
    registrationNumber: ['', Validators.required],
    vehicleTypeId: ['', Validators.required],
    taxExpiry : ['', Validators.required],
    insuranceExpiry : ['', Validators.required],
    polutionExpiry : ['', Validators.required],
    capacity : ['', Validators.required],
    fitnessExpiry : ['', Validators.required],
    permitExpiry : ['', Validators.required],
    branchId : [0],
    vehicle_image : [null]
  });

  displayedColumns : string[] = ['id','registrationNumber','vehicleType','taxExpiry','insuranceExpiry','polutionExpiry', 'fitnessExpiry', 'permitExpiry' ,'capacity','vehicleImage','manage']

  addStatus!: string
  ngOnInit(): void {
    this.vehicleForm.get('branchId')?.setValue(this.branchId)

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    } 

    this.vehicleSubscription = this.getVehicle()
    this.getVehicleType()
    this.getBranch()
  }

  vehicles =[
    {name: '4 Wheeler'},
    {name: '3 Wheeler'},
  ];

  vehicles$!: Observable<VehicleType[]>
  getVehicleType(){
    this.vehicles$ = this.adminService.getVehicleType();
  }

  branches: Branch[] = [];
  branchSubscription!: Subscription;
  getBranch(){
    this.branchSubscription = this.adminService.getBranch().subscribe(b => {
      this.branches = b
    })
  }

  onSubmit(){
    const formData = new FormData();
    // formData.append("vehicle_image", this.file as Blob, this.file?.name)
    // this._snackBar.open("Image Uploaded","" ,{duration:3000})
    this.adminService.addVehicle(this.vehicleForm.getRawValue()).subscribe((res)=>{
      console.log(res);
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
      this.filtered = this.vehicle
    })
  }   

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.vehicle.filter(element =>
      element.registrationNumber.toLowerCase().includes(filterValue) 
      // || element.id.toString().includes(filterValue)
      // || element.status.toString().includes(filterValue)
    );
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
    console.log(vehi);
    //Populate the object by the ID
    let registrationNumber = vehi.registrationNumber.toString();
    let vehicleTypeId = vehi.vehicleTypeId;
    let taxExpiry = vehi.taxExpiry.toString();
    let insuranceExpiry = vehi.insuranceExpiry.toString();
    let polutionExpiry = vehi.polutionExpiry.toString();
    let fitnessExpiry = vehi.fitnessExpiry.toString();
    let permitExpiry = vehi.permitExpiry.toString();
    let branchId = vehi.branchId
    let capacity = vehi.capacity.toString();
    
    this.vehicleForm.patchValue({
      registrationNumber : registrationNumber,
      vehicleTypeId : vehicleTypeId,
      taxExpiry : taxExpiry,
      insuranceExpiry : insuranceExpiry,
      polutionExpiry : polutionExpiry,
      fitnessExpiry : fitnessExpiry,
      permitExpiry : permitExpiry,
      branchId : branchId,
      capacity : capacity
    })
    this.vehicleId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      registrationNumber : this.vehicleForm.get('registrationNumber')?.value,
      vehicleTypeId : this.vehicleForm.get('vehicleTypeId')?.value,
      taxExpiry : this.vehicleForm.get('taxExpiry')?.value,
      insuranceExpiry : this.vehicleForm.get('insuranceExpiry')?.value,
      polutionExpiry : this.vehicleForm.get('polutionExpiry')?.value,
      capacity : this.vehicleForm.get('capacity')?.value
    }
    
    this.adminService.updateVehicle(this.vehicleId, data).subscribe((res)=>{
      this._snackBar.open("Vehicle updated successfully...","" ,{duration:3000})
      this.getVehicle();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  file:File | null = null;
  url!: any;
  imageUrl!: string;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.file = event.target.files[0] as File;
      if (this.file) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
  
        reader.readAsDataURL(this.file);
      }
      console.log(this.file)

      let fileType = this.file? this.file.type : '';
      // this.productCategoryForm.get('category_image')?.setValue(this.file)
  
      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }   
      // }
      // else {
      //   window.alert('Please select correct image format');
      // } 
    }
  }

  showImagePopup= false;

  showPopup() {
    this.showImagePopup = true;
  }

  hidePopup() {
    this.showImagePopup = false;
  }

  addBranch(){
    const dialogRef = this.dialog.open(BranchManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranch()
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
