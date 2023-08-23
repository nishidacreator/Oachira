import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-counter-view',
  templateUrl: './counter-view.component.html',
  styleUrls: ['./counter-view.component.scss']
})
export class CounterViewComponent implements OnInit{

  status: boolean = false;

constructor(private fb:FormBuilder){}

ngOnInit():void{

}


  billForm = this.fb.group({
    membership: [''],
    mobileNo:[''],
    customerName:[''],
    address:[''],
    salesMan:['',Validators.required],
    deliveryBoy:[''],
    billType:[''],
    billDate:['',Validators.required],
    billNo:['',Validators.required]
  });


  itemsListForm = this.fb.group({
    items: this.fb.array([]),
  });


  items(): FormArray {
    return this.itemsListForm.get("items") as FormArray;
  }

  newItem(): FormGroup {
    return this.fb.group({
      slNo: ["", Validators.required],
      itemCode: ["", Validators.required],
      itemName: ["", Validators.required],
      quantity: ["", Validators.required],
      unit: ["", Validators.required],
      rate: ["", Validators.required],
      amount: ["", Validators.required],
    });
  }

  addProduct() {  
    this.status = true;
    this.items().push(this.newItem()); 
  } 






















  billedItems: { name: string; price: number }[] = []; // Array to store billed items

  // Add an item to the billedItems array
  addItem(name: string, price: number) {
    this.billedItems.push({ name, price });
  }

  // Calculate the total amount to be paid
  calculateTotal(): number {
    return this.billedItems.reduce((total, item) => total + item.price, 0);
  }

  // Clear the billedItems array
  clearBilling() {
    this.billedItems = [];
  }
}





 





  