import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { startWith, map, Observable, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Customer } from 'src/app/Modules/admin/models/customer/customer';
import { Product } from 'src/app/Modules/admin/models/product';
import { SecondaryUnit } from 'src/app/Modules/admin/models/secondaryUnit';
import { SalesExecutiveService } from '../../../sales-executive.service';
import { PickList } from '../../../models/pickList';
import { PickListDetails } from '../../../models/pickListDetails';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public sEService: SalesExecutiveService, private _snackBar: MatSnackBar, 
    private adminService: AdminService, private route: ActivatedRoute, private router: Router) {      
      this.id = this.route.snapshot.params['id'];
  }

  ngOnDestroy(): void {
    this.listSubsciption.unsubscribe()
    this.detailsSubscription.unsubscribe()
    this.productSubscription.unsubscribe()
  }

  id : any;
  ngOnInit(): void {
    this.productSubscription = this.getProducts();
    this.getUnit();
    this.listSubsciption = this.getPickList();
    this.detailsSubscription = this.getPickListDetails()
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

  pickList! : PickList
  listSubsciption! : Subscription;
  getPickList(){
    return this.sEService.getPickListById(this.id).subscribe((res)=>{
      this.pickList = res;
    })
  }

  listDetails : PickListDetails[] = []
  detailsSubscription! : Subscription;
  getPickListDetails() {
    return this.sEService.getPickListDetails(this.id).subscribe((res)=>{
      this.listDetails = res;
    })
  }

  product : Product[] = [];
  productSubscription! : Subscription;
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

  pickListDetailsForm = this.fb.group({  
    products: this.fb.array([]) 
  });

  products() : FormArray {  
    return this.pickListDetailsForm.get("products") as FormArray  
  }  
    
  newProduct(): FormGroup {  
    return this.fb.group({ 
      productId: ['', Validators.required],  
      quantity: ['', Validators.required],  
      secondaryUnit: ['', Validators.required],
      pickListId: this.id
    })  
  }  
    
  addProduct() {  
    this.products().push(this.newProduct()); 
  } 

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  

  unit$! : Observable<SecondaryUnit[]>;
  getUnit(){
    this.unit$ = this.adminService.getSecondaryUnit()
  }

  list: any[] = []
  onSubmit(){
    this.sEService.addPickListDetails(this.pickListDetailsForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Purchase added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.pickListDetailsForm.reset()
    this.pickListDetailsForm.setErrors(null)
    Object.keys(this.pickListDetailsForm.controls).forEach(key=>{this.pickListDetailsForm.get(key)?.setErrors(null)})
  }

  addNewProduct(){
    this.router.navigateByUrl('admin/settings/product/addproduct')
  }
}
