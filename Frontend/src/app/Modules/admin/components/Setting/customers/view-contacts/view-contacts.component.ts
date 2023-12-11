import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { CustomerPhone } from 'src/app/Modules/admin/models/customer/customerPhone';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.scss']
})
export class ViewContactsComponent implements OnInit {
  ngOnDestroy(){
    this.contactSub.unsubscribe();
    this.emailSub.unsubscribe();
  }

  constructor(@Optional() public dialogRef: MatDialogRef<ViewContactsComponent>,
  @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private adminService: AdminService) { }

  ngOnInit(): void {
    this.getContact();
    this.getcustomerEmail();
  }

  contact : CustomerPhone[] = [];
  contactSub!: Subscription;
  getContact(){
    this.contactSub = this.adminService.getCustomerPhoneByCustomerId(this.dialogData.id).subscribe(res=>{
      this.contact = res;
      console.log(this.contact);
    })
  }

  email! : string;
  emailSub!: Subscription;
  getcustomerEmail(){
    this.adminService.getCustomerById(this.dialogData.id).subscribe(res=>{
      this.email = res.email;
    })
  }                                 

  onCancelClick(){
    this.dialogRef.close(); 
  }
}
