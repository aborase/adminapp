import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable } from "rxjs/Observable";
import { KWService } from "./service/KWService";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {DropdownModule} from 'primeng/dropdown';
import {SelectItem} from 'primeng/api';

declare var moment: any;


@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
  
export class AdminComponent implements OnInit {

  events: any[] = [];
  activeEvent_Id: any;
  questions: any[] = [];
  activeSession: any;
  cols: any[];
  postedQuestions: any[];
  eventSessions: any[];
  smsText: string;
  activeSessionId: number = 0;
  feedbackReport: any[] = [];
  feedbackReports: any[] = [];
  rptSessionId: number;
  showReport: boolean = false;
  date: any;


  constructor(private kwSerice: KWService, private spinnerService: Ng4LoadingSpinnerService,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.date = new Date();
    this.toastr.setRootViewContainerRef(vcr);
  }

   
/*
  changeSpeakerForSession(quest) {
    console.log('>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<', quest)
    this.displayChangeSpeaker = true;
    this.speakers.push('aaaaa');
    this.speakers.push('aaaaa');
    this.cities1 = [
            {label:'Select City', value:null},
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
            {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
        ];
   
  }
      */

  ngOnInit(): void {
   // this.getAllEvents();
   this.getAllSessionsFoDay();
    this.kwSerice.feedbackReport.subscribe(report => this.feedbackReports = report);     
  }  

  updateApprovalModeForSession(quest: any){
    let mode = quest.is_auto_approval;
    let newMode = '';
    let message = '';
    if(mode == 'Manual'){
      newMode = 'Y';
      message = 'Question approval mode set to Auto.';
    }else{
      newMode = 'N';
      message = 'Question approval mode set to Manual.'
    }
    this.kwSerice.updateApprovalModeForSession(quest.event_session_id, newMode).map((resData: any) => resData).subscribe(
      result => {  
        console.log('>>>>>>>> updateApprovalModeForSession success >>');
        this.toastr.success(message, 'Success!', { toastLife:3000, showCloseButton: true, positionClass:"toast-bottom-full-width" });
        this.getAllSessionsFoDay();
      }, error => {
        
      });

  }

  getAllSessionsFoDay() {
    this.kwSerice.getAllSessionsInDay().map((resData: any) => resData).subscribe(
      result => {        
        //this.activeSession = result[0];
        this.date = this.getDate(result[0].start_date);   
        result.forEach(element =>{          
          element.start_date = this.getTime(element.start_date);
          element.end_date = this.getTime(element.end_date);
          if(element.is_auto_approval == 'Y'){
            element.is_auto_approval = 'Auto';
          }else{
             element.is_auto_approval = 'Manual'
          }
          
        });
        
        this.eventSessions = result;       

      }, error => {
        
      });
  }

  private getDate(date: any){
    return date.substring(0, date.indexOf("T"));
  }

  private getTime(date: any){
    return date.substring(date.indexOf("T")+ 1, date.indexOf("."))
  }

  getAllEvents() {
    // this.spinnerService.show();
    this.kwSerice.getAllEvents().map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>> getAllSessions >", result);
        this.events = result;
        //  this.spinnerService.hide();

      }, error => {
        //  this.spinnerService.hide();
      });
  }

  onStartEvent(event: any) {
    console.log(">>>>>> onStartEvent >", event);
    this.spinnerService.show();
    this.activeEvent_Id = event.event_id;
    let status = 'Y';
    //reset session status
    this.kwSerice.setEventStatus(event, status).map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>> setEventStatus >", result);
        //this.spinnerService.hide();
        let observables = new Array();
        observables.push(this.getAllSessionsInEvent());
        observables.push(this.getAllEvents())
        /*
        //refresh sessions list
        this.getAllSessionsInEvent();

        //refresh events list to change status
        this.getAllEvents();
        */
        Observable.forkJoin(observables).subscribe(
          res => {
            setTimeout(() => {
              this.spinnerService.hide();
            }, 3000);
            
          },
          error => {
            this.spinnerService.hide();
          }
        );
      }, error => {
        this.spinnerService.hide();
      });

  }

  onEndEvent(event: any) {
    console.log(">>>>>> onEndEvent >", event);
    this.spinnerService.show();;
    let status = 'N';
    this.kwSerice.setEventStatus(event, status).map((resData: any) => resData).subscribe(
      result => {        
        console.log(">>>>>> setEventStatus >", result);

        //refresh sessions list
        //this.getAllSessionsInEvent();
        this.eventSessions = [];

        //refresh events list to change status
        this.getAllEvents();
        setTimeout(() => {
              this.spinnerService.hide();
        }, 2000);

      }, error => {
        this.spinnerService.hide();;
      });

  }


  getQuestionList() {
    this.questions = [];
    this.cols = [
      { field: 'question_id', header: 'ID' },
      { field: 'Session Name', header: 'Session Name' },
      { field: 'user_id', header: 'User' },
      { field: 'question', header: 'Question' }
    ];
    console.log(">>>>>> getQuestionList >", this.activeSessionId);
    this.kwSerice.getpostedQuestions(this.activeSessionId).map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>> getpostedQuestions >", result);

        result.forEach(element => {
          if (element.question_status_id == 2) {
            this.questions.push(element);
          }
          // if (element.question_status_id == 1) {
          //   this.postedQuestions.push(element);
          // }
        });

      }, error => {
      });
  }

  getActiveSession() {
    this.kwSerice.getActiveSessionInEvent().map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>> getActiveSession >", result[0]);
        this.activeSession = result[0];
        this.activeSessionId = this.activeSession.event_session_id;

      }, error => {
      });
  }

  getFeedbackForActiveSession() {
    this.kwSerice.getActiveSessionInEvent().map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>>", result[0]);
        this.activeSession = result[0];

      }, error => {
      });
  }

  getAllSessionsInEvent() {
    // this.spinnerService.show();
    this.kwSerice.getAllSessionsInEvent(this.activeEvent_Id).map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>>", result);
        //this.activeSession = result[0];
        this.eventSessions = result;
        // this.spinnerService.hide();

      }, error => {
        //  this.spinnerService.hide();
      });
  }

  onStartSession(eventSession: any) {
    this.spinnerService.show();
    console.log('onStartSession >>>', eventSession);
    this.resetEventSessionStatus(eventSession, 'Y');
    // setTimeout(() => {
    //   this.activeSessionId = eventSession.event_session_id;
    // //  this.getQuestionList();
    //   this.spinnerService.hide();;
      
    // }, 3000);
  }

  onEndSession(eventSession: any) {
    console.log('onEndSession >>>', eventSession);
    this.spinnerService.show();
    this.resetEventSessionStatus(eventSession, 'N');
     this.activeSessionId = 0;
     setTimeout(() => {
       this.spinnerService.hide();;
     });
  }

  resetEventSessionStatus(eventSession: any, status: string) {
    // console.log("resetEventSessionStatus service >>>>>>",result);   
    let message = '';
    if(status == 'Y'){
      message = 'Session started !!!';
    }else{
      message = 'Session end !!!';
    }
    this.kwSerice.setSessionStatus(eventSession, status).map((resData: any) => resData).subscribe(
      result => {
        console.log("setSessionStatus >>>>>>", result);        
         this.getAllSessionsFoDay();
         this.toastr.success(message, 'Success!', { toastLife:3000, showCloseButton: true, positionClass:"toast-bottom-full-width" });
        // setTimeout(() => {
         
        //   // if(status == 'N'){
        //   //   this.questions = [];
        //   // }
          
        // }, 2000);


      }, error => {
      });
  }  

  onReport() {
    this.spinnerService.show();
    console.log('onReport >>>');
    if( this.activeSessionId != 0){
      this.kwSerice.getFeedbackReport(this.activeSessionId).map((resData: any) => resData).subscribe(
      result => {
        //console.log(">>>>>>", result);
        //this.activeSession = result[0];
        this.feedbackReports = result;
        this.spinnerService.hide();

      }, error => {
        this.spinnerService.hide();
      });

    }    

  }

  onGenerateReport(value: any){
    //console.log('>>>>>>>> onGenerateReport >>>',value.sessionId);
    this.feedbackReport = [];
     this.kwSerice.getFeedbackReport(value.sessionId).map((resData: any) => resData).subscribe(
      result => {
        
       // console.log(">>>>>>", result);
        //this.activeSession = result[0];
        this.feedbackReport = result;
         this.showReport = true;
         this.kwSerice.updateFeedbackReport(this.feedbackReport);
        this.spinnerService.hide();

      }, error => {
        this.spinnerService.hide();
      });
  }





}

