import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Role } from '../../../../models/role';
import { UserManagementComponent } from '../user-management/user-management.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.roleSubscription?.unsubscribe()
  }

  roleForm = this.fb.group({
    roleName: ['', Validators.required],
    status: [false]
  });

  displayedColumns : string[] = ['id','roleName','status','manage']

  ngOnInit(): void {
    this.roleSubscription = this.getRoles()
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
    this.adminService.addRole(this.roleForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Role added successfully...","" ,{duration:3000})
      this.getRoles()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.roleForm.reset()
    this.roleForm.setErrors(null)
    Object.keys(this.roleForm.controls).forEach(key=>{this.roleForm.get(key)?.setErrors(null)})
  }

  roles: Role[] = [];
  roleSubscription? : Subscription
  getRoles(){
    return this.adminService.getRole().subscribe((res)=>{
      this.roles = res
    })
  }   

  deleteRole(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteRole(id).subscribe((res)=>{
          this.getRoles()
          this._snackBar.open("Role deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  roleId : any;
  editRole(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let role: any= this.roles.find(x =>x.id == id)
    
    //Populate the object by the ID
    let roleName = role.roleName.toString();
    let status = role.status
    
    this.roleForm.patchValue({roleName : roleName, status : status})
    this.roleId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      roleName : this.roleForm.get('roleName')?.value,
      status : this.roleForm.get('status')?.value
    }
    
    this.adminService.updateRole(this.roleId, data).subscribe((res)=>{
      this._snackBar.open("Role updated successfully...","" ,{duration:3000})
      this.getRoles();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }
}
