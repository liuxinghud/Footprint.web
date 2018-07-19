import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MessageService } from '../providers/message.service';
import { Observable } from '../../../node_modules/rxjs';
import { debounceTime } from '../../../node_modules/rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private isloading: boolean = false;

  constructor(private router: Router, public message: MessageService) {

   }
  timeoutId: any;
  ngOnInit() {
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
      }, 500);
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
//   @HostListener('window:resize') onClick() {
     
//     window.alert('Host Element Clicked');
// }

}
