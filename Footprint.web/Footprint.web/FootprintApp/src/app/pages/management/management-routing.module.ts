import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';
import { AuthGuardService } from '../../providers/auth-guard.service';
import { UsermanagerComponent } from './usermanager/usermanager.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: ManageLayoutComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'userlist',
        component: UsermanagerComponent,
      },
      // {
      //   // path: 'Edit/:id',
      //   //  component: EditUserComponent,
      // },
      // {
      //   // path: 'register',
      //   // component: RegisterComponent,
      // },
      // {
      //   // path: 'Create',
      //   // component: CreateUserComponent,
      //   // canDeactivate: [CanDeactivateGuard],
      // },
    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule,

  ],
  providers: [

  ]
})
export class ManagementRoutingModule { }
