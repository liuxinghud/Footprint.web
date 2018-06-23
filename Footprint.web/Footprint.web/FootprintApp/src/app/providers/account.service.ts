import { Injectable } from '@angular/core';
import { User, SigninResponse } from 'oidc-client';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take, catchError, subscribeOn } from 'rxjs/operators';
import { ConfigService } from './config.service';
@Injectable({ providedIn: 'root' })
export class AccountService {
  currentUser: User;
  loggedIn: boolean;
  constructor(private http: HttpClient, private cfg: ConfigService) { }
  localLogin(username: string, password: string): Observable<any> {
    return this.http.post(this.cfg.urls.login, {
      UserName: username,
      Password: password,
      RememberMe: true
    }, this.getRequestHeaders()).pipe(catchError(x => { return Observable.throw(x); }))


    //   let user = response;
    //   debugger;
    //   if (user && user.access_token) {
    //     this.currentUser = JSON.parse(JSON.stringify(user));
    //   }
    // }, (err: HttpErrorResponse) => {
    //   debugger;
    //   Observable.throw(err);
    // }
    // );
  }


authTest(){
  debugger;

  let a=this.currentUser;
   this.http.get('api/sampleData/test',this.getRequestHeaders()).subscribe(x=>{
     debugger;
   }
  ,error=>{
    debugger;
  }
  
  )
} 



  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    debugger;
    // let headers = new HttpHeaders({
    //   'Authorization': 'Bearer ' +(this.currentUser?this.currentUser.access_token:''),
    //   'Content-Type': 'application/json',
    //   'Accept': `application/json, text/plain, */*`,
    // });
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.access_token) {
        let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.access_token });
        return { headers: headers };
    }
   // return { headers: headers };
  }


  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.access_token });
        return { headers: headers };
    }
}


}
