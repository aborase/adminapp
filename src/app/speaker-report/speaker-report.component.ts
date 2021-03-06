import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute } from '@angular/router';
import { QuestionReportService } from "./service/question-report-service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LogInService } from "../log-in/service/log-in";
import { Question } from "./question";

@Component({
  selector: 'speaker-report',
  templateUrl: './speaker-report.component.html',
  styleUrls: ['./speaker-report.component.css']
})
export class SpeakerReportComponent implements OnInit {

  eventSessionId: number;
  isSessionStarted: boolean = false;
  isAutoApprovalmode: boolean = false;
  questions: any[] = [];
  cols: any[];
  session: any;
  event: any;
  startTime: any;
  date: any;
  endTime: any;
  feedbackReport: any[] = [];
  questionsReport: any[] = [];
  approvalMode: any;
  userDetail: any;
  CONGRATS_SMS = 'Thank you for participating in question session ';

  constructor(private route: ActivatedRoute, private qMonitor: QuestionReportService,
              public toastr: ToastsManager, vcr: ViewContainerRef, private logInService: LogInService) {
    this.eventSessionId = route.snapshot.params['id'];
    console.log('>>>>>>>>>>>>>>>>>>>>>>>' + this.eventSessionId);
    this.toastr.setRootViewContainerRef(vcr);
  }


  ngOnInit(): void {
    this.logInService.userInfo.subscribe(details => this.userDetail = details); 
    this.qMonitor.getSessionForId(this.eventSessionId).map((resData: any) => resData).subscribe(
      result => {
        console.log('>>>>>>>> updateApprovalModeForSession success >>', result);
        this.session = result;
        this.startTime = this.getTime(this.session.start_date);
        this.endTime = this.getTime(this.session.end_date);
        this.date = this.getDate(this.session.start_date);
        if (result.active == 'Y') {
          this.isSessionStarted = true;
        }
        if (result.is_auto_approval == 'Y') {
          this.isAutoApprovalmode = true;
        }
         if(result.is_auto_approval == 'Y'){
            this.approvalMode = 'Auto';
          }else{
            this.approvalMode = 'Manual'
          }
        this.getQuestionsReport();
        this.getEventById(this.session.event_id);
      //  this.getFeedbackReport();
      }, error => {

      });
   
  }

  getFeedbackReport() {
    console.log('onReport >>>');
    this.qMonitor.getFeedbackReport(this.session.event_session_id).map((resData: any) => resData).subscribe(
      result => {        
        this.feedbackReport = result;    

      }, error => {
        
      });

  }

  getQuestionsReport() {
    console.log('onReport >>>');
    this.questions = [];
    let id = 0;
    this.qMonitor.getQuestionsReport(this.session.event_session_id).map((resData: any) => resData).subscribe(
      result => {
         console.log('onReport >>>',result);
         if(result.length > 0){
          result.forEach(element => {
          if (element.question_status_id == 2) {
            element.question_status_id = 'Approved';
             let question = new Question;
            question.index = ++id;
            question.question = element.question;
            question.askedBy = element.question_by;
            question.likeCount = element.feedback_count;
          //  question.id = element.question_id;
            this.questions.push(question);
          }
          // else if (element.question_status_id == 1) {
          //   element.question_status_id = 'Submitted';
          //   this.questions.push(element);
          // }
         
        });
      }        
          console.log('onReport final >>>',this.questions);

      }, error => {
        
      });

  }

  refreshQuestions(){
    console.log('refresh called ****');
    this.getQuestionsReport();
  }

  removeQuestion(question: any){
    console.log('removeQuestion called ****',question);
    this.qMonitor.resetQuestionActiveFlag(question.id, 'N').map((resData: any) => resData).subscribe(
      result => {
   
         this.refreshQuestions();

      }, error => {
        
      });
   
  }

  getEventById(eventId: any){
    this.qMonitor.getEventById(eventId).map((resData: any) => resData).subscribe(
      result => {
       this.event = result;      

      }, error => {
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
    console.log(">>>>>> getQuestionList >", this.session.event_session_id);
    this.qMonitor.getpostedQuestions(this.session.event_session_id).map((resData: any) => resData).subscribe(
      result => {
        console.log(">>>>>> getpostedQuestions >", result.size);

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

  onSendSMS(report: any){
    console.log('>>>>>>>>>>>>>>>>>>>>>>>' + this.eventSessionId);
    
    let sessionName = ''; 
    if(report.question.length < 20){
      sessionName = report.question;
    }else{
       sessionName = report.question.substring(0, 20) + '...';;
    }
    let question = '' ;
    if(report.question.length < 20){
      question = report.question;
    }else{
       question = report.question.substring(0, 20) + '...';;
    }
    let venueName = '';
    if(this.event.mst_venue.name.length < 15){
      venueName = this.event.mst_venue.name;
    }else{
      venueName = this.event.mst_venue.name.substring(0, 12) + '...';;
    }
    /*let sms = this.CONGRATS_SMS + report.session_name + ' on ' + this.date + ' held at "' + this.event.mst_venue.name + '" . Your question "' + 
              report.question + '" got '+ report.feedback_count + ' likes.'*/
              let sms = this.CONGRATS_SMS + '" ' + sessionName  + ' "' + ' on ' + this.date + ' held at "' + venueName + '" . Your question "' + 
              question + '" got '+ report.feedback_count + ' likes.'
    this.qMonitor.sendSMS(report.mobile_no, sms).map((resData: any) => resData).subscribe(
      result => {         
       this.toastr.success('SMS sent !!!', 'Success!', { toastLife:3000, showCloseButton: true, positionClass:"toast-bottom-full-width" }); 
      }, error => {
      });
    
  }

  onSendEmail( report: any){
    console.log('>>>>>>>>>>>>>>>>>>>>>>>' + this.eventSessionId);
    this.qMonitor.sendEmail(report, this.date, this.event.mst_venue.name).map((resData: any) => resData).subscribe(
      result => {         
       this.toastr.success('Email sent !!!', 'Success!', { toastLife:3000, showCloseButton: true, positionClass:"toast-bottom-full-width" }); 
      }, error => {
      });
    
  }

  private getDate(date: any){
    return date.substring(0, date.indexOf("T"));
  }

  private getTime(date: any){
    return date.substring(date.indexOf("T")+ 1, date.indexOf("."))
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
    this.qMonitor.setQuestionStatus(question, status).map((resData: any) => resData).subscribe(
      result => {
       // console.log("setQuestionStatus >>>>>>", result);
        this.getQuestionList();


      }, error => {
      });
  }



}
