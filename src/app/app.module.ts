import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { CustomOption } from './custom-option';
import {ToastOptions} from 'ng2-toastr';
import { LogInService } from "./log-in/service/log-in";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,  BrowserModule,ModalModule.forRoot(),
    FormsModule, AppRoutingModule,BrowserAnimationsModule, ToastModule.forRoot(),     
  ],
  providers: [{provide: ToastOptions, useClass: CustomOption}, LogInService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
