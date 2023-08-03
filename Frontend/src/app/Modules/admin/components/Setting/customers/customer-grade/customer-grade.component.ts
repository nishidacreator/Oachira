import { CustomerGrade } from '../../../../models/customer/customerGrade';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../../admin.service';
import { Subscription } from 'rxjs';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';

@Component({
  selector: 'app-customer-grade',
  templateUrl: './customer-grade.component.html',
  styleUrls: ['./customer-grade.component.scss']
})
export class CustomerGradeComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog){}

  ngOnDestroy() {
    this.gradeSubscription?.unsubscribe()
    this.submitSubscription.unsubscribe()
  }

  customerGradeForm = this.fb.group({

    grade: ['', Validators.required],
    gradeRemarks : ['']
  });

  displayedColumns : string[] = ['id','grade', 'gradeRemarks', 'manage']

  ngOnInit(): void {
    this.gradeSubscription = this.getGrade()
  }

  homeClick(){
    const dialogRef = this.dialog.open(CustomerManagementComponent, {
      height: '200px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  private submitSubscription : Subscription = new Subscription();
  onSubmit(){
    this.adminService.addCustomerGrade(this.customerGradeForm.getRawValue()).subscribe((res)=>{
      this._snackBar.open("Customer Grade added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  clearControls(){
    this.getGrade()
    this.customerGradeForm.reset()
    this.customerGradeForm.setErrors(null)
    Object.keys(this.customerGradeForm.controls).forEach(key=>{this.customerGradeForm.get(key)?.setErrors(null)})
  }

  grades: CustomerGrade[] = [];
  gradeSubscription? : Subscription;
  getGrade(){
    return this.adminService.getCustomerGrade().subscribe((res)=>{
      this.grades = res
    })
  }   

  deleteBrand(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService.deleteCustomerGrade(id).subscribe((res)=>{
          this.getGrade()
          this._snackBar.open("Grade deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  gradeId : any;
  editBrand(id : any){
    this.isEdit = true;
    //Get the product based on the ID
    let customerGrade: any = this.grades.find(x =>x.id == id)
    
    //Populate the object by the ID
    let grade = customerGrade.grade.toString();
    let gradeRemarks = customerGrade.gradeRemarks.toString();
    
    this.customerGradeForm.patchValue({
      grade : grade,
      gradeRemarks : gradeRemarks
    })
    this.gradeId = id;
  }

  editFunction(){
    this.isEdit = false;

    let data: any ={
      grade : this.customerGradeForm.get('grade')?.value,
      gradeRemarks : this.customerGradeForm.get('gradeRemarks')?.value
    }
    
    this.adminService.updateCustomerGrade(this.gradeId, data).subscribe((res)=>{
      this._snackBar.open("Grade updated successfully...","" ,{duration:3000})
      this.clearControls();
    },(error=>{
          alert(error.message)
        }))
  }
}

