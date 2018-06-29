import { Component, OnInit } from '@angular/core';
import { MessageService, MessageType } from '../../../providers/message.service';
import { AccountService } from '../../../providers/account.service';

@Component({
  selector: 'app-mvc',
  templateUrl: './mvc.component.html',
  styleUrls: ['./mvc.component.css']
})
export class MvcComponent implements OnInit {

  constructor(private msg: MessageService, private account: AccountService) { }

  ngOnInit() {}


  showmsg() {


    this.account.authTest();
    this.msg.showMessage("Time", new Date().toString(), MessageType.info);




  }
  showloading() {
    this.msg.startLoading();
    setTimeout(() => {
      this.msg.stopLoading();
    }, 5000);
  }
}
