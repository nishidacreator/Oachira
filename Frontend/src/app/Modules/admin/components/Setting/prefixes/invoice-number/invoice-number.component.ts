import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Brand } from 'src/app/Modules/admin/models/settings/brand';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { PurchaseEntry } from 'src/app/Modules/admin/models/purchase/purchaseEntry';

@Component({
  selector: 'app-invoice-number',
  templateUrl: './invoice-number.component.html',
  styleUrls: ['./invoice-number.component.scss']
})
export class InvoiceNumberComponent implements OnInit {

  constructor(private fb: FormBuilder,public adminService: AdminService, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public dialogRef: MatDialogRef<InvoiceNumberComponent>){}

    @Output() dataSubmitted: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy() {

  }

  ivForm = this.fb.group({
    prefix: ['', Validators.required],
    lastNumber: ['', Validators.required],
    date: [''],
    purchaseInvoice: ['']
  });

  displayedColumns : string[] = ['id','brandName', 'manage']

  ngOnInit(): void {
    this.generateInvoiceNum()
  }

  purchases: PurchaseEntry[] = [];
  userSub!: Subscription
  ivNum: string = '';
  nextId!: any 
  generateInvoiceNum() {
    this.userSub = this.adminService.getPurchaseEntry().subscribe((res)=>{
      this.purchases = res
      console.log(this.purchases)

       // Check if there are any employees in the array
      if (this.purchases.length > 0) {
        const maxId = this.purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.purchaseInvoice.substring(5), 10);

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
        
      }
      console.log(this.nextId + 'hih')
      this.ivForm.get('lastNumber')?.setValue(this.nextId)


      //   // Pad the ID with leading zeros to ensure a fixed format (e.g., 'EMP001', 'EMP012', etc.)
      //   const paddedId = `${this.nextId.toString().padStart(3, '0')}`;;

      //   // Set the generated employee ID to the 'employeeId' property
      //   this.ivNum = paddedId;
      
      // this.ivForm.get('purchaseInvoice')?.setValue(this.ivNum)
    })

  }

  invoiceNumber! : string;
  onSubmit(){
    const rdate: any = this.ivForm.get('date')?.value;
    const date: any = new Date(rdate);
    

      const lastNumber: any = this.ivForm.get('lastNumber')?.value ;
      const nextNumber = lastNumber + 1;
      this.invoiceNumber = `${this.ivForm.value.prefix}${ nextNumber }`;
      this.ivForm.get('purchaseInvoice')?.setValue(this.invoiceNumber)

      let data ={
        invoiceNum : this.invoiceNumber
      }

      this.dataSubmitted.emit(data);
      this.dialogRef.close(data);

  }

  clearControls(){
    this.ivForm.reset()
    this.ivForm.setErrors(null)
    Object.keys(this.ivForm.controls).forEach(key=>{this.ivForm.get(key)?.setErrors(null)})
  }

  // homeClick(){
  //   const dialogRef = this.dialog.open(ManagePrefixesComponent, {
  //     height: '200px',
  //     width: '800px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   })
  // }
}

