import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementComponent } from '../user-management/user-management.component';
import { Role } from '../../../../models/role';
import { AdminService } from '../../../../admin.service';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../models/user';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public dialog: MatDialog, private adminService: AdminService,
    private _snackBar: MatSnackBar, private router: Router){}

  userForm = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['',[Validators.required]],
    password:['',Validators.required],
    roleId: ['', Validators.required],
    status: [false, Validators.required]
  });

  ngOnDestroy(): void {
    this.userSubscriptions.unsubscribe()
  }
  
  ngOnInit() {
    this.getRole()

    this.userSubscriptions = this.getUsers()
  }

  roles$!: Observable<Role[]>
  roleSubscription?: Subscription;
  getRole(){
    return this.roles$ = this.adminService.getRole()
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

  onSubmit(){
    this.adminService.addUser(this.userForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Role added successfully...","" ,{duration:3000})
      // this.getRoles()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.userForm.reset()
    this.userForm.setErrors(null)
    Object.keys(this.userForm.controls).forEach(key=>{this.userForm.get(key)?.setErrors(null)})
  }

  displayedColumns : string[] = ['id','name','phoneNumber', 'roleId','status','manage']

  users : User[]=[];
  userSubscriptions! : Subscription;
  getUsers(){
    return this.adminService.getUser().subscribe((res)=>{
      this.users = res
    })
  }

  deleteUser(id: number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteUser(id).subscribe((res)=>{
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

  editFunction(){
    this.isEdit = false;

    let data: any ={
      name : this.userForm.get('name')?.value,
      phoneNumber : this.userForm.get('phoneNumber')?.value,
      password : this.userForm.get('password')?.value,
      roleId : this.userForm.get('roleId')?.value,
      status : this.userForm.get('status')?.value
    }
    
    this.adminService.updateUser(this.userId, data).subscribe((res)=>{
      this._snackBar.open("User updated successfully...","" ,{duration:3000})
      this.getUsers();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addRole(){
    this.router.navigateByUrl('admin/settings/user/addrole')
  }
}
