import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, startWith, map, Subscription } from 'rxjs';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../../admin.service';
import { Product } from '../../../../models/settings/product';

@Component({
  selector: 'app-edit-list-details',
  templateUrl: './edit-list-details.component.html',
  styleUrls: ['./edit-list-details.component.scss']
})
export class EditListDetailsComponent implements OnInit, OnDestroy {

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

  filteredOptions!: Observable<Product[]>;
  searchControl = new FormControl();
  products: Product[] = [];
  productSubscription! : Subscription;
  getProducts() {
    return this.adminService.getProduct().subscribe((res) => {
      this.products = res;
      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.productName;
          return name ? this._filter(name as string) : this.products.slice();
        })
      );
    });
  }

  filterOptions(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter((option) =>
      option.productName.toLowerCase().includes(filterValue)
    );
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.products.filter((option) =>
      option.productName.toLowerCase().includes(filterValue)
    );
  }


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

