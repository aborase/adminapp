import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';
import * as jspdf from 'jspdf';
import * as html2canvas from "html2canvas"
import { KWService } from "./service/KWService";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable } from "rxjs/Observable";

declare var videojs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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

  constructor(private kwSerice: KWService, private spinnerService: Ng4LoadingSpinnerService) {
  }

  onClickSubmit(data) {
    console.log('>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<', data)

  }

  ngOnInit(): void {
    this.getAllEvents();
    this.kwSerice.feedbackReport.subscribe(report => this.feedbackReports = report);
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
    setTimeout(() => {
      this.activeSessionId = eventSession.event_session_id;
      this.getQuestionList();
      this.spinnerService.hide();;
    }, 3000);
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
    this.kwSerice.setSessionStatus(eventSession, status).map((resData: any) => resData).subscribe(
      result => {
        console.log("setSessionStatus >>>>>>", result);

        setTimeout(() => {
          this.getAllSessionsInEvent();
          if(status == 'N'){
            this.questions = [];
          }
          
        }, 2000);


      }, error => {
      });
  }


  onApprove(question) {
    console.log('Approved >>>', question);
    this.setQuestionStatus(question, 1);
  }

  onReject(question) {
    console.log('Reject >>>');
    this.setQuestionStatus(question, 3);
  }

  onRedo(question) {
    console.log('Redo >>>');
    this.setQuestionStatus(question, 4);

  }

  setQuestionStatus(question: any, status: number) {
    // console.log("resetEventSessionStatus service >>>>>>",result);   
    this.kwSerice.setQuestionStatus(question, status).map((resData: any) => resData).subscribe(
      result => {
        console.log("setQuestionStatus >>>>>>", result);
        this.getQuestionList();


      }, error => {
      });
  }

  onReport() {
    this.spinnerService.show();
    console.log('onReport >>>');
    if( this.activeSessionId != 0){
      this.kwSerice.getFeedbackReport(this.activeSessionId).map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>>", result);
        //this.activeSession = result[0];
        this.feedbackReports = result;
        this.spinnerService.hide();

      }, error => {
        this.spinnerService.hide();
      });

    }    

  }

  onGenerateReport(value: any){
    console.log('>>>>>>>> onGenerateReport >>>',value.sessionId);
    this.feedbackReport = [];
     this.kwSerice.getFeedbackReport(value.sessionId).map((resData: any) => resData).subscribe(
      result => {
        
        console.log(">>>>>>", result);
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
