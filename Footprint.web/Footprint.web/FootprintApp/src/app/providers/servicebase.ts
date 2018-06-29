import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MessageService, MessageType } from './message.service';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Servicebase {

  constructor(private http: HttpClient, private authService: AuthService, private msg: MessageService) { }

  public getdata<T>(url: string,showloading:boolean=true): Observable<T> {
    showloading&& this.msg.startLoading();
    return this.http.get<T>(url, this.getRequestHeaders()).pipe(map(x => {this.msg.stopLoading(); return x; }), catchError(error => {this.msg.stopLoading(); return this.errorhandler(error) }));
  }

  public getList<T>(url: string,showloading:boolean=true): Observable<T[]> {
    showloading&& this.msg.startLoading();
    return this.http.get<T[]>(url, this.getRequestHeaders()).pipe(map(x => {this.msg.stopLoading(); return x; }), catchError(error => {this.msg.stopLoading(); return this.errorhandler(error) }));
  }

  public postData<T>(url: string, data: T,showloading:boolean=true): Observable<any> {
    showloading&& this.msg.startLoading();
    return this.http.post(url, data, this.getRequestHeaders()).pipe(map(x => {this.msg.stopLoading(); return x; }), catchError(error => {
      this.msg.stopLoading(); return this.errorhandler(error)
    }))
  }


  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.accessToken,
      'Content-Type': 'application/json',
      'Accept': `application/json, text/plain, */*`
    });

    return { headers: headers };
  }

  errorhandler(error: HttpErrorResponse) {
    // let sub = new Subject<HttpErrorResponse>();
    if (error.status == 404) {
      this.msg.showMessage("Not Found", "请求的地址未找到", MessageType.error);
    } else if (error.status == 0) {
      this.msg.showMessage("No NetWork", "网络链接失败，请检查网络", MessageType.error);
    } else if (error.status == 401) {
      this.msg.showMessage("Unauthorized", "用户没有权限访问此链接", MessageType.error);
    } else if (error.status == 500) {
      this.msg.showMessage("500", "服务器内部错误请联系管理员", MessageType.error);
    } else if (error.status == 400) {
      // sub.next(error);
      return throwError(error);
    } else if (error.name == "TimeoutError") {
      this.msg.showMessage("TimeOut Error", "请求超时", MessageType.error);
    } else {
      this.msg.showMessage(error.status.toString(), error.statusText, MessageType.error);
    }
    // return catchError(error)
    // return sub.asObservable();
  }
}
