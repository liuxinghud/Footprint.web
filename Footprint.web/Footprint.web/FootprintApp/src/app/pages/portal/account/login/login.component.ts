import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AccountService } from '../../../../providers/account.service';
import { MessageService } from '../../../../providers/message.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;
  constructor(private fb: FormBuilder,private account:AccountService,private msg:MessageService) { }
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
    let l = this.loginForm.getRawValue();
      this.account.localLogin(l.username,l.password)
  }

}
