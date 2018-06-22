import { Injectable } from '@angular/core';
import { User, SigninResponse } from 'oidc-client';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { debug } from 'util';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AccountService {
  currentUser: User;
  loggedIn: boolean;
  constructor(private http: HttpClient ) { }
  localLogin(username: string, password: string) {
    return this.http.post('api/authorization/token', {
      UserName: username,
      Password: password,
      RememberMe: true
    }, this.getRequestHeaders()).
      subscribe((response: any) => {
        let user = response;
        debugger;
        if (user && user.access_token) {
          this.currentUser = JSON.parse(JSON.stringify(user));
        }
      }, (err: HttpErrorResponse) => {
        debugger;
        Observable.throw(err);
      }
      );
  }
  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + '',
      'Content-Type': 'application/json',
      'Accept': `application/json, text/plain, */*`,
    });

    return { headers: headers };
  }
}
