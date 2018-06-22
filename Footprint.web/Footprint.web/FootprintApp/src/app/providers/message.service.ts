import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { HttpResponseBase } from '@angular/common/http';
import { Utilities } from './utinities';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages = new Subject<AlertMessage>();
  private isloading = new Subject<boolean>();
  constructor(private toastr: ToastrService) { }

  //发布事件
  showMessage(title: string)
  showMessage(title: string, detail: string, msgtype: MessageType)
  showMessage(titleAndDetails: string[], titleAndDetailsSeparator: string, msgtype: MessageType)
  showMessage(response: HttpResponseBase, ignoreValue_useNull: string, msgtype: MessageType)
  showMessage(data: any, separatorOrDetail?: string, msgtype?: MessageType) {
    if (!msgtype)
      msgtype = MessageType.default;

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessage(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (let message of data) {
        let msgObject = Utilities.splitInTwo(message, separatorOrDetail);
        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, msgtype);
      }
    }
    else {
      this.showMessageHelper(data, separatorOrDetail, msgtype);
    }



  }

  //外部订阅此事件
  getMessageEvent(): Observable<AlertMessage> {
    return this.messages.asObservable();
  }


  //调用控件
  showToast(msg: AlertMessage) {
    if (msg == null) { return; }
    switch (msg.msgtype) {

      case MessageType.info:
        this.toastr.info(msg.detail, msg.title, { progressBar: true })
        break;
      case MessageType.success:
        this.toastr.success(msg.detail, msg.title, { timeOut: 3000, closeButton: false, progressBar: true });
        break;
      case MessageType.warning:
        this.toastr.warning(msg.detail, msg.title, { timeOut: 5000, disableTimeOut: false, closeButton: false, });
        break;
      case MessageType.error:
        this.toastr.error(msg.detail, msg.title, { disableTimeOut: true, closeButton: true });
        break;
      // case MessageType.default:
      default:
        this.toastr.show(msg.detail, msg.title);
        break;
    }
  }

  //loading 
  public startLoading() {
    this.stopLoading();
    this.isloading.next(true);
  }
  public stopLoading() {
    this.isloading.next(false);
  }

  getLoadingEvent() {
    return this.isloading.asObservable();
  }


  private showMessageHelper(title: string, detail: string, msgtype: MessageType) {
    this.messages.next({ msgtype: msgtype, title: title, detail: detail });
  }


}












// export class AlertDialog {
//   constructor(public message: string, public type: DialogType, public okCallback: (val?: any) => any, public cancelCallback: () => any,
//     public defaultValue: string, public okLabel: string, public cancelLabel: string) {

//   }
// }

// export enum DialogType {
//   alert,
//   confirm,
//   prompt
// }

export enum MessageType {
  success,
  error,
  warning,
  info,
  default //show
}

export class AlertMessage {
  constructor(public msgtype: MessageType, public title: string, public detail: string) { }
}

