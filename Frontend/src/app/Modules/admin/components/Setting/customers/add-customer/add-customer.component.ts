import { CustomerCategoryComponent } from './../customer-category/customer-category.component';
import { CustomerGrade } from '../../../../models/customer/customerGrade';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { CustomerCategory } from '../../../../models/customer/customerCategory';
import { Customer } from '../../../../models/customer/customer';
import { Subscription } from 'rxjs';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { Router } from '@angular/router';
import { CustomerGradeComponent } from '../customer-grade/customer-grade.component';
import { ViewContactsComponent } from '../view-contacts/view-contacts.component';
import { Branch } from 'src/app/Modules/admin/models/settings/branch';
import { BranchManagementComponent } from '../../branch/branch-management/branch-management.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, OnDestroy {

  branchId: number;
  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public router: Router){
      const token: any = localStorage.getItem('token')
      let user = JSON.parse(token)
      console.log(user)

      this.branchId = user.branch
    }

  ngOnDestroy(){
    this.customerSubscription?.unsubscribe()
    this.gradeSub.unsubscribe();
    this.categorySub.unsubscribe();
    this.saleExec.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
  }

  homeClick(){
    const dialogRef = this.dialog.open(CustomerManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  customerForm = this.fb.group({

    customerName: ['', Validators.required],
    customerCategoryId : ['', Validators.required],
    customerGradeId : ['', Validators.required],
    address : [''],
    location : [''],
    gstNo : [''],
    email : ['', Validators.email],
    remarks : [''],
    subledgerCode : [''],
    branchId : [0]
  });

  phoneForm = this.fb.group({
    numbers: this.fb.array([]),
  });

  numbers(): FormArray {
    return this.phoneForm.get("numbers") as FormArray;
  }

  newNumber(): FormGroup {
    return this.fb.group({
      phoneNumber : ['', Validators.required]
    })
  }

  status: boolean = false;
  addNumber() {
    this.status = true;
    this.numbers().push(this.newNumber());
  }

  removeProduct(i: number) {
    this.numbers().removeAt(i);
  }

  displayedColumns : string[] = ['id','customerName', 'customerCategoryId','customerGradeId','phoneNumber','address','location','gstNo','email','remarks', 'manage']

  ngOnInit(): void {
    this.customerForm.get('branchId')?.setValue(this.branchId)

    this.getCategory()
    this.getGrade()
    this.getCustomers()
    this.salesExecutive()
    this.getBranch()
  }

  category: CustomerCategory[] = [];
  categorySub!: Subscription;
  getCategory(){
    this.categorySub = this.adminService.getCustomerCategory().subscribe(c => {
      this.category = c
    })
  } 

  grade: CustomerGrade[] = [];
  gradeSub!: Subscription
  getGrade(){
    this.gradeSub = this.adminService.getCustomerGrade().subscribe(c => {
      this.grade = c
    })
  }

  branches: Branch[] = [];
  branchSubscription!: Subscription;
  getBranch(){
    this.branchSubscription = this.adminService.getBranch().subscribe(b => {
      this.branches = b
    })
  }

  addBranch(){
    const dialogRef = this.dialog.open(BranchManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBranch()
    })
  }

  submit!: Subscription;
  onSubmit(){
    let data = {
      customerName: this.customerForm.getRawValue().customerName,
      customerCategoryId : this.customerForm.getRawValue().customerCategoryId,
      customerGradeId : this.customerForm.getRawValue().customerGradeId,
      address : this.customerForm.getRawValue().address,
      location : this.customerForm.getRawValue().location,
      gstNo : this.customerForm.getRawValue().gstNo,
      email : this.customerForm.getRawValue().email,
      remarks : this.customerForm.getRawValue().remarks,
      numbers : this.phoneForm.getRawValue().numbers,
      subledgerCode : this.customerForm.getRawValue().subledgerCode,
      branchId : this.customerForm.getRawValue().branchId
    }

    this.submit = this.adminService.addCustomer(data).subscribe((res)=>{
      this._snackBar.open("Customer added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getCustomers()
    this.customerForm.reset()
    this.customerForm.setErrors(null)
    Object.keys(this.customerForm.controls).forEach(key=>{this.customerForm.get(key)?.setErrors(null)})

    this.phoneForm.reset()
    this.phoneForm.setErrors(null)
    Object.keys(this.phoneForm.controls).forEach(key=>{this.phoneForm.get(key)?.setErrors(null)})
  }

  customers : Customer[] = [];
  customerSubscription? : Subscription
  getCustomers(){
    this.customerSubscription = this.adminService.getCustomer().subscribe((res)=>{
      this.customers = res
      this.filtered = this.customers
    })
  }  

  openContacts(id: number){
    const dialogRef = this.dialog.open(ViewContactsComponent, {
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {})
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.customers.filter(element =>
      element.customerName.toLowerCase().includes(filterValue) 
      || element.id.toString().includes(filterValue)
      || element.customerCategory.categoryName.toLowerCase().includes(filterValue)
      || element.customerGrade.grade.toLowerCase().includes(filterValue)
      // || element.subledgerCode.toLowerCase().includes(filterValue)
      || element.location.toLowerCase().includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteCustomer(id).subscribe((res)=>{
          this.getCustomers()
          this._snackBar.open("Customer deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  customerId : any;
  phoneNumbers!: any
  editCustomer(id: number) {
    this.isEdit = true;
    let customer: any = this.customers.find(x =>x.id == id)
    this.customerId = customer.id;

    let customerName = customer.customerName.toString();
    let customerCategoryId = customer.customerCategoryId;
    let customerGradeId = customer.customerGradeId;
    let address = customer.address.toString();
    let location = customer.location.toString();
    let gstNo = customer.gstNo.toString();
    let email = customer.email.toString();
    let remarks = customer.remarks.toString();
    let subledgerCode = customer.subledgerCode.toString();
    let branchId = customer.branchId;

    this.customerForm.patchValue({
      customerName : customerName,
      customerCategoryId : customerCategoryId,
      customerGradeId : customerGradeId,
      address : address,
      location : location,
      gstNo : gstNo,
      email : email,
      remarks : remarks,
      subledgerCode : subledgerCode,
      branchId : branchId,
    })

    const numbers = this.phoneForm.get("numbers") as FormArray;
    numbers.clear(); // Clear any existing items in the FormArray

    if (customer.customerPhones && customer.customerPhones.length > 0) {
        customer.customerPhones.forEach((detail: any) => {
        const phoneForm = this.fb.group({
          phoneNumber:detail.phoneNumber,
        });

        numbers.push(phoneForm);
      });
    }
  }

  edit!: Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      customerName : this.customerForm.get('customerName')?.value,
      customerCategoryId : this.customerForm.get('customerCategoryId')?.value,
      customerGradeId : this.customerForm.get('customerGradeId')?.value,
      subledgerCode : this.customerForm.get('subledgerCode')?.value,
      address : this.customerForm.get('address')?.value,
      location : this.customerForm.get('location')?.value,
      gstNo : this.customerForm.get('gstNo')?.value,
      email : this.customerForm.get('email')?.value,
      remarks : this.customerForm.get('remarks')?.value,
      numbers : this.phoneForm.getRawValue().numbers,
      branchId : this.customerForm.get('branchId')?.value
    }
    console.log(data);
    
    this.edit = this.adminService.updateCustomer(this.customerId, data).subscribe((res)=>{
      console.log(res)
      this._snackBar.open("Customer updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addCategory(){
    const dialogRef = this.dialog.open(CustomerCategoryComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategory()
    })
  }

  addGrade(){
    const dialogRef = this.dialog.open(CustomerGradeComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getGrade()
    })
  }

  id : any;
  saleExec!: Subscription;
  salesExecutive(){
    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.role

    this.saleExec = this.adminService.getRoleById(this.id).subscribe((res)=>{
      let role = res.roleName.toLowerCase();

      if(role === 'salesexecutive'){
        let id: any = this.category.find(c => c.categoryName.toLowerCase() === 'route')?.id

        this.customerForm.patchValue({
            customerCategoryId : id
          })
      }
    })
  }
}

