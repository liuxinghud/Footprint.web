import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/internal/Observable';

import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, mergeMap, map, timeoutWith, debounce, timeout } from 'rxjs/operators';
import { LocalStoreManagerService } from './local-store-manager.service';
import { IdToken, UserModel, LoginResponse } from '../models/userinfo';
import { DBkeys } from './dbkeys';
import { JwtHelper } from '../core/jwthelper';
import { PermissionValues } from '../models/permission.model';
import { throwError } from '../../../node_modules/rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public reLoginDelegate: () => void;
    private previousIsLoggedInCheck = false;
    private _loginStatus = new Subject<boolean>();
    isLoggedIn: boolean = false;
    public get loginUrl() { return this.cfg.urls.login; }
    public loginRedirectUrl: string; //登录跳转地址
    public logoutRedirectUrl: string;//登出跳转地址

    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;
    constructor(private router: Router, private cfg: ConfigService, private http: HttpClient, private localStorage: LocalStoreManagerService) {
        this.initializeLoginStatus();
    }
    private initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.reevaluateLoginStatus();
        });
    }
    private reevaluateLoginStatus(currentUser?: UserModel) {
        let user = currentUser || this.localStorage.getDataObject<UserModel>(DBkeys.CURRENT_USER);
        this.isLoggedIn = user != null;
        if (this.previousIsLoggedInCheck != this.isLoggedIn) {
            setTimeout(() => {
                this._loginStatus.next(this.isLoggedIn);
            });
        }
        this.previousIsLoggedInCheck = this.isLoggedIn;
    }

    //注销方法
    redirectLogoutUser() {
        let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    }
    //登录方法
    redirectForLogin() {
        this.loginRedirectUrl = this.router.url;
        this.router.navigate([this.loginUrl]);
    }

    //重新登录
    reLogin() {
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }

    refreshLogin(): Observable<LoginResponse> {
        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('grant_type', 'refresh_token')
            .append('scope', 'openid email phone profile roles');

        let requestBody = params.toString();

        return this.http.post<LoginResponse>(this.loginUrl, requestBody, { headers: header }).pipe(catchError(error => { return this.handleError(error, () => this.refreshLogin()) }));




        // return this.endpointFactory.getRefreshLoginEndpoint<LoginResponse>()
        //     .map(response => this.processLoginResponse(response, this.rememberMe));
    }

    login(username: string, password: string, rememberMe: boolean = false): Observable<UserModel> {
        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let params = new HttpParams()
            .append('username', username)
            .append('password', password)
            .append('grant_type', 'password')
            .append('scope', 'openid email phone profile roles')
            .append('resource', window.location.origin);
        let requestBody = params.toString();
        return this.http.post<LoginResponse>(this.cfg.urls.login, requestBody, { headers: header }).pipe(
            timeout(10000),
            map(res => {
            return this.processLoginResponse(res, rememberMe)
        }), catchError(x => {
           return throwError(x);
        }));
        //.append('scope', 'openid email phone profile offline_access roles')
    }


    private processLoginResponse(response: LoginResponse, rememberMe: boolean) {

        let accessToken = response.access_token;

        if (accessToken == null)
            throw new Error("Received accessToken was empty");

        let idToken = response.id_token;
        let refreshToken = response.refresh_token || this.refreshToken;
        let expiresIn = response.expires_in;

        let tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

        let accessTokenExpiry = tokenExpiryDate;


        let decodedIdToken = <IdToken>JwtHelper.decodeToken(response.id_token);

        let permissions: PermissionValues[] = Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];

        // if (!this.isLoggedIn)
        //     this.cfg.import(decodedIdToken.configuration);

        let user = new UserModel(
            decodedIdToken.sub,
            decodedIdToken.name,
            decodedIdToken.fullname,
            decodedIdToken.email,
            decodedIdToken.jobtitle,
            decodedIdToken.phone,
            Array.isArray(decodedIdToken.role) ? decodedIdToken.role : [decodedIdToken.role]);
        user.isEnabled = true;

        this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry, rememberMe);

        this.reevaluateLoginStatus(user);

        return user;
    }


    private saveUserDetails(user: UserModel, permissions: PermissionValues[], accessToken: string, idToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {

        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(idToken, DBkeys.ID_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(idToken, DBkeys.ID_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
        }

        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }


    protected handleError(error, continuation: () => Observable<LoginResponse>) {
        debugger
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return this.refreshLogin().pipe(mergeMap(data => {
                this.isRefreshingLogin = false;
                this.resumeTasks(true);
                return continuation();
            }), catchError(refreshLoginError => {
                this.isRefreshingLogin = false;
                this.resumeTasks(false);
                if (refreshLoginError.status == 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
                    this.reLogin();
                    return throwError(new Error("身份过期"));
                    // return Observable.throw('身份过期');
                }
                else {
                    return throwError(new Error(refreshLoginError|| 'server error'));
                    // return Observable.throw(refreshLoginError || 'server error');
                }
            }));
        }

        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.reLogin();
            return throwError(new Error((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired'));
            // return Observable.throw((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return throwError(error);
            // return Observable.throw(error);
        }
    }

    get refreshToken(): string {
        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }



    private pauseTask(continuation: () => Observable<any>) {
        if (!this.taskPauser)
            this.taskPauser = new Subject();
        return this.taskPauser.pipe(switchMap(continueOp => {
            return continueOp ? continuation() : Observable.throw('session expired');
        }));
    }


    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }




    logout(): void {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.ID_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);

        // this.cfg.clearLocalChanges();

        this.reevaluateLoginStatus();
    }





    getLoginStatusEvent(): Observable<boolean> {
        return this._loginStatus.asObservable();
    }


    get currentUser(): UserModel {

        let user = this.localStorage.getDataObject<UserModel>(DBkeys.CURRENT_USER);
        this.reevaluateLoginStatus(user);

        return user;
    }

    get userPermissions(): PermissionValues[] {
        return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
    }

    get accessToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }

    get accessTokenExpiryDate(): Date {

        this.reevaluateLoginStatus();
        return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
    }

    get isSessionExpired(): boolean {

        if (this.accessTokenExpiryDate == null) {
            return true;
        }

        return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
    }


    get idToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ID_TOKEN);
    }



    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
    }



}
