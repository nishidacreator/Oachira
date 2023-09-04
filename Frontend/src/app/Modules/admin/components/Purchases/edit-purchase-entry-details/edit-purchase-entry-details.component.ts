import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, startWith, map } from 'rxjs';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../admin.service';
import { Product } from '../../../models/settings/product';

@Component({
  selector: 'app-edit-purchase-entry-details',
  templateUrl: './edit-purchase-entry-details.component.html',
  styleUrls: ['./edit-purchase-entry-details.component.scss']
})
export class EditPurchaseEntryDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService,private _snackBar: MatSnackBar,public dialog: MatDialog,
    private renderer: Renderer2,private router: Router, private sEService: SalesExecutiveService, private route: ActivatedRoute) {}
  
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe()
  }

  productForm = this.fb.group({
    productId: [''],
    quantity: ['']
  })

  ngOnInit(): void {
    this.productSubscription = this.getProducts();
    this.editFunction()
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
 
  addNewProduct(){}
  
  unitId! : number
  editFunction(){
     //Get the product based on the ID
     this.sEService.getPickListDetailsById(this.route.snapshot.params['id']).subscribe((res)=>{
      let result = res

        
       //Populate the object by the ID
      let productId: any = result.productId
      let quantity: any = result.quantity
      

      this.productForm.patchValue({
        productId : productId,
        quantity : quantity
      })
    })
  }

  onSubmit(){   
      let data: any ={
        productId : this.productForm.get('productId')?.value,
        quantity : this.productForm.get('quantity')?.value
      }
    
      this.sEService.updatePickListDetails(data, this.route.snapshot.params['id']).subscribe((res)=>{
        this._snackBar.open("Pick List Details updated successfully...","" ,{duration:3000})
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
  }
  
  clearControls(){
    this.productForm.reset()
    this.productForm.setErrors(null)
    Object.keys(this.productForm.controls).forEach(key=>{this.productForm.get(key)?.setErrors(null)})
  }
}
