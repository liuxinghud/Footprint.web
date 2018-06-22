import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './components/loading/loading.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
     BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({autoDismiss:true,timeOut:3000,progressBar:true,progressAnimation:'increasing',  closeButton:true}) // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


// toastComponent	Component	Toast	Angular component that will be used
// closeButton	boolean	false	Show close button
// timeOut	number	5000	Time to live in milliseconds
// extendedTimeOut	number	1000	Time to close after a user hovers over toast
// disableTimeOut	boolean	false	Disable both timeOut and extendedTimeOut
// easing	string	'ease-in'	Toast component easing
// easeTime	string | number	300	Time spent easing
// enableHtml	boolean	false	Allow html in message
// progressBar	boolean	false	Show progress bar
// progressAnimation	'decreasing' | 'increasing'	'decreasing'	Changes the animation of the progress bar.
// toastClass	string	'toast'	Class on toast
// positionClass	string	'toast-top-right'	Class on toast container
// titleClass	string	'toast-title'	Class inside toast on title
// messageClass	string	'toast-message'	Class inside toast on message
// tapToDismiss	boolean	true	Close on click
// onActivateTick	boolean	false	Fires changeDetectorRef.detectChanges() when activated. Helps show toast from asynchronous events outside of Angular's change detection