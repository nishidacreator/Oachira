import { Tax } from '../../../models/tax';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tax-management',
  templateUrl: './tax-management.component.html',
  styleUrls: ['./tax-management.component.scss']
})
export class TaxManagementComponent implements OnInit,OnDestroy {
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.taxSubcription?.unsubscribe()
  }

  taxForm = this.fb.group({

    taxName: ['', Validators.required],
    igst: ['',[Validators.required, Validators.pattern("^()?[0-9]{1,2}$")]],
    cgst: ['',[Validators.pattern("^()?[0-9]{1,2}$")]],
    sgst: ['',[Validators.pattern("^()?[0-9]{1,2}$")]]
  });

  displayedColumns : string[] = ['id','taxName','igst','cgst','sgst','manage']

  ngOnInit(): void {
    this.taxSubcription = this.getTax();
  }

  sgst : any;
  cgst : any;
  gst : any;
  calculateGst(){
    let igst:any = (this.taxForm.getRawValue().igst)
    this.gst = igst/2
    this.sgst = igst/2
    this.cgst = igst/2
    this.taxForm.get('sgst')?.setValue(this.sgst)
    this.taxForm.get('cgst')?.setValue(this.cgst)
  }

  onSubmit(){   
    this.adminService.addTax(this.taxForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Tax added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getTax()
    this.taxForm.reset()
    this.taxForm.setErrors(null)
    Object.keys(this.taxForm.controls).forEach(key=>{this.taxForm.get(key)?.setErrors(null)})
  }

  tax: Tax[] = [];
  taxSubcription? : Subscription;
  getTax(){
    return this.adminService.getTax().subscribe((res)=>{
      this.tax = res
    })
  }   

  deleteTax(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteTax(id).subscribe((res)=>{
          this.getTax()
          this._snackBar.open("Tax deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  taxId : any;
  editTax(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let tax: any= this.tax.find(x =>x.id == id)
    
    //Populate the object by the ID
    let taxName = tax.taxName.toString()
    let igst = tax.igst
    let cgst = tax.cgst
    let sgst = tax.sgst
    
    this.taxForm.patchValue({
      taxName : taxName,
      igst : igst,
      cgst : cgst,
      sgst : sgst
    })
    this.taxId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      taxName : this.taxForm.get('taxName')?.value,
      igst : this.taxForm.get('igst')?.value,
      cgst : this.taxForm.get('cgst')?.value,
      sgst : this.taxForm.get('sgst')?.value
    }
    
    this.adminService.updateTax(this.taxId, data).subscribe((res)=>{
      this._snackBar.open("Tax updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }
}
