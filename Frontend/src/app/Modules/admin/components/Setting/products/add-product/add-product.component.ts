import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Category } from '../../../../models/settings/category';
import { Product } from '../../../../models/settings/product';
import { SecondaryUnit } from '../../../../models/settings/secondaryUnit';
import { PrimaryUnit } from 'src/app/Modules/admin/models/settings/primaryUnit';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UnitManagementComponent } from '../unit-management/unit-management.component';
import { CategoryManagementComponent } from '../category-management/category-management.component';
import { BrandManagementComponent } from '../brand-management/brand-management.component';

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
    this.unitSub.unsubscribe()
    this.catSub.unsubscribe()
  }

  productForm = this.fb.group({
    productName: ['', Validators.required],
    code: [''],
    barCode: [''],
    primaryUnitId: ['', Validators.required],
    categoryId: ['', Validators.required],
    brandId: ['', Validators.required],
    reorderQuantity: [],
    loyaltyPoint: [],
    product_image: [null],
  });

  displayedColumns : String[] = ['id','productName','code','barCode','primaryUnitId','categoryId','brandId','image','manage']

  brandSubscription? : Subscription;
  productSubscription? : Subscription;
  ngOnInit(): void {
    this.getUnits();
    this.getCategories();
    
    this.brandSubscription = this.getBrands()
    this.productSubscription = this.getProducts()  
  }

  units: PrimaryUnit[] = [];
  unitSub!: Subscription
  getUnits(){
    this.unitSub = this.adminService.getPrimaryUnit().subscribe((res)=>{
      this.units = res
    })
  }

  categories: Category[] = [];
  catSub!: Subscription
  getCategories(){
    this.catSub = this.adminService.getCategory().subscribe((res)=>{
    this.categories = res
    })
  }

  brands: any;
  getBrands(){
    return this.adminService.getBrand().subscribe((res)=>{
      this.brands = res ;
    })
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    const formData = new FormData();
    formData.append("product_image", this.file as Blob, this.file?.name)
    this._snackBar.open("Image Uploaded","" ,{duration:3000})
    console.log(this.productForm.getRawValue())
    this.submitSubscription = this.adminService.addProduct(this.productForm.getRawValue()).subscribe((res)=>{
      console.log(res)
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
  dataSource! : MatTableDataSource<any>
  getProducts(){
    return this.adminService.getProduct().subscribe((res)=>{
      this.products = res
      this.filtered = this.products.slice(0, this.pageSize);
      // this.paginatedData = this.filtered.slice(0, this.pageSize);
    })
  }

  pageSize = 10;
  pageIndex = 0;
  paginatedData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    this.filtered = this.products.slice(startIndex, startIndex + event.pageSize);
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.products.filter(element =>
        element.productName.toLowerCase().includes(filterValue) 
        // && element.code.toLowerCase().includes(filterValue)
        // && element.barCode.toLowerCase().includes(filterValue)
      );
    }
    else{
      this.getProducts()
    } 
  }


  deleteProduct(id:any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
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
    const dialogRef = this.dialog.open(CategoryManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories()
    })
  }

  addBrand(){
    const dialogRef = this.dialog.open(BrandManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBrands()
    })
  }

  addUnit(){
    const dialogRef = this.dialog.open(UnitManagementComponent, {
      data: {status : 'true'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUnits()
    }) 
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

  file:File | null = null;
  url!: any;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.file = event.target.files[0] as File;
      console.log(this.file)

      let fileType = this.file? this.file.type : '';
      // this.productCategoryForm.get('category_image')?.setValue(this.file)
  
      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }   
      // }
      // else {
      //   window.alert('Please select correct image format');
      // } 
    }
  }


  showImagePopup= false;

  showPopup() {
    this.showImagePopup = true;
  }

  hidePopup() {
    this.showImagePopup = false;
  }

}