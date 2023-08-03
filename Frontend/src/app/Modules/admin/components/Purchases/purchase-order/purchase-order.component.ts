import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Product } from '../../../models/product';
import { SecondaryUnit } from '../../../models/secondaryUnit';
import { Vendor } from '../../../models/vendor';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrderIdCount = 1;

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private renderer: Renderer2, private router: Router, private changeDetectorRef: ChangeDetectorRef){}


  purchaseOrderForm = this.fb.group({
    purchaseOrderId: [this.purchaseOrderIdCount ++ , Validators.required],
    vendorId: [Validators.required],
    userId: [Validators.required],
    requestedPurchaseDate: [''],
    purchaseOrderDetails: []
  });

  productsListForm = this.fb.group({  
    products: this.fb.array([]) ,  
  });

  products() : FormArray {  
    return this.productsListForm.get("products") as FormArray  
  }  
    
  newProduct(): FormGroup {  
    return this.fb.group({ 
      productId: ['', Validators.required],  
      quantity: ['', Validators.required]
    })  
  }  

  // displayedColumns : String[] = ['productName','code','barCode','primaryUnitId','categoryId','brandId','manage']

  id!: number
  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
    this.productSubscription = this.getProducts();

    //User
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id  
  }

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

  vendor : Vendor[] = [];
  vendorSubscriptions! : Subscription;
  getVendor(){
    return this.adminService.getVendor().subscribe((res)=>{
      this.vendor = res;
    })
  }

  product : Product[] = [];
  filteredProduct$! : Observable<Product[]>;
  productSubscription!: Subscription;
  getProducts(){
    return this.adminService.getProduct().subscribe((res)=>{
      this.product = res
      this.filteredOptions = this.product
     })
  }
  
  entryStatus = false;
  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.entryStatus = true;

    let data = {
      purchaseOrderId: this.purchaseOrderForm.get('purchaseOrderId')?.value,
      vendorId: this.purchaseOrderForm.get('vendorId')?.value,
      userId: this.id,
      requestedPurchaseDate: this.purchaseOrderForm.get('requestedPurchaseDate')?.value,
      purchaseOrderDetails: this.productsListForm.getRawValue().products
    }
    console.log(data)
    // this.submitSubscription = this.adminService.addPurachaseEntry(data).subscribe((res)=>{
    //   this._snackBar.open("Purchase added successfully...","" ,{duration:3000})
    //   this.clearControls()
    // },(error=>{
    //   alert(error)
    // }))
  }

  clearControls(){
    this.purchaseOrderForm.reset()
    this.purchaseOrderForm.setErrors(null)
    Object.keys(this.purchaseOrderForm.controls).forEach(key=>{this.purchaseOrderForm.get(key)?.setErrors(null)})
  }

  //PURCHASE ORDER DETAILS
  status: boolean = false;
  addProduct() {  
    this.status = true;
    this.products().push(this.newProduct()); 
  }  
   
  // addKey(event : any){
  //   if(event.key == '+'){
  //     this.addProduct()
  //     this.renderer.setProperty(event, 'key', '');
  //   }
  // }

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  
   
  unit$! : Observable<SecondaryUnit[]>;
  getUnit(){
    this.unit$ = this.adminService.getSecondaryUnit()
  }


  viewPurchaseOrder(){
    this.router.navigateByUrl('admin/purchases/purchaseorder/viewpurchaseorder')
  }

  addUser(){
    this.router.navigateByUrl('admin/settings/user/adduser')
  }

  addVendor(){
    this.router.navigateByUrl('admin/settings/vendor')
  }

  addNewProduct(){
    this.router.navigateByUrl('admin/settings/product/addproduct')
  }

}

