import { NgModule } from '@angular/core';
import { ManagementRoutingModule } from './management-routing.module';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';
import { UsermanagerComponent } from './usermanager/usermanager.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '../../../../node_modules/@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
@NgModule({
  imports: [
    ManagementRoutingModule,
    NgxDatatableModule,
    CommonModule,
    MatExpansionModule,
    MatListModule
  ],
  declarations: [
    ManageLayoutComponent,
    UsermanagerComponent
  ],
  providers: [

  ]
})
export class ManagementModule { }
