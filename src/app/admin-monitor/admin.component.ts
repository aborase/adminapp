import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable } from "rxjs/Observable";
import { KWService } from "./service/KWService";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { LogInService } from "../log-in/service/log-in";
import { DatePipe } from '@angular/common';

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
  userDetail: any;
  speakers: any[] = [];
  showSpeaker: boolean = false;
  enableUpdateSpeakerBtn: boolean = true;
  showOtherSpeakers: boolean = false;
  selectedSessionId: any;
  selectedSpeakerId: any;
  speakerCount: any;
  currentDate: any;
  sessionsFilrer:  any[] = [];
  selectedSessionFilterId: any;
  showSessionList: boolean = false;
  selectedSessionFilter: any;

  constructor(private kwSerice: KWService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastsManager, vcr: ViewContainerRef, private logInService: LogInService) {
    this.date = new Date();
    this.toastr.setRootViewContainerRef(vcr);
    
  }

  ngOnInit(): void {
    this.spinnerService.show();
    let date = new Date();
    var datePipe = new DatePipe("en-US");
    this.currentDate = datePipe.transform(date, ' yyyy-MM-dd HH:MM:SS');   
    console.log('>>>>>>>>>>>>>> datepipe details >>>>>><<<<<<<<<<<<<<', datePipe.transform(date, ' yyyy-MM-dd HH:MM:SS'));

    this.sessionsFilrer = [{"id":1, "Value":"Today"},
                            {"id":2, "Value":"Month"}];
   // this.kwSerice.feedbackReport.subscribe(report => this.feedbackReports = report);
    console.log('>>>>>>>>>>>>>> this.sessionsFilrer >>>>>><<<<<<<<<<<<<<', this.sessionsFilrer);
    this.logInService.userInfo.subscribe(details => {
      console.log('>>>>>>>>>>>>>> details >>>>>><<<<<<<<<<<<<<', details);
      this.userDetail = details;
    });
     this.logInService.publishUserDetailsToQuestionMonitor(this.userDetail);
      setTimeout(() => {
        console.log('reached here ^^^^^^^^')
              this.getAllSessionsFoDay("month");
              this.getAllSpeakers();
              this.getMaxOratorId();
              this.spinnerService.hide();
            }, 4000);
     

  }

  onSelectSessionFilter(event: any){
    console.log('>>>>>>>>>>>>>> addNewSpeaker >>>>>><<<<<<<<<<<<<<', event);
    this.selectedSessionFilterId = event;
    this.showSessionList = true;
    if(this.selectedSessionFilterId == 1){
      this.selectedSessionFilter = 'day';
      this.getAllSessionsFoDay(this.selectedSessionFilter);
    }else{
      this.selectedSessionFilter = 'month';
      this.getAllSessionsFoDay(this.selectedSessionFilter);
    }

    
  }

  addNewSpeaker(event: any){
     console.log('>>>>>>>>>>>>>> addNewSpeaker >>>>>><<<<<<<<<<<<<<', this.speakerCount);
     let mobile: number = event.speakerMobile;   
     let id = ++this.speakerCount;
     this.kwSerice.addNewSpeaker(id, event.speakerName, mobile, event.speakerEmail, event.speakerStream).map((resData: any) => resData).subscribe(
      result => {
       this.kwSerice.updateSpeaker(this.selectedSessionId, id).map((resData: any) => resData).subscribe(
      result => {
        this.getAllSessionsFoDay(this.selectedSessionFilter);
        this.enableUpdateSpeakerBtn = true;
        this.showOtherSpeakers = false;
        this.showSpeaker = false;  
        this.toastr.success('Speaker name updated.', 'Success!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
      });
      });
  }

  updateSpeaker(){
    console.log('>>>>>>>>>>>>>> updateSpeaker >>>>>><<<<<<<<<<<<<<', this.selectedSessionId)
     this.kwSerice.updateSpeaker(this.selectedSessionId, this.selectedSpeakerId).map((resData: any) => resData).subscribe(
      result => {
        this.getAllSessionsFoDay(this.selectedSessionFilter);  
         this.showSpeaker = false;      
        this.toastr.success('Speaker name updated.', 'Success!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
      });
  }

  changeSpeakerForSession(quest: any){
    console.log('>>>>>>>>>>>>>> changeSpeakerForSession >>>>>><<<<<<<<<<<<<<', quest.event_session_id);
    this.showSpeaker = true;
    this.selectedSessionId = quest.event_session_id; 
    
  }

  onSelectSpeaker(event: any){
    console.log('>>>>>>>>>>>>>> onSelectSpeaker >>>>>><<<<<<<<<<<<<<', event);
    if(event == 9999){
       console.log('>>>>>>>>>>>>>> here >>>>>><<<<<<<<<<<<<<', event);
      this.enableUpdateSpeakerBtn = true;
      this.showOtherSpeakers = true;
    }else if(event == -1){
       this.enableUpdateSpeakerBtn = true;
      this.showOtherSpeakers = false;
    } else{
      this.enableUpdateSpeakerBtn = false;
      this.showOtherSpeakers = false;
      this.selectedSpeakerId = event;
    }
  }

  getAllSpeakers(){
    this.kwSerice.getSpeakersList().map((resData: any) => resData).subscribe(
      result => {
         console.log('>>>>>>>>>>>>>> details >>>>>><<<<<<<<<<<<<<', result);
         this.speakers = result;         
         let otherSpeaker = {"orator_id":9999, "name":"Other"} 
         this.speakers.push(otherSpeaker);
         }, error => {

      });
  }

  getMaxOratorId(){
    this.kwSerice.getMaxOratorId().map((resData: any) => resData).subscribe(
      result => {
         console.log('>>>>>>>>>>>>>> getMaxOratorId >>>>>><<<<<<<<<<<<<<', result[0][0].id);
         this.speakerCount = result[0][0].id;
         }, error => {

      });
  }


  updateApprovalModeForSession(quest: any) {
    let mode = quest.is_auto_approval;
    let newMode = '';
    let message = '';
    if (mode == 'Manual') {
      newMode = 'Y';
      message = 'Question approval mode set to Auto.';
    } else {
      newMode = 'N';
      message = 'Question approval mode set to Manual.'
    }
    this.kwSerice.updateApprovalModeForSession(quest.event_session_id, newMode).map((resData: any) => resData).subscribe(
      result => {
        console.log('>>>>>>>> updateApprovalModeForSession success >>');
        this.toastr.success(message, 'Success!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
        this.getAllSessionsFoDay(this.selectedSessionFilter);
      }, error => {

      });

  }

  getAllSessionsFoDay(filter) {
    this.kwSerice.getAllSessionsInDay(this.currentDate, filter).map((resData: any) => resData).subscribe(
      result => {
        //this.activeSession = result[0];
        this.date = this.getDate(result[0].start_date);
        result.forEach(element => {
          element.start_date = this.getTime(element.start_date);
          element.end_date = this.getTime(element.end_date);
          if (element.is_auto_approval == 'Y') {
            element.is_auto_approval = 'Auto';
          } else {
            element.is_auto_approval = 'Manual'
          }

        });

        this.eventSessions = result;

      }, error => {

      });
  }

  private getDate(date: any) {
    return date.substring(0, date.indexOf("T"));
  }

  private getTime(date: any) {
    return date.substring(date.indexOf("T") + 1, date.indexOf("."))
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
    if (status == 'Y') {
      message = 'Session started !!!';
    } else {
      message = 'Session end !!!';
    }
    this.kwSerice.setSessionStatus(eventSession, status).map((resData: any) => resData).subscribe(
      result => {
        console.log("setSessionStatus >>>>>>", result);
        this.getAllSessionsFoDay(this.selectedSessionFilter);
        this.toastr.success(message, 'Success!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
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
    if (this.activeSessionId != 0) {
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

  onGenerateReport(value: any) {
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

