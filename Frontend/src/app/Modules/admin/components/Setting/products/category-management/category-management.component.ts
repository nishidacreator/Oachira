import { Subscription } from 'rxjs';
import { AdminService } from '../../../../admin.service';
import { Component, Inject, OnDestroy, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../../models/settings/category';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnDestroy{
  categoryList: any[] = []; // Assuming you have the category data here
  // showImagePopup = false;
  selectedImageUrl = '';

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CategoryManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy(){
    this.categorySubscription?.unsubscribe()
    this.submitSubscription?.unsubscribe()
  }
    
  productCategoryForm = this.fb.group({
    category_image: [''],
    categoryName: ['', Validators.required],
    taxable: [false],

  });

  addStatus!: string
  ngOnInit(): void {
    this.categorySubscription = this.getCategory();

    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    }
  }
  // openImagePopup(imageUrl: string): void {
  //   this.selectedImageUrl = imageUrl;
  //   this.showImagePopup = true;
  // }

  // closeImagePopup(): void {
  //   this.showImagePopup = false;
  // }


  displayedColumns : string[] = ['categoryImage','categoryName', 'taxable', 'manage']

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

  // formData = new FormData();
  // onUpload(){  
  //   if(!this.file){
  //     this._snackBar.open("Please choose an image first","" ,{duration:3000})
  //   }

  //   else{
  //     this.formData.append("category_image", this.file, this.file.name)
  //     this._snackBar.open("Image Uploaded","" ,{duration:3000})
  //   } 
  // }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    const formData = new FormData();
    formData.append("category_image", this.file as Blob, this.file?.name)
    this._snackBar.open("Image Uploaded","" ,{duration:3000})
    formData.append('categoryName', this.productCategoryForm.get(['categoryName'])?.value)
    formData.append('taxable', this.productCategoryForm.get(['taxable'])?.value);
    console.log(formData)

    this.submitSubscription = this.adminService.addCategory(formData).subscribe((res)=>{
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
    return this.adminService.getPaginatedCategory(this.filterValue, this.currentPage, this.pageSize).subscribe((res:any)=>{
      this.category = res.items;
        this.totalItems = res.count;
    })
  } 


  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  
  filterValue = "";
  search() {
    if (this.filterValue) {
      this.getCategory();
    }
  }
 
  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getCategory();
    }
  }


  deleteCategory(id:any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
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
    debugger;
      
    let categoryName = category.categoryName.toString();
    let taxable = category.taxable.toString();
    let category_image = category.category_image;
    
    // let reader: any = new FileReader();
    //     reader.readAsDataURL(category_image)
    //     reader.onload = (event: any) =>{
    //       this.url = event.target.result;
    //     }   
    console.log(category_image)
    
    this.productCategoryForm.patchValue({
      categoryName : categoryName,
      taxable : taxable
    })
    this.categoryId = id;
    this.productCategoryForm.get('category_image')?.setValue(category_image);
  }
  
  editFunction(){
    let data={
      categoryName  : this.productCategoryForm.get('categoryName')?.value,
      taxable : this.productCategoryForm.get('taxable')?.value,
      category_image : this.productCategoryForm.get('category_image')?.value
    }
    if (this.selectedImageUrl) {
      this.uploadImageAndSubmit(data);
    } else {
      this.submitCategoryData(data);
    }
    // this.adminService.updateCategory(this.categoryId,data).subscribe((res)=>{
    //   this.clearControls();
    // },(error=>{
    //       alert(error.message)
    //     }))
  }
  uploadImageAndSubmit(data: any) {
    // Upload the new image using your image upload service (e.g., Cloudinary)
    // After successful upload, update the data object with the new image URL
    // data.categoryImage = uploadedImageUrl;
  
    this.submitCategoryData(data);
  }
  
  // Submit the category data
  submitCategoryData(data: any) {
    this.adminService.updateCategory(this.categoryId, data).subscribe(
      (res) => {
        this.clearControls();
      },
      (error) => {
        alert(error.message);
      }
    );
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


  showImagePopup= false;

  showPopup() {
    this.showImagePopup = true;
  }

  hidePopup() {
    this.showImagePopup = false;
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

 @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCategory();
  }

}