import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, map, Observable, startWith } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Brand } from 'src/app/Modules/admin/models/brand';
import { Customer } from 'src/app/Modules/admin/models/customer/customer';
import { Route } from 'src/app/Modules/admin/models/route/route';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { SalesExecutiveService } from '../../../sales-executive.service';

@Component({
  selector: 'app-daily-collection',
  templateUrl: './daily-collection.component.html',
  styleUrls: ['./daily-collection.component.scss']
})
export class DailyCollectionComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public sEService: SalesExecutiveService){}

  ngOnDestroy() {
    this.customerSubscription.unsubscribe()
    this.routeSubscription.unsubscribe()
  }

  dailyCollectionForm = this.fb.group({
    customerId: ['', Validators.required],
    amount : ['', Validators.required],
    invoiceNo : [''],
    paymentMode : ['', Validators.required],
    remarks : [''],
    routeId : ['', Validators.required]
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  myControl = new FormControl<string | Customer>('');
  id : any
  ngOnInit(): void {
    this.filteredCustomer$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.customerName;
        return name ? this._filter(name as string) : this.customer.slice();
      }),
    );

    // this.brandSubscription = this.getBrands()
    // this.customerSubscription = this.getCustomer();
    this.routeSubscription = this.getRoutes()

  }

  displayFn(customer: Customer): string {
    return customer && customer.customerName ? customer.customerName : '';
  }

  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.customer.filter(option => 
      option.customerName.toLowerCase().includes(filterValue)
      // option.code.toLowerCase().includes(filterValue)||
      // option.barCode.toLowerCase().includes(filterValue)
    );
  }

  customerSubscriptions!: Subscription;
  filteredCustomer$! : Observable<Customer[]>;
  customerSubscription! : Subscription;
  customer: Customer[] = []
  getCustomer(id : any){
    return this.adminService.getRouteDetailsByRouteId(id).subscribe((res)=>{
      this.customer = res.map(x=> x.customer)
    })
  }

  routes: Route[] = []
  routeSubscription!: Subscription
  getRoutes(){
    return this.adminService.getRoute().subscribe((res)=>{
      this.routes = res;
    })
  }

  onSubmit(){  
     //SALES EXECUTIVE
     const token: any = localStorage.getItem('token')
     let user = JSON.parse(token) 
    this.id = user.id

    let data = {
      customerId: this.dailyCollectionForm.get(['customerId'])?.value,
      amount : this.dailyCollectionForm.get(['amount'])?.value,
      invoiceNo : this.dailyCollectionForm.get(['invoiceNo'])?.value,
      paymentMode : this.dailyCollectionForm.get(['paymentMode'])?.value,
      remarks : this.dailyCollectionForm.get(['remarks'])?.value,
      routeId : this.dailyCollectionForm.get(['routeId'])?.value,
      salesExecutiveId : this.id,
      date : new Date()
    }
    this.sEService.addCollection(data).subscribe((res)=>{
      this._snackBar.open("Collection added successfully...","" ,{duration:3000})
      // this.getBrands()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.dailyCollectionForm.reset()
    this.dailyCollectionForm.setErrors(null)
    Object.keys(this.dailyCollectionForm.controls).forEach(key=>{this.dailyCollectionForm.get(key)?.setErrors(null)})
  }

  // brands: Brand[] = [];
  // brandSubscription? : Subscription
  // getBrands(){
  //   return this.adminService.getBrand().subscribe((res)=>{
  //     this.brands = res
  //   })
  // }   

  // deleteBrand(id : any){
  //   console.log(id)

  //   const dialogRef = this.dialog.open(DeleteDialogueComponent, {
  //     width: '250px',
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       this.adminService.deleteBrand(id).subscribe((res)=>{
  //         this.getBrands()
  //         this._snackBar.open("Brand deleted successfully...","" ,{duration:3000})
  //       },(error=>{
  //         console.log(error)
  //         this._snackBar.open(error.error.message,"" ,{duration:3000})
  //       }))
  //     }
  //   })
  // }

  // isEdit = false;
  // brandId : any;
  // editBrand(id : any){
  //   this.isEdit = true;
  //   //Get the product based on the ID
  //   let brand: any= this.brands.find(x =>x.id == id)
    
  //   //Populate the object by the ID
  //   let brandName = brand.brandName.toString();
    
  //   this.dailyCollectionForm.patchValue({customerId : brandName})
  //   this.brandId = id;
  // }

  // editFunction(){
  //   this.isEdit = false;

  //   let data: any ={
  //     brandName : this.dailyCollectionForm.get('brandName')?.value
  //   }
    
  //   this.adminService.updateBrand(this.brandId, data).subscribe((res)=>{
  //     this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
  //     this.getBrands();
  //     this.clearControls();
  //   },(error=>{
  //         console.log(error.error.text)
  //         alert(error.message)
  //       }))
  // }
}


