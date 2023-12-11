import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { BranchAccount } from 'src/app/Modules/admin/models/settings/branchAccount';

@Component({
  selector: 'app-branch-account',
  templateUrl: './branch-account.component.html',
  styleUrls: ['./branch-account.component.scss']
})
export class BranchAccountComponent implements OnInit {

  ngOnDestroy(){
    this.accountSub.unsubscribe();
  }

  constructor(@Optional() public dialogRef: MatDialogRef<BranchAccountComponent>,
  @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private adminService: AdminService) { }

  ngOnInit(): void {
    this.getAccount()
  }

  account : BranchAccount[] = [];
  accountSub!: Subscription;
  getAccount(){
    this.accountSub = this.adminService.getBranchAccountByBranchId(this.dialogData.id).subscribe(res=>{
      this.account = res;
      console.log(this.account)
    })
  }

  onCancelClick(){
    this.dialogRef.close(); 
  }

}
