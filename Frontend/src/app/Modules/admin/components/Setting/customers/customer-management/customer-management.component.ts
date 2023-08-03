import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryManagementComponent } from '../../products/category-management/category-management.component';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CustomerManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){}


  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings') 
    this.dialogRef.close();
  }

  manageCategory(){
    this.router.navigateByUrl('admin/settings/customer/customercategory') 
    this.dialogRef.close();
  }

  manageGrade(){
    this.router.navigateByUrl('admin/settings/customer/customergrade')
    this.dialogRef.close();
  }

  manageCustomer(){
    this.router.navigateByUrl('admin/settings/customer/customermanage')
    this.dialogRef.close();
  }
}
