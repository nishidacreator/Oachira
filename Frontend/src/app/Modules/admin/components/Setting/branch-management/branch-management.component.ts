import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorManagementComponent } from '../.../../vendor-management/vendor-management.component';

@Component({
  selector: 'app-branch-management',
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.scss']
})
export class BranchManagementComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<VendorManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  BranchForm = this.fb.group({

    branchName: ['', Validators.required],
    address: ['', Validators.required],
    street1: ['', Validators.required],
    street2: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required]
  });

  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
