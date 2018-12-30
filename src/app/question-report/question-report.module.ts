import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import {TableModule} from 'primeng/table';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { QuestionReportComponent } from "./question-report.component";
import { QReportRoutingModule } from "./qreport-routing.module";
import { QuestionReportService } from "./service/question-report-service";




@NgModule({
  declarations: [
    QuestionReportComponent
  ],
  imports: [
    FormsModule,CommonModule, TableModule,
    QReportRoutingModule
  ],
  providers: [QuestionReportService],    
})
export class QuestionReportModule { }
