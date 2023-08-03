import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.scss']
})
export class WarehouseManagementComponent {

  constructor(private fb: FormBuilder, private adminService: AdminService){}

  warehouseForm = this.fb.group({

    warehouseName: ['', Validators.required],
    attention: ['', Validators.required],
    street1: ['', Validators.required],
    street2: [''],
    city: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    email: ['', Validators.required],
    mobNumber: ['', Validators.required]
  });

  ngOnInit(): void {}

  onSubmit(){
    console.log(this.warehouseForm.getRawValue())
  }
}
