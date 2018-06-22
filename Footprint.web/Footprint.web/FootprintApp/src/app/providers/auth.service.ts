import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '../../../node_modules/@angular/router';
import { ConfigService } from './config.service';
import { User } from '../models/user';

@Injectable({providedIn: 'root'})
export class AuthService {
  isLoggedIn: any;
  public get loginUrl() { return this.cfg.urls.baseUrl; }
    public loginRedirectUrl: string;
    public logoutRedirectUrl: string;

    public reLoginDelegate: () => void;

    private previousIsLoggedInCheck = false;
    private _loginStatus = new Subject<boolean>();


    constructor(private router: Router, private cfg: ConfigService) {
        // this.initializeLoginStatus();
    }

//     private initializeLoginStatus() {
//       this.localStorage.getInitEvent().subscribe(() => {
//           this.reevaluateLoginStatus();
//       });
//   }

//   private reevaluateLoginStatus(currentUser?: User) {

//     let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
//     let isLoggedIn = user != null;

//     if (this.previousIsLoggedInCheck != isLoggedIn) {
//         setTimeout(() => {
//             this._loginStatus.next(isLoggedIn);
//         });
//     }

//     this.previousIsLoggedInCheck = isLoggedIn;
// }

}
