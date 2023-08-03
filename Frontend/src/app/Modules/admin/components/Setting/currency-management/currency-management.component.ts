import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryManagementComponent } from '../products/category-management/category-management.component';

@Component({
  selector: 'app-currency-management',
  templateUrl: './currency-management.component.html',
  styleUrls: ['./currency-management.component.scss']
})
export class CurrencyManagementComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CurrencyManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  currencyForm = this.fb.group({

    currencyCode: ['', Validators.required],
    currencyName: ['', Validators.required],
    exchangeValue: ['in INR', Validators.required]
  });

  ngOnInit(): void {}


  onSubmit(){}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
