import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../../models/route/trip';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { TripDetails } from '../../../../models/route/tripDetails';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../../admin.service';
import { Product } from '../../../../models/settings/product';
import { Customer } from '../../../../models/customer/customer';

@Component({
  selector: 'app-add-more-trip-details',
  templateUrl: './add-more-trip-details.component.html',
  styleUrls: ['./add-more-trip-details.component.scss']
})
export class AddMoreTripDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder,public sEService: SalesExecutiveService, private _snackBar: MatSnackBar, 
    private adminService: AdminService, private route: ActivatedRoute){}
  ngOnDestroy(): void {
    // this.listSubsciption.unsubscribe()
    // this.detailsSubscription.unsubscribe()
  }

  myControl = new FormControl<string | Product>('');
  id : any;
  ngOnInit(): void {
    // this.filteredProduct$ = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => {
    //     const name = typeof value === 'string' ? value : value?.productName;
    //     return name ? this._filter(name as string) : this.product.slice();
    //   }),
    // );

    this.id = this.route.snapshot.params['id'];

    this.tripSubsciption = this.getTrip();
    this.detailsSubscription = this.getTripDetails()
    this.customerSubscription = this.getCustomer()
  }

  trip! : Trip
  tripSubsciption! : Subscription;
  getTrip(){
    return this.adminService.getTripById(this.id).subscribe((res)=>{
      this.trip = res;
    })
  }

  tripDetails : TripDetails[] = []
  detailsSubscription! : Subscription;
  getTripDetails() {
    return this.adminService.getTripDetails(this.id).subscribe((res)=>{
      this.tripDetails = res;
    })
  }

  
  filteredCustomers!: Observable<Customer[]>;
  searchCustomer = new FormControl();
  customer: Customer[] = [];
  customerSubscription! : Subscription;
  getCustomer() {
    return this.adminService.getCustomer().subscribe((res) => {
      this.customer = res;

      this.filteredCustomers = this.searchCustomer.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.customerName;
          return name ? this._customer(name as string) : this.customer.slice();
        })
      );
    });
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
      amount: ['', Validators.required],
      tripId: this.id
    })  
  }  
    
  addCustomer() {  
    this.customers().push(this.newCustomer()); 
  } 

  removeCustomer(i:number) {  
    this.customers().removeAt(i);  
  }  
 
  list: any[] = []
  onSubmit(){
    this.adminService.addTripDetails(this.tripDetailsForm.getRawValue()).subscribe((res)=>{
    })
  }
}
