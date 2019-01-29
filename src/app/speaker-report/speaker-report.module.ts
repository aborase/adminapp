import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import {TableModule} from 'primeng/table';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { SpeakerReportComponent } from "./speaker-report.component";
import { SReportRoutingModule } from "./speaker-routing.module";
import { QuestionReportService } from "./service/question-report-service";




@NgModule({
  declarations: [
    SpeakerReportComponent
  ],
  imports: [
    FormsModule,CommonModule, TableModule,
    SReportRoutingModule
  ],
  providers: [QuestionReportService],    
})
export class SpeakerReportModule { }
