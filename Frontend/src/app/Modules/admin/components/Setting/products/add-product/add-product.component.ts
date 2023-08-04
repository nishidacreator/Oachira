import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Category } from '../../../../models/category';
import { Product } from '../../../../models/product';
import { SecondaryUnit } from '../../../../models/secondaryUnit';
import { PrimaryUnit } from 'src/app/Modules/admin/models/primaryUnit';
import { ProductManagementComponent } from '../product-management/product-management.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router){}

      
  ngOnDestroy(){
    this.brandSubscription?.unsubscribe()
    this.productSubscription?.unsubscribe()
    this.submitSubscription.unsubscribe()
  }
  

  productForm = this.fb.group({
    productName: ['', Validators.required],
    code: [''],
    barCode: [''],
    primaryUnitId: ['', Validators.required],
    categoryId: ['', Validators.required],
    brandId: ['', Validators.required],
    reorderQuantity: [''],
    loyaltyPoint: ['']
  });

  displayedColumns : String[] = ['id','productName','code','barCode','primaryUnitId','categoryId','brandId','manage']

  brandSubscription? : Subscription;
  productSubscription? : Subscription;
  ngOnInit(): void {
    this.getUnits();
    this.getCategories();
    
    this.brandSubscription = this.getBrands()
    this.productSubscription = this.getProducts()  
  }

  units$!: Observable<PrimaryUnit[]>;
  getUnits(){
    this.units$ = this.adminService.getPrimaryUnit()
  }

  categories$!: Observable<Category[]>;
  getCategories(){
    this.categories$ = this.adminService.getCategory()
  }

  brands: any;
  getBrands(){
    return this.adminService.getBrand().subscribe((res)=>{
      this.brands = res ;
    })
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.submitSubscription = this.adminService.addProduct(this.productForm.getRawValue()).subscribe((res)=>{
      console
      this._snackBar.open("Product added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getProducts()
    this.productForm.reset()
    this.productForm.setErrors(null)
    Object.keys(this.productForm.controls).forEach(key=>{this.productForm.get(key)?.setErrors(null)})
  }

  products : Product[]=[];
  getProducts(){
    return this.adminService.getProduct().subscribe((res)=>{
      this.products = res
    })
  }

  // loadBrand(){
  //   this.getBrands();
  // }

  deleteProduct(id:any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteProduct(id).subscribe((res)=>{
          this.getProducts()
          this._snackBar.open("Product deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })

  }

  isEdit = false
  productId :any;
  
  editProduct(id:any){
    this.isEdit=true;
    
    let product : any = this.products.find(x=>x.id==id);

      let productName = product.productName.toString()
      let code = product.code.toString()
      let barCode = product.barCode.toString()
      let primaryUnitId = product.primaryUnitId
      let categoryId = product.categoryId
      let brandId = product.brandId
      let reorderQuantity = product.reorderQuantity
      let loyaltyPoint = product.loyaltyPoint
    
    this.productForm.patchValue({
      productName:productName,
      code:code,
      barCode:barCode,
      primaryUnitId:primaryUnitId,
      categoryId:categoryId,
      brandId:brandId,
      reorderQuantity:reorderQuantity,
      loyaltyPoint:loyaltyPoint
    })
    this.productId = id;
  }

  editFunction(){
    let data = {
      productName  : this.productForm.get('productName')?.value,
      code : this.productForm.get('code')?.value,
      barCode : this.productForm.get('barCode')?.value,
      primaryUnitId : this.productForm.get('primaryUnitId')?.value,
      categoryId : this.productForm.get('categoryId')?.value,
      brandId : this.productForm.get('brandId')?.value,
    }
    this.adminService.updateProduct(this.productId,data).subscribe((res)=>{
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  addCatrgory(){
    this.router.navigateByUrl('admin/category')
  }

  addBrand(){
    this.router.navigateByUrl('admin/brand')
  }

  addUnit(){
    this.router.navigateByUrl('admin/unit')
  }

  homeClick(){
    const dialogRef = this.dialog.open(ProductManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

}