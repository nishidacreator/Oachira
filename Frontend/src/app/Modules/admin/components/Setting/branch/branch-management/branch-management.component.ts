import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VendorManagementComponent } from '../../vendor-management/vendor-management.component';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from '../../../../models/settings/user';
import { BankAccount } from '../../../../models/settings/bankAccount';
import { AdminService } from '../../../../admin.service';
import { Subscription } from 'rxjs';
import { AddUserComponent } from '../../users/add-user/add-user.component';
import { Branch } from '../../../../models/settings/branch';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchAccountComponent } from '../branch-account/branch-account.component';

@Component({
  selector: 'app-branch-management',
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.scss']
})
export class BranchManagementComponent {

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.accountSubscription.unsubscribe();  
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private adminService: AdminService,
    private dialog: MatDialog, @Optional() public dialogRef: MatDialogRef<AddUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private _snackBar: MatSnackBar){}

  branchForm = this.fb.group({
    branchName: ['', Validators.required],
    address: [''],
    email: ['', Validators.email],
    phone: ['',[ Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    branchManagerId: ['', Validators.required]
  });

  branchAccountForm = this.fb.group({
    accounts: this.fb.array([]),
  });

  accounts(): FormArray {
    return this.branchAccountForm.get("accounts") as FormArray;
  }

  newAccount(): FormGroup {
    return this.fb.group({
      bankAccountId : ['', Validators.required]
    })
  }

  status: boolean = false;
  addProduct() {
    this.status = true;
    this.accounts().push(this.newAccount());
  }

  removeProduct(i: number) {
    this.accounts().removeAt(i);
  }

  addStatus!: string
  type!: string
  ngOnInit(): void {
    this.getBranchManager()
    this.getBankAccount()
    this.getBranches()

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }
  }

  bManager: User[] = [];
  userSub!: Subscription;
  getBranchManager(){
    this.userSub = this.authService.getUser().subscribe((res)=>{
      this.bManager = res.filter(user=>user.role.roleName.toLowerCase() === "branchmanager")
    })
  }

  accountSubscription!: Subscription;
  bankAccounts: BankAccount[] = [];
  getBankAccount(){
    this.accountSubscription = this.adminService.getBankAccount().subscribe(res => {
      this.bankAccounts = res
      this.filteredOptions = this.bankAccounts
    })
  }

  
  //Search in MatSelect
  myControl = new FormControl<string | BankAccount>("");
  filteredOptions: BankAccount[] = [];
  filterOptions(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.bankAccounts.filter((option) => {
      if (
        (option.accountNo &&
          option.accountNo.toLowerCase().includes(value?.toLowerCase()))
        //    ||(option.code &&
        //   option.code.toLowerCase().includes(value?.toLowerCase())) ||
        // (option.barCode &&
        //   option.barCode.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }
  // End

  addManager(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {status : 'true', type : 'branch'},
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranchManager()
    })
  }

  addNewAccount(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranchManager()
    })
  }

  sub!: Subscription;
  onSubmit(){
    let data = {
      branchName: this.branchForm.getRawValue().branchName,
      address: this.branchForm.getRawValue().address,
      email: this.branchForm.getRawValue().email,
      phone: this.branchForm.getRawValue().phone,
      branchManagerId: this.branchForm.getRawValue().branchManagerId,
      branchAccounts: this.branchAccountForm.getRawValue().accounts
    }
    this.sub = this.adminService.addBranch(data).subscribe(branch => {
      console.log(branch)

      this.clearControls()
    })
  }

  clearControls() {
    this.branchAccountForm.reset();
    this.branchAccountForm.setErrors(null);
    Object.keys(this.branchAccountForm.controls).forEach((key) => {
      this.branchAccountForm.get(key)?.setErrors(null);
    });

    this.branchForm.reset();
    this.branchForm.setErrors(null);
    Object.keys(this.branchForm.controls).forEach((key) => {
      this.branchForm.get(key)?.setErrors(null);
    });
    this.getBranches()
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  branchSub!: Subscription;
  branches: Branch[] = [];
  getBranches(){
    this.branchSub = this.adminService.getBranch().subscribe(x => {
      this.branches = x;
      this.filtered = this.branches
      console.log(this.branches)
    })
  }

  filterValue: any;
  filtered!: Branch[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.branches.filter(element =>
      element.branchName.toLowerCase().includes(filterValue) 
      || element.id.toString().includes(filterValue)
      || element.branchManager.name.toString().includes(filterValue)
    );
  }

  openDetails(id: number){
    const dialogRef = this.dialog.open(BranchAccountComponent, {
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {})
  }

  delete!: Subscription;
  deleteRole(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteBranch(id).subscribe((res)=>{
          this.getBranches()
          this._snackBar.open("Branch deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  branchId : any;
  phoneNumbers!: any
  editBranch(id: number) {
    this.isEdit = true;
    let branch: any = this.branches.find(x =>x.id == id)
    console.log(branch)
    this.branchId = branch.id;

    let branchName = branch.branchName.toString();
    let address = branch.address.toString();
    let branchManagerId = branch.branchManagerId;
    let email = branch.email.toString();
    let phone = branch.phone.toString();

    this.branchForm.patchValue({
      branchName : branchName,
      address : address,
      branchManagerId : branchManagerId,
      email : email,
      phone : phone
    })

    const accounts = this.branchAccountForm.get("accounts") as FormArray;
    accounts.clear(); // Clear any existing items in the FormArray

    if (branch.branchaccounts && branch.branchaccounts.length > 0) {
      branch.branchaccounts.forEach((detail: any) => {
        const branchAccountForm = this.fb.group({
          bankAccountId:detail.bankAccountId,
        });

        accounts.push(branchAccountForm);
      });
    }
  }

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      branchName : this.branchForm.get('branchName')?.value,
      address : this.branchForm.get('address')?.value,
      branchManagerId : this.branchForm.get('branchManagerId')?.value,
      email : this.branchForm.get('email')?.value,
      phone : this.branchForm.get('phone')?.value,
      accounts : this.branchAccountForm.getRawValue().accounts,
    }
    console.log(data);
    
    this.edit = this.adminService.updateBranch(this.branchId, data).subscribe((res)=>{
      console.log(res)
      this._snackBar.open("Branch updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }
  
}
