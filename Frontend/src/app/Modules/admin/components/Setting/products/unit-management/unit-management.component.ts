import { SecondaryUnit } from '../../../../models/settings/secondaryUnit';
import { PrimaryUnit } from '../../../../models/settings/primaryUnit';
import { AdminService } from '../../../../admin.service';
import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Subscription } from 'rxjs';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unit-management',
  templateUrl: './unit-management.component.html',
  styleUrls: ['./unit-management.component.scss']
})
export class UnitManagementComponent implements OnDestroy {

  addStatus!: string | null;
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<UnitManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any){}

  ngOnDestroy() {
    this.unitSubscription?.unsubscribe();
    this.pUnitSubscription?.unsubscribe();
    this.sUnitSubscription?.unsubscribe();
    if(this.pSubmit){
      this.pSubmit.unsubscribe();
    }
    if(this.pDelete){
      this.pDelete.unsubscribe();
    }
    if(this.pEdit){
      this.pEdit.unsubscribe();
    }
    if(this.sSubmit){
      this.sSubmit.unsubscribe();
    }
    if(this.sDelete){
      this.sDelete.unsubscribe();
    }
    if(this.sEdit){
      this.sEdit.unsubscribe();
    }
  }

  unitForm = this.fb.group({
    unitType: ['', Validators.required],
  })

  primaryUnitForm = this.fb.group({
    primaryUnitName: ['', Validators.required],
    value: ['', Validators.required],
  })
 
  secondaryUnitForm = this.fb.group({
    secondaryUnitName: ['', Validators.required],
    factor: ['', Validators.required],
    primaryUnitId: ['', Validators.required],
  });

  displayedColumns : String[] = ['id', 'primaryUnitName', 'value', 'manage']
  secondaryDisplayedColumns : String[] = ['id', 'secondaryUnitName', 'factor', 'primaryUnitId', 'manage']

  unitType : Boolean = false;
  status : Boolean = true;

  ngOnInit(): void {
    this.getPrimaryUnit();
    this.getSecondaryUnits();
    this.getPrimaryUnits();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    } 
  }

  units: any;
  unitSubscription? : Subscription;
  getPrimaryUnit(){
    this.unitSubscription = this.adminService.getPrimaryUnit().subscribe((res)=>{
      this.units = res;
    })
  }

  pSubmit!: Subscription;
  onPrimarySubmit(){
      this.pSubmit = this.adminService.addPrimaryUnit(this.primaryUnitForm.getRawValue()).subscribe((res)=>{
        this._snackBar.open("Primary Unit added successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
        alert(error)
      }))
  }

  sSubmit!: Subscription;
  onSecondarySubmit(){
    this.sSubmit = this.adminService.addSecondaryUnit(this.secondaryUnitForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Secondary Unit added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.unitForm.reset()
    this.unitForm.setErrors(null)
    Object.keys(this.unitForm.controls).forEach(key=>{this.unitForm.get(key)?.setErrors(null)})

    this.primaryUnitForm.reset()
    this.primaryUnitForm.setErrors(null)
    Object.keys(this.primaryUnitForm.controls).forEach(key=>{this.primaryUnitForm.get(key)?.setErrors(null)})

    this.secondaryUnitForm.reset()
    this.secondaryUnitForm.setErrors(null)
    Object.keys(this.secondaryUnitForm.controls).forEach(key=>{this.secondaryUnitForm.get(key)?.setErrors(null)})
    this.getPrimaryUnits()
    this.getSecondaryUnits()
    
  }

  pUnits : PrimaryUnit[] = [];
  pUnitSubscription? : Subscription;
  getPrimaryUnits(){
    this.pUnitSubscription = this.adminService.getPrimaryUnit().subscribe((res)=>{
      this.pUnits = res
      this.filtered = this.pUnits
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.pUnits.filter(element =>
      element.primaryUnitName.toLowerCase().includes(filterValue) 
      || element.id.toString().includes(filterValue) 
    );
  }

  sUnits : SecondaryUnit[] = [];
  sUnitSubscription? : Subscription;
  getSecondaryUnits(){
    this.sUnitSubscription = this.adminService.getSecondaryUnit().subscribe((res)=>{
      this.sUnits = res
      this.secFiltered = this.sUnits
    })
  }

  secFilterValue: any;
  secFiltered!: any[];
  applySecFilter(event: Event): void {
    console.log(this.sUnits)
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.secFilterValue = filterValue;
    this.secFiltered = this.sUnits.filter(element =>
      element.secondaryUnitName.toLowerCase().includes(filterValue) 
      || element.primaryUnit.primaryUnitName.toLowerCase().includes(filterValue)
      || element.id.toString().toLowerCase().includes(filterValue)
    );
  }

  pDelete!: Subscription;
  deletePUnit(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.pDelete = this.adminService.deletePUnit(id).subscribe((res)=>{
          this.clearControls()
          this._snackBar.open("Primary Unit deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
}

sDelete!: Subscription;
deleteSUnit(id : any){
  const dialogRef = this.dialog.open(DeleteDialogueComponent, {
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.sDelete = this.adminService.deleteSUnit(id).subscribe((res)=>{
        this.clearControls()
        this._snackBar.open("Secondary Unit deleted successfully...","" ,{duration:3000})
      },(error=>{
        this._snackBar.open(error.error.message,"" ,{duration:3000})
      }))
    }
  })
}

isEdit = false;
pUnitStatus = false;
pUnitId : any;
editPUnit(id : any){
  this.isEdit = true;
  this.pUnitStatus = true;
  //Get the product based on the ID
  let punit: any = this.pUnits.find(x =>x.id == id)
  
  //Populate the object by the ID
  let primaryUnitName = punit.primaryUnitName.toString();
  let value = punit.value;
  
  this.unitForm.patchValue({
    unitType : 'primary'
  })

  this.primaryUnitForm.patchValue({
    primaryUnitName : primaryUnitName,
    value : value
  });
  this.pUnitId = id;
}

pEdit!: Subscription;
editPUnitFunction(){
  this.isEdit = false;
  this.pUnitStatus = false;
  let data: any ={
    primaryUnitName : this.primaryUnitForm.get('primaryUnitName')?.value,
    value : this.primaryUnitForm.get('value')?.value
  }
  
  this.pEdit = this.adminService.updatePUnit(this.pUnitId, data).subscribe((res)=>{
    this._snackBar.open("Primary Unit updated successfully...","" ,{duration:3000})
    this.clearControls();
  },(error=>{
        alert(error.message)
      }))
  }

  sUnitId : any;
  editSUnit(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let sunit: any = this.sUnits.find(x =>x.id == id)
    
    //Populate the object by the ID
    let secondaryUnitName = sunit.secondaryUnitName.toString();
    let primaryUnitId = sunit.primaryUnitId
    let factor = sunit.factor;
    
    this.unitForm.patchValue({
      unitType : 'secondary'
    })

    this.secondaryUnitForm.patchValue({
      secondaryUnitName : secondaryUnitName, 
      primaryUnitId: primaryUnitId, 
      factor : factor
    });

    this.sUnitId = id;
  }
  
  sEdit!: Subscription;
  editSUnitFunction(){
    this.isEdit = false;
  
    let data: any ={
      secondaryUnitName : this.secondaryUnitForm.get('secondaryUnitName')?.value,
      primaryUnitId : this.secondaryUnitForm.get('primaryUnitId')?.value,
      factor : this.secondaryUnitForm.get('factor')?.value
    }
    
    this.sEdit = this.adminService.updateSUnit(this.sUnitId, data).subscribe((res)=>{
      this._snackBar.open("Secondary Unit updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
        alert(error.message)
        }))
    }

    homeClick(){
      const dialogRef = this.dialog.open(ProductManagementComponent, {
        height: '200px',
        width: '800px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }

    onCancelClick(): void {
      this.dialogRef.close();
    }
}
