import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SpeakerReportComponent } from "./speaker-report.component";


const sReportRoutes: Routes = [
  
  {
    path: '',  component: SpeakerReportComponent,
  }
 
];


@NgModule({
  imports: [
    RouterModule.forChild(sReportRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SReportRoutingModule { }
