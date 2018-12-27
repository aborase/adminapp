import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QuestionMonitorComponent } from "./question-monitor.component";


const qMonitorRoutes: Routes = [
  
  {
    path: '',  component: QuestionMonitorComponent,
  }
 
 
];


@NgModule({
  imports: [
    RouterModule.forChild(qMonitorRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class QMonitorRoutingModule { }
