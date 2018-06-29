import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Servicebase } from './servicebase';
import { UserModel } from '../models/userinfo';
@Injectable({ providedIn: 'root' })
export class AccountService {
  page: number = 1;
  pagesize: number = 10;
  userlist:UserModel[];
  constructor(private cfg: ConfigService, private service: Servicebase) {

  }



  public getUserList(page: number, pagesize: number) {

    let url = this.cfg.urls.userlist + `/${page}` + `/${pagesize}`;
    this.service.getList<UserModel>(url).subscribe(x=>{
       
    })
  }





  authTest() {
    debugger;
    this.service.getdata('api/sampleData/test').subscribe(x => {
      debugger;
    }, error => {
      debugger;
    })
    //  this.http.get('api/sampleData/test',{headers:this.service. }).subscribe(x=>{
    //    debugger;
    //  }
    // ,error=>{
    //   debugger;
    // })


  }




}
