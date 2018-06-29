import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AccountService } from '../../../../providers/account.service';
import { MessageService, MessageType } from '../../../../providers/message.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../providers/auth.service';
import { UserModel } from '../../../../models/userinfo';
import { HttpErrorResponse } from '../../../../../../node_modules/@angular/common/http';
import { Utilities } from '../../../../providers/utinities';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;
  constructor(private fb: FormBuilder, private authservice: AuthService, private msg: MessageService, private router: Router) { }
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
      ]),
      password: ['', [
        Validators.required,
      ]],
      rememberme: [false]
    });

  }


  login() {
    this.msg.startLoading();
    let formvl = this.loginForm.getRawValue();
    this.authservice.login(formvl.username, formvl.password, formvl.rememberme).subscribe((x: UserModel) => {
      let redirecturl = this.authservice.loginRedirectUrl || '/portal/mvc';
      this.router.navigateByUrl(redirecturl);
      this.msg.stopLoading();
    }, (err: HttpErrorResponse) => {
      this.msg.stopLoading();
      this.errorhandler(err);
    });
  }

  errorhandler(error: HttpErrorResponse) {
    debugger;
    if (error.status == 404) {
      this.msg.showMessage("Not Found Error", "请求的地址未找到", MessageType.error);
    } else if (error.status == 0) {
      this.msg.showMessage("No NetWork", "网络链接失败，请检查网络", MessageType.error);
    } else if (error.status == 401) {
      this.msg.showMessage("Unauthorized", "用户没有权限访问此链接", MessageType.error);
    } else if (error.status == 500) {
      this.msg.showMessage("Internal Error", "服务器内部错误请联系管理员", MessageType.error);
    } else if (error.status == 400) {

      if (error.error && error.error.code) {
        let control = this.loginForm.controls[error.error.code];
        control.setErrors(Validators.required)
        this.msg.showMessage(error.error.code,error.error.error_description||error.statusText,MessageType.error);
      }else{
        this.msg.showMessage("",error.error.error_description||error.statusText,MessageType.error);
      }

    } else if (error.name == "TimeoutError") {
      this.msg.showMessage("TimeOut Error", "请求超时", MessageType.error);

    } else {
     this.msg.showMessage(error.status.toString(),error.statusText,MessageType.error);
    }
  }



}
