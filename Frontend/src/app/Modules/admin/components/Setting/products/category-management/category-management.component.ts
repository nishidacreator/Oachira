import { Subscription } from 'rxjs';
import { AdminService } from '../../../../admin.service';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../../models/category';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ProductManagementComponent } from '../product-management/product-management.component';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnDestroy{

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy(){
    this.categorySubscription?.unsubscribe()
    this.submitSubscription?.unsubscribe()
  }
    
  productCategoryForm = this.fb.group({
    category_image: [''],
    categoryName: ['', Validators.required],
    taxable: [false],

  });

  ngOnInit(): void {
    this.categorySubscription = this.getCategory();
  }

  displayedColumns : string[] = ['categoryName', 'taxable', 'manage']

  file!: any;
  url!: any;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.file = event.target.files[0];

      let fileType = this.file.type;
      // this.productCategoryForm.get('category_image')?.setValue(this.file)
  
      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }   
      // }
      // else {
      //   window.alert('Please select correct image format');
      // } 
    }
  }

  formData = new FormData();
  onUpload(){  
    if(!this.file){
      this._snackBar.open("Please choose an image first","" ,{duration:3000})
    }

    else{
      this.formData.append("category_image", this.file, this.file.name)
      this._snackBar.open("Image Uploaded","" ,{duration:3000})
    } 
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.formData.append('categoryName', this.productCategoryForm.get(['categoryName'])?.value)
    this.formData.append('taxable', this.productCategoryForm.get(['taxable'])?.value)

    this.submitSubscription = this.adminService.addCategory(this.formData).subscribe((res)=>{
      this._snackBar.open("Category added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getCategory()
    this.productCategoryForm.reset()
    this.productCategoryForm.setErrors(null)
    Object.keys(this.productCategoryForm.controls).forEach(key=>{this.productCategoryForm.get(key)?.setErrors(null)})
  }

  category: Category [] = [];
  categorySubscription? : Subscription
  getCategory(){
    return this.adminService.getCategory().subscribe((res)=>{
      this.category = res
      this.filtered = this.category
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filtered = this.category.filter(element =>
      element.categoryName.toLowerCase().includes(filterValue)
    );
  }

  deleteCategory(id:any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteCategory(id).subscribe((res)=>{
          this.getCategory()
          this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false
  categoryId : any;
  editCategory(id:any){
    this.isEdit=true;

    let category: any= this.category.find(x =>x.id == id)
    console.log(category)
      
    let categoryName = category.categoryName.toString();
    let taxable = category.taxable.toString();
    // let category_image = category.category_image;

    // console.log(typeof category_image)
    
    // let reader: any = new FileReader();
    //     reader.readAsDataURL(category_image)
    //     reader.onload = (event: any) =>{
    //       this.url = event.target.result;
    //     }   
    
    this.productCategoryForm.patchValue({
      categoryName : categoryName,
      taxable : taxable,
      // category_image : reader
    })
    this.categoryId = id;
  }
  
  editFunction(){
    let data={
      categoryImage : this.file.name,
      categoryName  : this.productCategoryForm.get('categoryName')?.value,
      taxable : this.productCategoryForm.get('taxable')?.value
    }
    this.adminService.updateCategory(this.categoryId,data).subscribe((res)=>{
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }

  

  // onUpload(){
  //     const formData = new FormData();
  //     formData.append('categoryImage', this.file, this.file.name);
  //     console.log(formData)
  //   // this.adminService.uploadImage(this.file).subscribe(res=>{
  //   //   console.log(res)
  //   // })
  // }

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