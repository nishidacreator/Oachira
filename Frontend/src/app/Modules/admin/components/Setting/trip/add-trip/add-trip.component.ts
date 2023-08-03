import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../admin.service';
import { MatSelectChange } from '@angular/material/select';
import { Observable, startWith, map, Subscription } from 'rxjs';
import { Route } from '../../../../models/route/route';
import { User } from 'src/app/Modules/auth/models/user';
import { Customer } from '../../../../models/customer/customer';
import { Trip } from '../../../../models/route/trip';
import { Router } from '@angular/router';
import { DeliveryDays } from 'src/app/Modules/admin/models/route/deliveryDays';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) { }
 
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe()
    this.userSubscription.unsubscribe()
    // this.customerSubscription.unsubscribe()
    this.tripSubscription.unsubscribe()
    // this.daysSubscription?.unsubscribe()
  }

  tripForm = this.fb.group({
    routeId : ['', Validators.required],
    date: ['', Validators.required],
    driver: ['', Validators.required],
    salesMan: ['', Validators.required]
  })

  ngOnInit(): void {
    this.routeSubscription = this.getRoute()
    this.userSubscription = this.getUser()
    // this.customerSubscription = this.getCustomer()
    this.tripSubscription = this.getTrips()
  }

  days : DeliveryDays[] = [];
  weekDay: any[] = [];
  driverName: any
  salesmanName: any
  byRouteId(id: number){
    //ROUTE
    this.adminService.getRouteById(id).subscribe((res)=>{
      this.driverName = res.driver.name
      this.salesmanName = res.salesman.name

      this.tripForm.patchValue({
        driver : this.driverName,
        salesMan : this.salesmanName
      })
    })

    //ROUTE DETAILS
    this.adminService.getRouteDetailsByRouteId(id).subscribe((res)=>{
      let details = res

      this.customer = res.map(x => x.customer);
      this.getCustomer()
    })

    //DELIVERY DAYS
    return this.adminService.getDeliveryDaysByRouteId(id).subscribe((res)=>{
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
  

  filteredOptions!: Observable<Route[]>;
  searchControl = new FormControl();
  route: Route[] = [];
  routeSubscription!: Subscription;
  getRoute() {
    return this.adminService.getRoute().subscribe((res) => {
      this.route = res;
      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.routeName;
          return name ? this._filter(name as string) : this.route.slice();
        })
      );
    });
  }

  filterOptions(value: string): Route[] {
    const filterValue = value.toLowerCase();
    return this.route.filter((option) =>
      option.routeName.toLowerCase().includes(filterValue)
    );
  }

  private _filter(name: string): Route[] {
    const filterValue = name.toLowerCase();
    return this.route.filter((option) =>
      option.routeName.toLowerCase().includes(filterValue)
    );
  }

  filteredDriver!: Observable<User[]>;
  searchDriver = new FormControl();
  driver: any[] = [];
  filteredSalesman!: Observable<User[]>;
  searchSalesman = new FormControl();
  salesman: any[] = [];
  userSubscription!: Subscription
  getUser() {
    return this.adminService.getUser().subscribe((res) => {
      this.driver = res.filter((x)=>x.role.roleName.toLowerCase() === 'driver')
      this.salesman = res.filter((x)=>x.role.roleName.toLowerCase() === 'salesman')
      
      this.filteredSalesman = this.searchSalesman.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filterSalesman(name as string) : this.salesman.slice();
        })
      );

      this.filteredDriver = this.searchDriver.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filterDriver(name as string) : this.driver.slice();
        })
      );
    });
  }

  filterDriver(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.driver.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  filterSalesman(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.salesman.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterDriver(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.driver.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterSalesman(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.salesman.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  tripDetailsForm = this.fb.group({  
    customers: this.fb.array([]) 
  });

  customers() : FormArray {  
    return this.tripDetailsForm.get("customers") as FormArray  
  }  
    
  newCustomer(): FormGroup {  
    return this.fb.group({ 
      customerId: ['', Validators.required],  
      invoiceNo: ['', Validators.required],  
      amount: ['', Validators.required]
    })  
  }  
    
  addCustomer() {  
    this.customers().push(this.newCustomer()); 
  } 

  removeCustomer(i:number) {  
    this.customers().removeAt(i);  
  }  

  filteredCustomers!: Observable<Customer[]>;
  searchCustomer = new FormControl();
  customer: Customer[] = [];
  customerSubscription! : Subscription;
  getCustomer() {
      this.filteredCustomers = this.searchCustomer.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.customerName;
          return name ? this._customer(name as string) : this.customer.slice();
        })
      );
  
    // });
  }

  filterCustomers(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customer.filter((option) =>
      option.customerName.toLowerCase().includes(filterValue)
    );
  }

  private _customer(name: string): Customer[] {
    const filterValue = name.toLowerCase();
    return this.customer.filter((option) =>
      option.customerName.toLowerCase().includes(filterValue)
    );
  }


  onSubmit(){
    let data = {
      routeId : this.tripForm.get('routeId')?.value,
      date  : this.tripForm.get('date')?.value,
      driver : this.tripForm.get('driver')?.value,
      salesMan : this.tripForm.get('salesMan')?.value,
      status : 'Created',
      tripDetails : this.tripDetailsForm.getRawValue().customers
    }
    this.adminService.addTrip(data).subscribe((res)=>{
    })
    this.clearControls()
  }

  clearControls(){
    this.tripForm.reset()
    this.tripForm.setErrors(null)
    Object.keys(this.tripForm.controls).forEach(key=>{this.tripForm.get(key)?.setErrors(null)})
    this.getTrips()
    this.tripDetailsForm.reset()
    this.tripDetailsForm.setErrors(null)
    Object.keys(this.tripDetailsForm.controls).forEach(key=>{this.tripDetailsForm.get(key)?.setErrors(null)})
  }

  displayedColumns : string[] = ['id','routeId', 'date','driver','salesMan','status','manage']

  trips: Trip[ ] = []
  tripSubscription! : Subscription;
  getTrips(){
    return this.adminService.getTrip().subscribe((res)=>{
      this.trips = res
    })
  }

  viewTripDetails(id : number){
    this.router.navigateByUrl('/admin/settings/route/addtrip/tripdetails/')
  }

}
