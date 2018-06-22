import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal-layout',
  templateUrl: './portal-layout.component.html',
  styleUrls: ['./portal-layout.component.css']
})
export class PortalLayoutComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
    if (this.route.url == "/portal") {
      this.route.navigateByUrl('/Portal/mvc');
    }

  }


}
