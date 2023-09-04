import { CustomerCategoryComponent } from './../customer-category/customer-category.component';
import { Role } from '../../../../models/settings/role';
import { CustomerGrade } from '../../../../models/customer/customerGrade';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { CustomerCategory } from '../../../../models/customer/customerCategory';
import { Customer } from '../../../../models/customer/customer';
import { Observable, Subscription, map } from 'rxjs';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { Router } from '@angular/router';
import { CategoryManagementComponent } from '../../products/category-management/category-management.component';
import { CustomerGradeComponent } from '../customer-grade/customer-grade.component';
import { ViewContactsComponent } from '../view-contacts/view-contacts.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public router: Router){}

  ngOnDestroy(){
    this.customerSubscription?.unsubscribe()
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
    subledgerCode : ['']
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
    this.getCategory()
    this.getGrade()

    this.customerSubscription = this.getCustomers()

    this.salesExecutive()
  }

  category: CustomerCategory[] = [] ;
  getCategory(){
    this.adminService.getCustomerCategory().subscribe(c => {
      this.category = c
    })
  } 

  grade: CustomerGrade[] = [] ;
  getGrade(){
    this.adminService.getCustomerGrade().subscribe(c => {
      this.grade = c
    })
  }

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
      numbers : this.phoneForm.getRawValue().numbers
    }
    console.log(data);
    this.adminService.addCustomer(data).subscribe((res)=>{
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
    return this.adminService.getCustomer().subscribe((res)=>{
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
      // && element.code.toLowerCase().includes(filterValue)
      // && element.barCode.toLowerCase().includes(filterValue)
    );
  }

  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteCustomer(id).subscribe((res)=>{
          this.getCustomers()
          this._snackBar.open("Customer deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  getPhoneNumber(){
    
  }

  isEdit = false;
  customerId : any;
  phoneNumbers!: any
  editBrand(id : any){
    this.isEdit = true;
    this.phoneNumbers = [];
    //Get the product based on the ID
    let customer: any = this.customers.find(x =>x.id == id)

    this.adminService.getCustomerPhoneByCustomerId(id).subscribe(res=>{
      let number = res
      for(let i=0; i<number.length; i++){
        this.phoneNumbers.push(number[i].phoneNumber)

        this.numbers().push(number[i].phoneNumber)
      }

       //Populate the object by the ID
      let customerName = customer.customerName.toString();
      let customerCategoryId = customer.customerCategoryId;
      let customerGradeId = customer.customerGradeId;
      let address = customer.address.toString();
      let location = customer.location.toString();
      let gstNo = customer.gstNo.toString();
      let email = customer.email.toString();
      let remarks = customer.remarks.toString()


      this.customerForm.patchValue({
        customerName : customerName,
        customerCategoryId : customerCategoryId,
        customerGradeId : customerGradeId,
        address : address,
        location : location,
        gstNo : gstNo,
        email : email,
        remarks : remarks
      })
    })
    this.customerId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      customerName : this.customerForm.get('customerName')?.value,
      customerCategoryId : this.customerForm.get('customerCategoryId')?.value,
      customerGradeId : this.customerForm.get('customerGradeId')?.value,
      phoneNumber : this.customerForm.get('phoneNumber')?.value,
      address : this.customerForm.get('address')?.value,
      location : this.customerForm.get('location')?.value,
      gstNo : this.customerForm.get('gstNo')?.value,
      email : this.customerForm.get('email')?.value,
      remarks : this.customerForm.get('remarks')?.value
    }
    
    this.adminService.updateCustomer(this.customerId, data).subscribe((res)=>{
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
  salesExecutive(){
    //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.role
    console.log(this.id) 
    this.adminService.getRoleById(this.id).subscribe((res)=>{
      let role = res.roleName.toLowerCase();

      if(role === 'salesexecutive'){
        console.log(this.id)
      
        let id: any = this.category.find(c => c.categoryName.toLowerCase() === 'route')?.id
        console.log(id)
        this.customerForm.patchValue({
            customerCategoryId : id
          })
      }
    })
  }
}

