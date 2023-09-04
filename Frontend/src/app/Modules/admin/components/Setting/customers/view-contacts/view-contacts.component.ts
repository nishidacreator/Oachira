import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { CustomerPhone } from 'src/app/Modules/admin/models/customer/customerPhone';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.scss']
})
export class ViewContactsComponent implements OnInit {

  constructor(@Optional() public dialogRef: MatDialogRef<ViewContactsComponent>,
  @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private adminService: AdminService) { }

  ngOnInit(): void {
    this.getContact();
    this.getcustomerEmail();
  }

  contact : CustomerPhone[] = [];
  getContact(){
    this.adminService.getCustomerPhoneByCustomerId(this.dialogData.id).subscribe(res=>{
      this.contact = res;
    })
  }

  email! : string;
  getcustomerEmail(){
    this.adminService.getCustomerById(this.dialogData.id).subscribe(res=>{
      this.email = res.email;
    })
  }                                 

}
