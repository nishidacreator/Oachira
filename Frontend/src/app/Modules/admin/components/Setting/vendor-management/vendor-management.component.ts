import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin.service';
import { Vendor } from '../../../models/vendor';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss']
})
export class VendorManagementComponent implements OnDestroy{

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    private dialog: MatDialog){}

  ngOnDestroy(): void {
    this.vendorSubscriptions?.unsubscribe();
  }

  vendorForm = this.fb.group({

    vendorName: ['', Validators.required],
    address1: ['', Validators.required],
    address2: ['', Validators.required],
    state: ['', Validators.required],
    vendorPhoneNumber: ['', Validators.required],
    gstNo: ['', Validators.required],

  });

  displayedColumns : string[] = ['id','vendorName','address1','address2','state','vendorPhoneNumber','gstNo','manage']

  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
  }

  onSubmit(){
    this.adminService.addVendor(this.vendorForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Vendor added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
      
    }))
  }

  vendors : Vendor[] = [];
  vendorSubscriptions? : Subscription;
  getVendor(){
    return this.adminService.getVendor().subscribe((res)=>{
      this.vendors = res;
      this.filtered = this.vendors
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.vendors.filter(element =>
      element.vendorName.toLowerCase().includes(filterValue) 
      // && element.code.toLowerCase().includes(filterValue)
      // && element.barCode.toLowerCase().includes(filterValue)
    );
  }

  deleteVendor(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteVendor(id).subscribe((res)=>{
          this.getVendor()
          this._snackBar.open("User deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

    this.getVendor()
  }

  isEdit = false;
  userId : any;
  editVendor(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let vendor: any= this.vendors.find(x =>x.id == id)
    
    //Populate the object by the ID
    let vendorName = vendor.vendorName.toString();
    let address1 = vendor.address1.toString();
    let address2 = vendor.address2.toString();
    let state = vendor.state.toString();
    let vendorPhoneNumber = vendor.vendorPhoneNumber.toString();
    let gstNo = vendor.gstNo.toString();
    
    this.vendorForm.patchValue({
      vendorName : vendorName,
      address1 : address1,
      address2 : address2,
      state : state,
      vendorPhoneNumber : vendorPhoneNumber,
      gstNo : gstNo
    })
    this.userId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      vendorName : this.vendorForm.get('vendorName')?.value,
      address1 : this.vendorForm.get('address1')?.value,
      address2 : this.vendorForm.get('address2')?.value,
      state : this.vendorForm.get('state')?.value,
      vendorPhoneNumber : this.vendorForm.get('vendorPhoneNumber')?.value,
      gstNo : this.vendorForm.get('gstNo')?.value
    }
    
    this.adminService.updateVendor(this.userId, data).subscribe((res)=>{
      this._snackBar.open("Vendor updated successfully...","" ,{duration:3000})
      this.getVendor();
      this.clearControls();
    },(error=>{
      alert(error.message)
    }))
  }

  clearControls(){
    this.getVendor()
    this.vendorForm.reset()
    this.vendorForm.setErrors(null)
    Object.keys(this.vendorForm.controls).forEach(key=>{this.vendorForm.get(key)?.setErrors(null)})
  }

}
