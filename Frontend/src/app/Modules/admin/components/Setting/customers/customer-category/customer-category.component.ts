import { CustomerCategory } from '../../../../models/customer/customerCategory';
import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Subscription } from 'rxjs';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CustomerCategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy(){
    this.categorySubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe()
    }
    if(this.edit){
      this.edit.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
  }

  customerCategoryForm = this.fb.group({

    categoryName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','categoryName', 'manage']

  addStatus!: string
  ngOnInit(): void {
    this.getCategory()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }
  }

  homeClick(){
    const dialogRef = this.dialog.open(CustomerManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  submit!: Subscription;
  onSubmit(){
    this.submit = this.adminService.addCustomerCategory(this.customerCategoryForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Customer category added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getCategory()
    this.customerCategoryForm.reset()
    this.customerCategoryForm.setErrors(null)
    Object.keys(this.customerCategoryForm.controls).forEach(key=>{this.customerCategoryForm.get(key)?.setErrors(null)})
  }

  category: CustomerCategory[] = [];
  categorySubscription? : Subscription;
  getCategory(){
    this.categorySubscription = this.adminService.getCustomerCategory().subscribe((res)=>{
      this.category = res
    })
  }   

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteCustomerCategory(id).subscribe((res)=>{
          this.getCategory()
          this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  catId : any;
  edit!: Subscription;
  editBrand(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let customerCat: any = this.category.find(x =>x.id == id)
    
    //Populate the object by the ID
    let categoryName = customerCat.categoryName.toString();
    
    this.customerCategoryForm.patchValue({categoryName : categoryName})
    this.catId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      categoryName : this.customerCategoryForm.get('categoryName')?.value
    }
    
    this.edit = this.adminService.updateCustomerCategory(this.catId, data).subscribe((res)=>{
      this._snackBar.open("Category updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
