import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: ManageLayoutComponent,
    //canActivateChild:[AuthGuard],
    // children: [
    //   {
    //    // path: 'UserList',
    //   //   component: UserListComponent,
    //   },
    //   {
    //    // path: 'Edit/:id',
    //   //  component: EditUserComponent,
    //   },
    //   {
    //    // path: 'register',
    //   // component: RegisterComponent,
    //   },
    //   {
    //    // path: 'Create',
    //     // component: CreateUserComponent,
    //     // canDeactivate: [CanDeactivateGuard],
    //     resolve: {
    //      crisis: LayoutComponent
    //     },
    //   },
    // ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class ManagementRoutingModule { }
