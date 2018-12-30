import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms';

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable } from "rxjs/Observable";
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { LogInService } from "./service/log-in";

declare var moment: any;


@Component({
  selector: 'admin',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {

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
  userInput: any;
  showReport: boolean = false;
  date: any;
  value: any;
  MOBILE_REGEX = "^(?:(?:\\+\0{0,2})91(\\s*[\-]\\s*)?|[0]?)?[789]\\d{9}$";
  EMAIL_REGEX = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

  constructor(private kwSerice: LogInService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router) {
    this.date = new Date();
    this.toastr.setRootViewContainerRef(vcr);
  }

  submit(event: any) {

    let isValidEmail: boolean = false;
    let isValidMobile: boolean = false;
    let type = '';    

    if (this.userInput.match(this.MOBILE_REGEX)) {
      isValidMobile = true;
      type = 'mobile';
    } else if (this.userInput.match(this.EMAIL_REGEX)) {
      isValidEmail = true;
      type = 'email';
    } else {
      this.toastr.error('Please enter valid mobile or email.', 'Error!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
    }
    if (isValidEmail || isValidMobile) {
      this.kwSerice.getUserDetails(this.userInput, type).map((resData: any) => resData).subscribe(
        result => {
          console.log('>>>>>>>> getUserDetails success >>', result);
          if(result.user_role_id == 2){
            this.kwSerice.publishUserDetailskReport(result.name);
            setTimeout(() => {
              this.router.navigate(['/admin']);
             }, 500);
          }else{
            this.toastr.error("You don't have rights to access the app. Please contact administrator.", 'Error!', { toastLife: 3000, showCloseButton: true, positionClass: "toast-bottom-full-width" });
          }
        }, error => {

        });
    }

  }


  ngOnInit(): void {   
    this.getAllSessionsFoDay();    
  }

  getAllSessionsFoDay() {
    this.kwSerice.getAllSessionsInDay().map((resData: any) => resData).subscribe(
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


}

