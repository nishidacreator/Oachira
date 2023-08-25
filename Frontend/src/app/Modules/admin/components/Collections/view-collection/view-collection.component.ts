import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { DailyCollection } from 'src/app/Modules/salesexecutive/models/dailyCollection';
import { SalesExecutiveService } from 'src/app/Modules/salesexecutive/sales-executive.service';
import { AdminService } from '../../../admin.service';
import { User } from '../../../models/user';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Product } from '../../../models/product';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from 'src/app/Modules/shared-components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.scss']
})
export class ViewCollectionComponent implements OnInit {

  
  constructor(private sEService: SalesExecutiveService, private adminService: AdminService, private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.collectionSubscription.unsubscribe()
    this.userSubscription.unsubscribe()
  }

  id: any;
  ngOnInit(): void {
    this.collectionSubscription = this.getCollection()
    this.userSubscription = this.getUser()
  }

  filteredOptions!: Observable<User[]>;
  searchControl = new FormControl();
  users: User[] = [];
  userSubscription!: Subscription;
  getUser() {
    return this.adminService.getUser().pipe(map(x=> x.filter(y => y.role.roleName.toLowerCase() === 'salesexecutive')))
    .subscribe((res) => {
      this.users = res;

      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.users.slice();
        })
      );
    });
  }

  filterOptions(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  displayedColumns : string[] = ['id', 'salesExecutiveId','customerId', 'amount', 'invoiceNo', 'paymentMode','remarks']

  collection: DailyCollection[] = []
  collectionSubscription!: Subscription
  getCollection(){
    return this.sEService.getCollection().subscribe((res)=>{
      this.collection = res
      this.filteredCollection = this.collection
    })
  }

  filteredCollection : DailyCollection[] = []
  getCollectionByUser(id : number){
    this.filteredCollection = this.collection.filter(x => x.salesExecutiveId === id)
  }

  isEdit = false;
  brandId : any;
  editCollection(id : number){
    this.isEdit = true;
    //Get the product based on the ID
    let dc: any= this.collection.find(x =>x.id == id)
    
    // //Populate the object by the ID
    // let brandName = dc.brandName.toString();
    
    // this.brandForm.patchValue({brandName : brandName})
    // this.brandId = id;
  }

  deleteCollection(id : number){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.sEService.deleteCollection(id).subscribe((res)=>{
          this.getCollection()
          this._snackBar.open("Collection deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

}

