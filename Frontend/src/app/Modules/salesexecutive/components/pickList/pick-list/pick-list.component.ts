import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, map, Observable, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Customer } from 'src/app/Modules/admin/models/customer/customer';
import { Product } from 'src/app/Modules/admin/models/product';
import { Route } from 'src/app/Modules/admin/models/route/route';
import { SecondaryUnit } from 'src/app/Modules/admin/models/secondaryUnit';
import { SalesExecutiveService } from '../../../sales-executive.service';
import { DeliveryDays } from 'src/app/Modules/admin/models/route/deliveryDays';
import { Router, Routes } from '@angular/router';
import { CollectionDays } from 'src/app/Modules/admin/models/route/collectionDays';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent implements OnInit,OnDestroy {

  constructor(private fb: FormBuilder,public sEService: SalesExecutiveService, private _snackBar: MatSnackBar, 
    private adminService: AdminService, private router: Router){
      //SALES EXECUTIVE
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id  
      
    //Today
    let day = new Date().toLocaleString('default',{weekday:'short'})
    this.day = day.toUpperCase()
    }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe()
  }

  id: any;
  day!: string
  ngOnInit(): void {
    // this.getCustomer();
    this.getRoute();
    this.productSubscription = this.getProducts();
    this.getUnit();
    this.daysSubscription = this.getDeliveryDays()
  }

   //Search in MatSelect
   myControl = new FormControl<string | Product>('');
   filteredOptions: Product[] = [];
   filterOptions(event: Event) {
     let value = (event.target as HTMLInputElement).value;
     console.log(value);
 
     this.filteredOptions = this.product.filter(option =>
       (option.productName && option.productName.toLowerCase().includes(value?.toLowerCase())) ||
       (option.code && option.code.toLowerCase().includes(value?.toLowerCase())) ||
       (option.barCode && option.barCode.toLowerCase().includes(value?.toLowerCase()))
     );
   }
   // End

  days : DeliveryDays[] = [];
  daysSubscription? : Subscription
  weekDay: any[] = [];
  getDeliveryDays(){
    return this.adminService.getDeliveryDays().subscribe((res)=>{
      this.days = res
      for(let i = 0; i < this.days.length; i++){
        this.weekDay[i] = this.days[i].weekDay
      }
    })
  }  

  weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const weekdayName = this.weekdayNames[day];
    return this.weekDay.includes(weekdayName);
  };

  product : Product[] = [];
  filteredProduct$! : Observable<Product[]>;
  productSubscription!: Subscription
  getProducts(){
    return this.adminService.getProduct().subscribe((res)=>{
      this.product = res
      this.filteredOptions = this.product
     })
  }

  displayFn(product: Product) {
    return product && product.productName ? product.productName : '';
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.product.filter(option => 
      option.productName.toLowerCase().includes(filterValue)||
      option.code.toLowerCase().includes(filterValue)||
      option.barCode.toLowerCase().includes(filterValue)
    );
  }

  pickListForm = this.fb.group({
    routeId: [Validators.required],
    customerId: [Validators.required],
    deliveryDate: ['', Validators.required]
  });

  pickListDetailsForm = this.fb.group({  
    products: this.fb.array([]) 
  });

  products() : FormArray {  
    return this.pickListDetailsForm.get("products") as FormArray  
  }  
    
  newProduct(): FormGroup {  
    return this.fb.group({ 
      productId: ['', Validators.required],  
      quantity: ['', Validators.required]
    })  
  }  
    
  addProduct() {  
    this.products().push(this.newProduct()); 
  } 

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  

  routes: Route[] = [];
  collectionDay: CollectionDays[] = [];
  routeId: any;
  routeName: any
  getRoute(){
    this.adminService.getCollectionDays()
    .pipe(map(x=> x
      .filter(y => y.route.salesExecutiveId == this.id)
      .filter(z=> z.weekDay == this.day)
    ))
    .subscribe((res)=>{
      this.collectionDay = res
      if(this.collectionDay.length !=0){
        this.routeId = this.collectionDay[0].routeId

        this.adminService.getRouteById(this.routeId).subscribe((res)=>{
          this.routeName = res.id
          console.log("res")
          
          this.pickListForm.patchValue({
            routeId: this.routeName
          })

          this.adminService.getRouteDetailsByRouteId(this.routeName).subscribe((res)=>{
            this.customer = res.map(x => x.customer)
          })
        })
      }
    })
    this.adminService.getRoute().subscribe((res)=>{
      this.routes = res
    })
  }

  customer: Customer[] = []
  getCustomer(id : any){
    this.adminService.getRouteDetailsByRouteId(id).subscribe((res)=>{
      this.customer = res.map(x=> x.customer)
    })
  }

  unit$! : Observable<SecondaryUnit[]>;
  getUnit(){
    this.unit$ = this.adminService.getSecondaryUnit()
  }

  onSubmit(){
    console.log(this.pickListForm.getRawValue())
    console.log(this.pickListDetailsForm.getRawValue())
    let data ={
      routeId: this.pickListForm.get(['routeId'])?.value,
      customerId: this.pickListForm.get(['customerId'])?.value,
      deliveryDate: this.pickListForm.get(['deliveryDate'])?.value,
      status: 'pending',
      pickListDetails: this.pickListDetailsForm.getRawValue().products,
      salesExecutiveId: this.id,
      date: new Date()
    }

    this.sEService.addPickList(data).subscribe((res)=>{
      this._snackBar.open("Purchase added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.pickListForm.reset()
    this.pickListForm.setErrors(null)
    Object.keys(this.pickListForm.controls).forEach(key=>{this.pickListForm.get(key)?.setErrors(null)})

    this.pickListDetailsForm.reset()
    this.pickListDetailsForm.setErrors(null)
    Object.keys(this.pickListDetailsForm.controls).forEach(key=>{this.pickListDetailsForm.get(key)?.setErrors(null)})
  }

  addCustomer(){
    this.router.navigateByUrl('salesexecutive/settings/customer/customermanage')
  }

  addNewProduct(){
    this.router.navigateByUrl('admin/settings/product/addproduct')
  }
}
