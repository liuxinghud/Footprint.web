import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { debounceTime } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-manage-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.css', '../../portal/portal-layout/portal-layout.component.css']
})
export class ManageLayoutComponent implements OnInit, OnDestroy {
  constructor() { }
  // panelOpenState:boolean=true;
  ngOnInit() {
    // this.resizeSub = Observable.create((observer) => {
    //   window.onresize = (event) => observer.next(event);
    // }).pipe(debounceTime(500))
    //   .subscribe((event) => {
    //     this.onResize();
    //   });
  }
  // onResize() {
  //   this.reload = false;
  //   setTimeout(() => {
  //     this.reload = true;
  //   }, 100);
  // }

  ngOnDestroy() {
    // if (this.resizeSub) {
    //   this.resizeSub.unsubscribe();
    // }
  }

}
