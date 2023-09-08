import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserManagementComponent } from '../user-management/user-management.component';
import { Role } from '../../../../models/settings/role';
import { AdminService } from '../../../../admin.service';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../models/settings/user';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Router } from '@angular/router';
import { RoleManagementComponent } from '../role-management/role-management.component';
<<<<<<< HEAD
import { Branch } from 'src/app/Modules/admin/models/settings/branch';
=======
import { MatPaginator, PageEvent } from '@angular/material/paginator';
>>>>>>> 6c91dc2a4320e0dcc7b8da6906eae7dae3918b6b

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public dialog: MatDialog, private adminService: AdminService,
    private _snackBar: MatSnackBar, private router: Router,
    @Optional() public dialogRef: MatDialogRef<AddUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  userForm = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    password:['',Validators.required],
    roleId: ['', Validators.required],
    status: [false, Validators.required],
    branchId: ['', Validators.required]
  });

  ngOnDestroy(): void {
    this.userSubscriptions.unsubscribe()
    this.branchSubscription?.unsubscribe()
    this.roleSubscription?.unsubscribe()
    if (this.submit) {
      this.submit.unsubscribe();
    }
    if (this.delete) {
      this.delete.unsubscribe();
    }
    if (this.edit) {
      this.edit.unsubscribe();
    }
  }
  
  addStatus!: string
  type!: string
  ngOnInit() {
    this.getRole()
    this.getBranch()
    this.getUsers()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      this.type = this.dialogData?.type;

      this.adminService.getRole().subscribe(res => {
        let roleId: any = res.find(role => role.roleName.toLowerCase() === 'branchmanager')?.id

        if (this.type === 'branch'){
          this.userForm.patchValue({
            roleId: roleId
          })
        }
      })
    }
  }

  roles: Role[] = [];
  roleSubscription?: Subscription;
  getRole(){
    this.roleSubscription = this.adminService.getRole().subscribe(role => {
      this.roles = role
    })
  }

  branches: Branch[] = [];
  branchSubscription!: Subscription;
  getBranch(){
    this.branchSubscription = this.adminService.getBranch().subscribe(b => {
      this.branches = b
    })
  }

  homeClick(){
    const dialogRef = this.dialog.open(UserManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  submit!: Subscription;
  onSubmit(){
    this.submit = this.adminService.addUser(this.userForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("User added successfully...","" ,{duration:3000});
      this.getUsers();
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getUsers()
    this.userForm.reset()
    this.userForm.setErrors(null)
    Object.keys(this.userForm.controls).forEach(key=>{this.userForm.get(key)?.setErrors(null)})
  }

  displayedColumns : string[] = ['id','name','phoneNumber', 'roleId','status','manage']

  users : User[]=[];
  userSubscriptions! : Subscription;
  getUsers(){
    this.userSubscriptions = this.adminService.getUser().subscribe((res)=>{
      this.users = res
      this.filtered = this.users.slice(0, this.pageSize);
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){    this.filtered = this.users.filter(element =>
      element.name.toLowerCase().includes(filterValue) 
<<<<<<< HEAD
      || element.phoneNumber.includes(filterValue)
      || element.id.toString().includes(filterValue)
    );
=======
      // && element.status.toLowerCase().includes(filterValue)
      // && element.barCode.toLowerCase().includes(filterValue)
    );}
    else{
      this.getUsers();
    }
>>>>>>> 6c91dc2a4320e0dcc7b8da6906eae7dae3918b6b
  }

  delete!: Subscription;
  deleteUser(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteUser(id).subscribe((res)=>{
          this.getUsers()
          this._snackBar.open("User deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  userId : any;
  editUser(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let user: any= this.users.find(x =>x.id == id)
    
    //Populate the object by the ID
    let name = user.name.toString();
    let phoneNumber = user.phoneNumber.toString();
    // let password = user.password.toString();
    let roleId = user.roleId;
    let status = user.status
    
    this.userForm.patchValue({
      name : name,
      phoneNumber : phoneNumber,
      // password : password,
      roleId : roleId,
      status : status
    })
    this.userId = id;
  }

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      name : this.userForm.get('name')?.value,
      phoneNumber : this.userForm.get('phoneNumber')?.value,
      password : this.userForm.get('password')?.value,
      roleId : this.userForm.get('roleId')?.value,
      status : this.userForm.get('status')?.value
    }
    
    this.edit = this.adminService.updateUser(this.userId, data).subscribe((res)=>{
      this._snackBar.open("User updated successfully...","" ,{duration:3000})
      this.getUsers();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addRole(){
    const dialogRef = this.dialog.open(RoleManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRole()
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  pageSize = 10;
  pageIndex = 0;
  paginatedData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    this.filtered = this.users.slice(startIndex, startIndex + event.pageSize);
  }

}
