import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LogInModule } from "./log-in/log-in.module";

const appRoutes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',  loadChildren: './log-in/log-in.module#LogInModule'},
  { path: 'admin',  loadChildren: './admin-monitor/admin.module#AdminModule'},
  { path: 'kwapp/admin/qmonitor/:id',  loadChildren: './question-monitor/question-monitor.module#QuestionMonitorModule'},
  { path: 'kwapp/admin/qreport/:id',  loadChildren: './question-report/question-report.module#QuestionReportModule'},
  { path: 'kwapp/admin/sreport/:id',  loadChildren: './speaker-report/speaker-report.module#SpeakerReportModule'}
 // { path: 'qmonitor/:id',  loadChildren: './question-monitor/question-monitor.module#QuestionMonitorModule'},
 // { path: 'qreport/:id',  loadChildren: './question-report/question-report.module#QuestionReportModule'},
 // { path: 'sreport/:id',  loadChildren: './speaker-report/speaker-report.module#SpeakerReportModule'}
  
   
];

LogInModule
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true,
        enableTracing: false, // <-- debugging purposes only
        
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
