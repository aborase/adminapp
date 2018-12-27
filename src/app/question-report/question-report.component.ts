import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute } from '@angular/router';
import { QuestionReportService } from "./service/question-report-service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'question-report',
  templateUrl: './question-report.component.html',
  styleUrls: ['./question-report.component.css']
})
export class QuestionReportComponent implements OnInit {

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
  approvalMode: any;

  constructor(private route: ActivatedRoute, private qMonitor: QuestionReportService,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.eventSessionId = route.snapshot.params['id'];
    console.log('>>>>>>>>>>>>>>>>>>>>>>>' + this.eventSessionId);
    this.toastr.setRootViewContainerRef(vcr);
  }


  ngOnInit(): void {
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
      //  this.getQuestionList();
        this.getEventById(this.session.event_id);
      this.getFeedbackReport();
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

  onSendSMS(mobileNo){
    console.log('>>>>>>>>>>>>>>>>>>>>>>>' + this.eventSessionId);
    this.qMonitor.sendSMS(mobileNo).map((resData: any) => resData).subscribe(
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
