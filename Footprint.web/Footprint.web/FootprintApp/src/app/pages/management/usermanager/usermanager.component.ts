import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../providers/account.service';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.css']
})
export class UsermanagerComponent implements OnInit {
  constructor(private accountsrv:AccountService) { }
  ngOnInit() {}



  
}
