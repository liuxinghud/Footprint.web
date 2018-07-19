import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Servicebase } from './servicebase';
import { UserModel } from '../models/userinfo';
import { HttpParams } from '../../../node_modules/@angular/common/http';
@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private cfg: ConfigService, public servicebase: Servicebase) {

  }
  public getUserList(params:HttpParams, showloading: boolean = true) {
    let url = this.cfg.urls.userlist;
   
    return this.servicebase.getList<UserModel>(url, params, showloading);
  }


  public getUserCount() {
    let url = this.cfg.urls.usercount;
    return this.servicebase.getdata<number>(url);

  }


}
