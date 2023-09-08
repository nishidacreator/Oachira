import { Brand } from '../../../../models/settings/brand';
import { DeleteDialogueComponent } from '../../../../../shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Component, Inject, OnDestroy, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnDestroy {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<BrandManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
    ){}

  ngOnDestroy() {
    this.brandSubscription?.unsubscribe()
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
  }

  brandForm = this.fb.group({
    brandName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  addStatus!: string
  ngOnInit(): void {
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
    } 

    this.getBrands()
  }

  submit!: Subscription
  onSubmit(){
    this.submit = this.adminService.addBrand(this.brandForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Brand added successfully...","" ,{duration:3000})
      this.getBrands()
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.brandForm.reset()
    this.brandForm.setErrors(null)
    Object.keys(this.brandForm.controls).forEach(key=>{this.brandForm.get(key)?.setErrors(null)})
  }

  brands: Brand[] = [];
  brandSubscription? : Subscription
  dataSource! : MatTableDataSource<Brand>
  getBrands(){
    this.brandSubscription = this.adminService.getBrand().subscribe((res)=>{
      this.brands = res
      this.filteredBrands = this.brands.slice(0, this.pageSize);
      // this.filteredBrands = this.paginatedData
    })
  } 

  pageSize = 10;
  pageIndex = 0;
  paginatedData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    this.filteredBrands = this.filteredBrands.slice(startIndex, startIndex + event.pageSize);
  }
  
  filterValue: any;
  filteredBrands!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.filteredBrands = this.brands.filter(element =>
      element.brandName.toLowerCase().includes(filterValue)
    );
  }

  delete!: Subscription;
  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteBrand(id).subscribe((res)=>{
          this.getBrands()
          this._snackBar.open("Brand deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  brandId : any;
  editBrand(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let brand: any= this.brands.find(x =>x.id == id)
    
    //Populate the object by the ID
    let brandName = brand.brandName.toString();
    
    this.brandForm.patchValue({brandName : brandName})
    this.brandId = id;
  }

  edit!:Subscription;
  editFunction(){
    this.isEdit = false;

    let data: any ={
      brandName : this.brandForm.get('brandName')?.value
    }
    
    this.edit = this.adminService.updateBrand(this.brandId, data).subscribe((res)=>{
      this._snackBar.open("Brand updated successfully...","" ,{duration:3000})
      this.getBrands();
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
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

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
