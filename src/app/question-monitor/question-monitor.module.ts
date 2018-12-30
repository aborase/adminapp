import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import {TableModule} from 'primeng/table';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { QuestionMonitorComponent } from "./question-monitor.component";
import { QMonitorRoutingModule } from "./qmonitor-routing.module";
import { QuestionMonitorService } from "./service/question-monitor-service";


@NgModule({
  declarations: [
    QuestionMonitorComponent
  ],
  imports: [
    FormsModule,CommonModule, TableModule,
    QMonitorRoutingModule
  ],
  providers: [QuestionMonitorService],    
})
export class QuestionMonitorModule { }
