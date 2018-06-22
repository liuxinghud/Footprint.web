import { NgModule } from '@angular/core';
import { PortalRoutingModule } from './portal-routing.module';
import { MvcComponent } from './mvc/mvc.component';
import { AngularComponent } from './angular/angular.component';
import { IonicComponent } from './ionic/ionic.component';
import { NetcoreComponent } from './netcore/netcore.component';
import { DblearnComponent } from './dblearn/dblearn.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { PortalLayoutComponent } from './portal-layout/portal-layout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatIconModule, MatButtonModule } from '@angular/material';
import { CommonModule } from '@angular/common';
 
@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],

  declarations: [
    MvcComponent,
    AngularComponent,
    IonicComponent,
    NetcoreComponent,
    DblearnComponent,
    LoginComponent,
    SignupComponent,
    PortalLayoutComponent
  ],
  providers: [

  ]
})
export class PortalModule { }
