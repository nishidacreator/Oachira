import { SecondaryUnit } from '../../../models/secondaryUnit';
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, startWith, map, Subscription, findIndex, filter } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Product } from '../../../models/product';
import { Vendor } from '../../../models/vendor';
import { Tax } from '../../../models/tax';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { BoldReportComponents } from '@boldreports/angular-reporting-components';
import { InvoiceNumberComponent } from '../../Setting/prefixes/invoice-number/invoice-number.component';
import { PurchaseEntry } from '../../../models/purchaseEntry';

@Component({
  selector: 'app-purchase-entry-management',
  templateUrl: './purchase-entry-management.component.html',
  styleUrls: ['./purchase-entry-management.component.scss']
})
export class PurchaseEntryManagementComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private renderer: Renderer2, private router: Router, private changeDetectorRef: ChangeDetectorRef){}
    
  ngOnDestroy(){
    // this.brandSubscription?.unsubscribe()
    this.productSubscription?.unsubscribe()
    this.submitSubscription.unsubscribe()
    this.vendorSubscriptions.unsubscribe()
    // this.taxIdSubscription.unsubscribe()
  }
  

  purchaseEntryForm = this.fb.group({
    purchaseInvoice: ['', Validators.required],
    vendorId: [Validators.required],
    purchaseAmount: [''],
    userId: [],
    eWayBillNo: ['', Validators.required],
    purachseDate: ['', Validators.required],
    purchaseEntryDetails: []
  });

  productForm = this.fb.group({  
    products: this.fb.array([]) ,  
  });

  products() : FormArray {  
    return this.productForm.get("products") as FormArray  
  }  
    
  newProduct(): FormGroup {  
    return this.fb.group({ 
      productId: ['', Validators.required],  
      quantity: ['', Validators.required],  
      discount: [''],
      rate: ['', Validators.required],
      grossAmount: [''],
      // secondaryUnitId: ['', Validators.required],
      taxId: [''],
      taxAmount: [''],
      netAmount: [''],
      mrp: ['']
    })  
  }  

  // displayedColumns : String[] = ['productName','code','barCode','primaryUnitId','categoryId','brandId','manage']

  id!: number
  ngOnInit(): void {
    this.vendorSubscriptions = this.getVendor();
    this.productSubscription = this.getProducts();
    this.getTax();
    this.getUnit();
    this.generateInvoiceNum()

    //User
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token) 
    this.id = user.id  
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
      purchaseInvoice: this.purchaseEntryForm.get('purchaseInvoice')?.value,
      vendorId: this.purchaseEntryForm.get('vendorId')?.value,
      purchaseAmount: this.purchaseEntryForm.get('purchaseAmount')?.value,
      userId: this.id,
      eWayBillNo: this.purchaseEntryForm.get('eWayBillNo')?.value,
      purachseDate: this.purchaseEntryForm.get('purachseDate')?.value,
      purchaseEntryDetails: this.productForm.getRawValue().products
    }
    console.log(data)
    this.submitSubscription = this.adminService.addPurachaseEntry(data).subscribe((res)=>{
      this._snackBar.open("Purchase added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.purchaseEntryForm.reset()
    this.purchaseEntryForm.setErrors(null)
    Object.keys(this.purchaseEntryForm.controls).forEach(key=>{this.purchaseEntryForm.get(key)?.setErrors(null)})
  }

  invoiceNumber!: string
  generateInvoiceNumber() {
    const dialogRef = this.dialog.open(InvoiceNumberComponent, {
      height: '800px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let data = result;
        console.log(data)

        this.purchaseEntryForm.get('purchaseInvoice')?.setValue(data.invoiceNum)
      }
    })
  }

  purchases: PurchaseEntry[] = [];
  userSub!: Subscription
  ivNum: string = '';
  nextId!: any 
  prefix!: string 
  generateInvoiceNum() {
    this.userSub = this.adminService.getPurchaseEntry().subscribe((res)=>{
      this.purchases = res
      console.log(this.purchases)

       // Check if there are any employees in the array
      if (this.purchases.length > 0) {
        const maxId = this.purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.purchaseInvoice.substring(5), 10);
          console.log(idNumber)

          this.prefix = this.extractLetters(inv.purchaseInvoice);

          // Check if the extracted numeric part is a valid number
          if (!isNaN(idNumber)) {
            return idNumber > prevMax ? idNumber : prevMax;
          } else {
            // If the extracted part is not a valid number, return the previous max
            return prevMax;
          }
        }, 0);
        // Increment the maxId by 1 to get the next ID
        this.nextId = maxId + 1;
        console.log(this.nextId)

      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        this.nextId = 0o0;
        this.prefix = 'INV'
        
      }
      console.log(this.nextId + 'hih')

      const paddedId = `${this.prefix}${this.nextId.toString().padStart(3, '0')}`;;

      this.ivNum = paddedId;
      
      this.purchaseEntryForm.get('purchaseInvoice')?.setValue(this.ivNum)
    })

  }

  generateRandomString(characters: string, length: number): string {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }

  extractLetters(input: string): string {
    return input.replace(/[^a-zA-Z]/g, '');
  }
  
  //PURCHASE ENTRY DETAILS
  status: boolean = false;
  addProduct() {  
    this.status = true;
    this.products().push(this.newProduct()); 
  }  

  removeProduct(i:number) {  
    this.products().removeAt(i);  
  }  
   
  unit$! : Observable<SecondaryUnit[]>;
  getUnit(){
    this.unit$ = this.adminService.getSecondaryUnit()
  }

  tax$! : Observable<Tax[]>
  getTax(){
    this.tax$ = this.adminService.getTax()
  }

  viewPurchaseEntry(){
    this.router.navigateByUrl('admin/purchases/purchaseentry/viewpurchaseentry')
  } 


  netAmount!: any;
  productIndex!: number
  calculateAmount(){
    this.productIndex = (this.productForm.getRawValue().products).length - 1
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
        this.products().at(this.productIndex).get('taxAmount')?.setValue(this.taxAmount);
        this.products().at(this.productIndex).get('grossAmount')?.setValue(this.grossAmount);
      }
    })
  }

  i = 0;
  purchaseAmount: any = 0;
  getPurchaseAmount(){
    this.productIndex = (this.productForm.getRawValue().products).length - 1
    if(this.status){
      let grossAmount = this.products().at(this.productIndex).get('grossAmount')?.value;
      if(grossAmount){
        if(this.productIndex === this.i){
          this.i = this.i + 1;
          this.purchaseAmount = grossAmount + this.purchaseAmount
          this.purchaseEntryForm.get('purchaseAmount')?.setValue(this.purchaseAmount)
        }
      }
    
    }
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