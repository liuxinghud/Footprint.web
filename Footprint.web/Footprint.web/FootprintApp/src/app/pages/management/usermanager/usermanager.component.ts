import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { AccountService } from '../../../providers/account.service';
import { UserModel } from '../../../models/userinfo';
import { MessageService } from '../../../providers/message.service';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { Permission } from '../../../models/permission.model';
import { debounceTime } from '../../../../../node_modules/rxjs/operators';
import { HttpParams } from '../../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.css'],
  host: { 'window.resize': 'onResize($event)' }
})
export class UsermanagerComponent implements OnInit, OnDestroy {
  page: number = 0;
  pageSize: number = 10;
  userlist: Observable<UserModel[]>;
  rows: UserModel[] = [];
  totalcount: number = 0;
  headerHeight: number = 50;
  rowHeight: number = 50;
  footerHeight: number = 58;

  //用户组模板
  @ViewChild('rolesTemplate')
  rolesTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  columns = [];
  private resizeSub: Subscription;
  reload: boolean = true;


  params: HttpParams;
  orderby: string;
  constructor(private accountsrv: AccountService, private msg: MessageService, private el: ElementRef) {


    this.resizeSub = Observable.create((observer) => {
      window.onresize = (event) => observer.next(event);
    }).pipe(debounceTime(50))
      .subscribe((event) => {
        this.onResize();
      });
  }
  ngOnInit() {
    this.params = new HttpParams().set('page', `${this.page + 1}`)
      .set('pageSize', `${this.pageSize}`).set('orderby', `${this.orderby || "Name"}`);


    this.userlist = this.accountsrv.getUserList(this.params, true);
    this.accountsrv.getUserList(this.params, true).subscribe(x => {
      this.rows = x;
    });



    this.accountsrv.getUserCount().subscribe(num => {
      this.totalcount = num;
    });
    this.columns = [
      { prop: 'id', name: 'ID' },
      { prop: 'userName', name: '用户' },
      { prop: 'email', name: '邮箱' },
      { prop: 'phoneNumber', name: '电话', sortable: true },
      { prop: 'roles', name: "用户组", cellTemplate: this.rolesTemplate, sortable: false },
    ]
    if (this.canManageUsers) {
      this.columns.push({ name: '', cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });
      // this.columns.push({ prop: '', name: '', cellTemplate: this.actionsTemplate, sortable: false });
    }
  }



  get canAssignRoles() {
    return this.accountsrv.servicebase.userHasPermission(Permission.assignRolesPermission);
  }

  get canViewRoles() {
    return this.accountsrv.servicebase.userHasPermission(Permission.viewRolesPermission)
  }

  get canManageUsers() {
    return this.accountsrv.servicebase.userHasPermission(Permission.manageUsersPermission);
  }

  onPage(currentpage) {
    debugger;
    this.params = new HttpParams().set('page', `${currentpage}`)
      .set('pageSize', `${this.pageSize}`).set('orderby', `${this.orderby || "Name"}`);
    // this.userlist = this.accountsrv.getUserList(this.params, true);
    this.accountsrv.getUserList(this.params, true).subscribe(x => {
      this.rows = x;
    })
  }

  onSort(event) {
    let sort = event.sorts[0];
    this.orderby = sort.prop + " " + sort.dir;
    debugger;
    this.rows = [];
    this.params = new HttpParams().set('page', `${this.page + 1}`)
      .set('pageSize', `${this.pageSize}`).set('orderby', `${this.orderby || "Name"}`);
    this.accountsrv.getUserList(this.params, true).subscribe(x => {
      this.rows = x;
    })

  }

  //会抖动
  //@HostListener('window:resize',['$event'])
  onResize() {
    this.reload = false;
    setTimeout(() => {
      this.reload = true;
    }, 50);
  }

  ngOnDestroy() {

    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

}
