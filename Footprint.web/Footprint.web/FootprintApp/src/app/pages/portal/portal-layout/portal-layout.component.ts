import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../../models/userinfo';
import { AuthService } from '../../../providers/auth.service';
import { PermissionValues } from '../../../models/permission.model';

@Component({
  selector: 'app-portal-layout',
  templateUrl: './portal-layout.component.html',
  styleUrls: ['./portal-layout.component.css']
})
export class PortalLayoutComponent implements OnInit {
  currentuser: UserModel;
  permission: PermissionValues[];
  islogin: boolean;
  constructor(private route: Router, private authservice: AuthService) { }

  ngOnInit() {
    this.currentuser = this.authservice.currentUser;
    this.permission = this.authservice.userPermissions
    this.authservice.getLoginStatusEvent().subscribe(x => {
      this.islogin = x;
    })
  
    if (this.route.url == "/portal") {
      this.route.navigateByUrl('/Portal/mvc');
    }

  }


}
