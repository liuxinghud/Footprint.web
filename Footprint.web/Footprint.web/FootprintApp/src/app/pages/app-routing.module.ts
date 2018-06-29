import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuardService } from '../providers/auth-guard.service';
const appRoutes: Routes = [
  {
    path: 'management',
    loadChildren: './management/management.module#ManagementModule',
   canActivate:[AuthGuardService]
  },
  {
    path: 'portal',
    loadChildren: './portal/portal.module#PortalModule',
   // canActivate:[AuthGuard]
  },
  { path: '',   redirectTo: '/portal', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes,  { useHash:false,
          enableTracing: false, // <-- debugging purposes only
          preloadingStrategy: PreloadAllModules
        })
  ],
  exports: [
      RouterModule
  ],
  providers: [
      // AuthService, AuthGuard
  ]
})


export class AppRoutingModule {
  
}
