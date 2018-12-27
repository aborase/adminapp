import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QuestionReportComponent } from "./question-report.component";


const qReportRoutes: Routes = [
  
  {
    path: '',  component: QuestionReportComponent,
  }
 
];


@NgModule({
  imports: [
    RouterModule.forChild(qReportRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class QReportRoutingModule { }
