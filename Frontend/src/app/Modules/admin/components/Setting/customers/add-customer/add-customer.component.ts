import { Role } from '../../../../models/role';
import { CustomerGrade } from '../../../../models/customer/customerGrade';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { CustomerCategory } from '../../../../models/customer/customerCategory';
import { Customer } from '../../../../models/customer/customer';
import { Observable, Subscription, map } from 'rxjs';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { Router } from '@angular/router';

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
    phoneNumber :['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    address : [''],
    location : [''],
    gstNo : [''],
    email : ['', Validators.email],
    remarks : ['']
  });

  displayedColumns : string[] = ['id','customerName', 'customerCategoryId','customerGradeId','phoneNumber','address','location','gstNo','email','remarks', 'manage']

  ngOnInit(): void {
    this.getCategory()
    this.getGrade()

    this.customerSubscription = this.getCustomers()

    this.salesExecutive()
  }

  category$! : Observable<CustomerCategory[]> ;
  getCategory(){
    this.category$ = this.adminService.getCustomerCategory()
  } 

  units$!: Observable<CustomerGrade[]>;
  getGrade(){
    this.units$ = this.adminService.getCustomerGrade()
  }

  onSubmit(){
    this.adminService.addCustomer(this.customerForm.getRawValue()).subscribe((res)=>{
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
  }

  customers : Customer[] = [];
  customerSubscription? : Subscription
  getCustomers(){
    return this.adminService.getCustomer().subscribe((res)=>{
      this.customers = res
    })
  }  

  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
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

  isEdit = false;
  customerId : any;
  editBrand(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let customer: any = this.customers.find(x =>x.id == id)
    

    //Populate the object by the ID
    let customerName = customer.customerName.toString();
    let customerCategoryId = customer.customerCategoryId;
    let customerGradeId = customer.customerGradeId;
    let phoneNumber = customer.phoneNumber.toString();
    let address = customer.address.toString();
    let location = customer.location.toString();
    let gstNo = customer.gstNo.toString();
    let email = customer.email.toString();
    let remarks = customer.remarks.toString();
    console.log( customerCategoryId)
    this.customerForm.patchValue({
      customerName : customerName,
      customerCategoryId : customerCategoryId,
      customerGradeId : customerGradeId,
      phoneNumber : phoneNumber,
      address : address,
      location : location,
      gstNo : gstNo,
      email : email,
      remarks : remarks
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
    this.router.navigateByUrl('admin/settings/customer/customercategory')
  }

  addGrade(){
    this.router.navigateByUrl('admin/settings/customer/customergrade')
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
        
        this.category$.pipe(map(x=> x.filter(x=> x.categoryName.toLowerCase()=== 'route')))
        .subscribe((res)=>{
          let id: any = res[0].id

          this.customerForm.patchValue({
            customerCategoryId : id
          })
        })
        
      }
    })
  }
}

