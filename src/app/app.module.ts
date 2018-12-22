import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { IFrameSanitizerModule } from "./iframe-sanitizer.module";
import { KWService } from "./service/KWService";
import {TableModule} from 'primeng/table';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, IFrameSanitizerModule, HttpModule, TableModule, FormsModule, Ng4LoadingSpinnerModule.forRoot(),
  ],
  providers: [KWService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
