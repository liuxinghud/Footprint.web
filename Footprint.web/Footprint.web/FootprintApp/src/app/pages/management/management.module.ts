import { NgModule } from '@angular/core';
import { ManagementRoutingModule } from './management-routing.module';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';
import { UsermanagerComponent } from './usermanager/usermanager.component';
 
@NgModule({
  imports: [
    ManagementRoutingModule
  ],
  declarations: [
    ManageLayoutComponent,
    UsermanagerComponent
  ],
  providers: [

  ]
})
export class ManagementModule { }
