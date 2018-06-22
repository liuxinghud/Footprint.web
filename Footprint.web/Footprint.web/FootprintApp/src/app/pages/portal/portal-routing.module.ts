import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalLayoutComponent } from './portal-layout/portal-layout.component';
import { MvcComponent } from './mvc/mvc.component';
import { AngularComponent } from './angular/angular.component';
import { DblearnComponent } from './dblearn/dblearn.component';
import { IonicComponent } from './ionic/ionic.component';
import { NetcoreComponent } from './netcore/netcore.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';

const portalRoutes: Routes = [
  {
    path: '',
    component: PortalLayoutComponent,
    //canActivateChild:[AuthGuard],
    children: [
      {
        path: 'mvc',
       component: MvcComponent,
      },
      {
        path: 'angular',
       component: AngularComponent,
      },
      {
        path: 'ionic',
         component: IonicComponent,
      },
      {
        path: 'db',
         component: DblearnComponent,
      },
      {
        path: 'netcore',
         component: NetcoreComponent,
      },
      {
        path: 'login',
         component: LoginComponent,
      },
      {
        path: 'signup',
         component: SignupComponent,
      },
       
    ]
  },

];


@NgModule({
  imports: [
    RouterModule.forChild(portalRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})


export class PortalRoutingModule { }