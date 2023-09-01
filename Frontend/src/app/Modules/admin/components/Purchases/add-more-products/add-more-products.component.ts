import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, Subscription, Observable } from 'rxjs';
import { PickList } from 'src/app/Modules/salesexecutive/models/pickList';
import { PickListDetails } from 'src/app/Modules/salesexecutive/models/pickListDetails';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../admin.service';
import { Product } from '../../../models/settings/product';
import { PurchaseEntry } from '../../../models/purchase/purchaseEntry';
import { PurchaseEntryDetails } from '../../../models/purchase/purchaseEntryDetails';
import { Tax } from '../../../models/settings/tax';

@Component({
  selector: 'app-add-more-products',
  templateUrl: './add-more-products.component.html',
  styleUrls: ['./add-more-products.component.scss']
})
export class AddMoreProductsComponent implements OnInit {

  constructor(private fb: FormBuilder,public sEService: SalesExecutiveService, private _snackBar: MatSnackBar, 
    private adminService: AdminService, private route: ActivatedRoute, private router: Router){}

    purchaseEntryForm = this.fb.group({
      purchaseAmount: [''],
    });

  ngOnDestroy(): void {
    this.listSubsciption.unsubscribe()
    this.detailsSubscription.unsubscribe()
    this.productSubscription.unsubscribe()
  }

  id : any;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.productSubscription = this.getProducts();
    this.getTax();
    this.listSubsciption = this.getPurchaseEntry();
    this.detailsSubscription = this.getPurchaseEntryDetails()
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

  pEntry! : PurchaseEntry
  listSubsciption! : Subscription;
  purchaseAmount: number = 0;
  getPurchaseEntry(){
    return this.adminService.getPurchaseEntryById(this.id).subscribe((res)=>{
      this.pEntry = res;
      console.log(this.pEntry)
      this.purchaseAmount = this.pEntry.purchaseAmount

    })
  }

  listDetails : PurchaseEntryDetails[] = []
  detailsSubscription! : Subscription;
  getPurchaseEntryDetails() {
    return this.adminService.getPurchaseEntryDetailsByEntry(this.id).subscribe((res)=>{
      this.listDetails = res;
      console.log(this.listDetails)
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

  purchaseDetailsForm = this.fb.group({  
    products: this.fb.array([]) 
  });   

  products() : FormArray {  
    return this.purchaseDetailsForm.get("products") as FormArray  
  }  
    
  newProduct(): FormGroup {  
    return this.fb.group({ 
      productId: ['', Validators.required],  
      quantity: ['', Validators.required],  
      discount: [''],
      rate: ['', Validators.required],
      grossAmount: [''],
      secondaryUnitId: ['', Validators.required],
      taxId: [''],
      taxAmount: [''],
      netAmount: ['', Validators.required],
      mrp: [''],
      purchaseEntryId: this.id
    })  
  }  
    
  addProduct() {  
    this.status = true;
    this.products().push(this.newProduct()); 
  } 

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  

  tax$! : Observable<Tax[]>;
  getTax(){
    this.tax$ = this.adminService.getTax()
  }

  addNewProduct(){
    this.router.navigateByUrl('admin/settings/product/addproduct')
  }


  netAmount!: any;
  productIndex!: number
  calculateAmount(){
    this.productIndex = (this.purchaseDetailsForm.getRawValue().products).length - 1
    let quantity = this.products().at(this.productIndex).get('quantity')?.value;
    let rate = this.products().at(this.productIndex).get('rate')?.value;
    let discount = this.products().at(this.productIndex).get('discount')?.value;

    if(quantity && rate){
      this.netAmount = (quantity*rate)-discount;
      this.products().at(this.productIndex).get('netAmount')?.setValue(this.netAmount);
    }
  }

  igst!: number
  grossAmount!: number
  taxAmount!: number
  taxIdSubscription!: Subscription;
  getTaxAmount(id: number){
    this.taxIdSubscription = this.adminService.getTaxById(id).subscribe((res)=>{
      this.igst = res.igst;
      if(this.netAmount&&this.igst){
        this.taxAmount = this.netAmount * (this.igst / 100)
        this.grossAmount = this.netAmount + this.taxAmount;
        console.log(this.grossAmount);
        if(this.grossAmount){
          this.purchaseAmount = this.purchaseAmount + this.grossAmount;
        }
        this.products().at(this.productIndex).get('taxAmount')?.setValue(this.taxAmount);
        this.products().at(this.productIndex).get('grossAmount')?.setValue(this.grossAmount);
      }
    })
  }

  i = 0;
  status: boolean = false;
  j =0;
  getPurchaseAmount(){
    this.productIndex = (this.purchaseDetailsForm.getRawValue().products).length - 1
    if(this.status){
      let grossAmount = this.products().at(this.productIndex).get('grossAmount')?.value;
      if(grossAmount){
        if(this.productIndex === this.i){
          this.i = this.i + 1;
          console.log(this.purchaseAmount)
          this.purchaseAmount = grossAmount + this.purchaseAmount
          console.log(this.purchaseAmount)
        }
      }
    
    }
  }

  list: any[] = []
  onSubmit(){
    console.log(this.purchaseDetailsForm.getRawValue().products)
    const subData = {
      products: this.purchaseDetailsForm.getRawValue().products
    }
    console.log(subData)
    this.adminService.addPurchaseEntryDetails(subData).subscribe((res)=>{
      console.log(res)
    })
    const data ={
      purchaseAmount : this.purchaseAmount 
    }
    // this.adminService.updatePurchaseAmount(this.id, data).subscribe((res)=>{
    //   console.log(res)
    // })
   
  }
}

