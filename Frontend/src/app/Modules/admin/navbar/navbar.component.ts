import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isExpanded : boolean = false;

  userName: any
  branchName!: string;
  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router,
    private adminService: AdminService) {
    const token: any = localStorage.getItem('token')
    let user = JSON.parse(token)
    console.log(user)
    this.userName = user.name

    let branchId = user.branch
    adminService.getBranchById(branchId).subscribe(data => {
      this.branchName = data.branchName
    })
    
  }

  logout(){
    this.authService.logout()
    this.router.navigate([''])
  }


}
