import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleManagementComponent } from '../users/role-management/role-management.component';

@Component({
  selector: 'app-manufacturer-management',
  templateUrl: './manufacturer-management.component.html',
  styleUrls: ['./manufacturer-management.component.scss']
})
export class ManufacturerManagementComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ManufacturerManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  manufacturerForm = this.fb.group({

    manfactureName: ['', Validators.required]
  });

  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
