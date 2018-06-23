import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AccountService } from '../../../../providers/account.service';
import { MessageService } from '../../../../providers/message.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;
  constructor(private fb: FormBuilder, private account: AccountService, private msg: MessageService, private router: Router) { }
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
    this.account.localLogin(l.username, l.password).subscribe(x => {
      this.account.currentUser = x;
      this.account.loggedIn = true;

      localStorage.setItem('currentUser', JSON.stringify(x));
      this.router.navigateByUrl("/portal/mvc");
    }, err => {

    });
  }

}
