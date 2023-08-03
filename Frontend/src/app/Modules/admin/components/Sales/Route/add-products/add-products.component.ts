import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { PickList } from 'src/app/Modules/salesexecutive/models/pickList';
import { PickListDetails } from 'src/app/Modules/salesexecutive/models/pickListDetails';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../../admin.service';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  constructor(private fb: FormBuilder,public sEService: SalesExecutiveService, private _snackBar: MatSnackBar, 
    private adminService: AdminService, private route: ActivatedRoute){}
  ngOnDestroy(): void {
    this.listSubsciption.unsubscribe()
    this.detailsSubscription.unsubscribe()
    this.productSubscription.unsubscribe()
    this.submitSubscription.unsubscribe()
  }

  myControl = new FormControl<string | Product>('');
  id : any;
  ngOnInit(): void {
    this.filteredProduct$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.productName;
        return name ? this._filter(name as string) : this.product.slice();
      }),
    );

    this.id = this.route.snapshot.params['id'];

    this.productSubscription = this.getProducts();
    this.listSubsciption = this.getPickList();
    this.detailsSubscription = this.getPickListDetails()
  }

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
      console.log(this.listDetails)
    })
  }

  product : Product[] = [];
  filteredProduct$! : Observable<Product[]>;
  productSubscription! : Subscription;
  getProducts(){
     return this.adminService.getProduct().subscribe((res)=>{
      this.product = res
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
      pickListId: this.id
    })  
  }  
    
  addProduct() {  
    this.products().push(this.newProduct()); 
  } 

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  

  list: any[] = []
  private submitSubscription! : Subscription;
  onSubmit(){
    this.submitSubscription = this.sEService.addPickListDetails(this.pickListDetailsForm.getRawValue()).subscribe((res)=>{ })
  }
}