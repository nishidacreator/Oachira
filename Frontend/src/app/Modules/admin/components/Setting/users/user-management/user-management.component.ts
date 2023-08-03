import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit{

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){}


  ngOnInit(): void {}

  onSubmit(){}

  onCancelClick(): void {
    this.router.navigateByUrl('admin/settings') 
    this.dialogRef.close();
  }
  addRole(){
    this.router.navigateByUrl('admin/settings/user/addrole') 
    this.dialogRef.close();
  }

  manageUser(){
    this.router.navigateByUrl('admin/settings/user/adduser')
    this.dialogRef.close();
  }

  // addRoute(){
  //   this.router.navigateByUrl('admin/settings/route/addroute')
  //   this.dialogRef.close();
  // }
}
