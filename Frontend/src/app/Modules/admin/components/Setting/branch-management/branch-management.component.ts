import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VendorManagementComponent } from '../.../../vendor-management/vendor-management.component';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { User } from '../../../models/settings/user';
import { BankAccount } from '../../../models/settings/bankAccount';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';
import { AddUserComponent } from '../users/add-user/add-user.component';

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
    private dialog: MatDialog){}

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

  ngOnInit(): void {
    this.getBranchManager()
    this.getBankAccount()
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
      console.log(res)
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
  }
  
}
