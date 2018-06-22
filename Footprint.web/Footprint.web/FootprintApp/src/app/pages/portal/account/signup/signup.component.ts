import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '../../../../../../node_modules/@angular/router';
import { CompareDirective } from '../../../../directives/compare.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  hide = true;
  get account() { return this.signupForm.get('account'); }
  get password() { return this.signupForm.get('password'); }
  get repassword() { return this.signupForm.get('repassword'); }
  get name() { return this.signupForm.get('name'); }
  constructor(private fb: FormBuilder,private route:Router) {}
  ngOnInit() {
    this.signupForm = this.fb.group({
      account: ['', [Validators.required, Validators.email]
      ],
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")]]
      ,
      repassword: ['', [Validators.required, CompareDirective.bind(this)]],
      name: ['', [Validators.required]],
    });
  }

}
