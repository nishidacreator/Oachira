import { Brand } from '../../../../models/brand';
import { DeleteDialogueComponent } from '../../../../../shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnDestroy {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.brandSubscription?.unsubscribe()
    this.submitSubscription?.unsubscribe()
  }

  brandForm = this.fb.group({
    brandName: ['', Validators.required]
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  ngOnInit(): void {
    this.brandSubscription = this.getBrands()
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.submitSubscription = this.adminService.addBrand(this.brandForm.getRawValue()).subscribe((res)=>{
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
    return this.adminService.getBrand().subscribe((res)=>{
      this.brands = res
      // this.dataSource = this.brands
    })
  } 
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteBrand(id).subscribe((res)=>{
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

  editFunction(){
    this.isEdit = false;

    let data: any ={
      brandName : this.brandForm.get('brandName')?.value
    }
    
    this.adminService.updateBrand(this.brandId, data).subscribe((res)=>{
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
}
