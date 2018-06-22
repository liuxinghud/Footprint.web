import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MessageService } from '../providers/message.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private isloading: boolean = false;
  constructor(private router: Router, public message: MessageService, private ngzone: NgZone) { }

  timeoutId: any;
  ngOnInit(): void {
    //路由大小写忽略
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        let url = (<NavigationStart>event).url;
        if (url !== url.toLowerCase()) {
          this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
        }
      }
    });

    //订阅事件
    this.message.getMessageEvent().subscribe(msg => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.message.showToast(msg);
      }, 100);
    });

    this.message.getLoadingEvent().subscribe(x => {
      setTimeout(() => {
        this.isloading = x;
      }, 100);
    })




  }

  // ngAfterViewInit() {

  // }
  // ngAfterContentInit() {
  //   //开始订阅事件

  // }





}
