import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/Rx';


@Injectable()
export class QuestionReportService {

    SERVER_URL = 'http://192.168.43.150:31607/kw/api/v1/webadmin/';
    SHARED_SERVICE_URL = "http://192.168.43.150:5000/stss/api/v1/"
    CONGRATS_SMS = 'Congratulations!. Your question got highest likes.';

     constructor(private http: Http) { }

     //http://192.168.43.150:31607/kw/api/v1/webadmin/sessions/1

     public getSessionForId(sessionId): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'sessions/'+ sessionId;

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

         //http://192.168.43.150:31607/kw/api/v1/webadmin/events/1

     public getEventById(eventId): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'events/' + eventId;

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

     public sendSMS(mobileNo: any): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

        });

        let body = JSON.stringify(
            {                
               mobileno: mobileNo,
               userid: 1,
               isotp: false,
               message: this.CONGRATS_SMS
            }
        );

        console.log('#### sendSMS body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SHARED_SERVICE_URL + 'sms/send';

        return this.http.post(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    public sendEmail(report: any, date: any, venue: any): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });

        let body = JSON.stringify(
            {                
               name: report.question_by,
               email: report.email_id,
               sessionName: report.session_name,
               date: date,
               venue: venue,
               question: report.question,
               likes: report.feedback_count
            }
        );

        console.log('#### sendEmail body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SHARED_SERVICE_URL + 'email/likes';

        return this.http.post(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

     //http://192.168.43.150:31607/kw/api/v1/admin/events

     public getAllEvents(): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'events';

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/kw/api/v1/admin/events/1
     public setEventStatus(event: any, status: string): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        let body = JSON.stringify(
            {                
               status: status
            }
        );

        console.log('#### setQuestionStatus body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'events/' + event.event_id;

        return this.http.put(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/api/rest/events/sessions/1/questions/2   >> not used

     public getActiveSessionInEvent(): Observable<any> {

         var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        return this.http.get(this.SERVER_URL + '1/sessions/active', options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/api/rest/admin/sessions/2/questions
    public getpostedQuestions(sessionId: any): Observable<any> {
        console.log('getpostedQuestions service sessionId >>>'+sessionId);
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = 'sessions/' + sessionId + '/questions';

        return this.http.get(this.SERVER_URL + url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/kw/api/v1/webadmin/sessions
     
    public getAllSessionsInDay(): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'sessions';

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    ///:eventId/sessions
    //http://192.168.43.150:31607/kw/api/v1/admin/events/
    public getAllSessionsInEvent(eventId: any): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'events/' + eventId + '/sessions';

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/api/rest/admin/events/1/sessions/status
     public setSessionStatus(eventSession: any, status): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        let body = JSON.stringify(
            {
                event_session_id: eventSession.event_session_id,
                status: status,
            }
        );

        console.log('#### setSessionStatus body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'events/' + eventSession.mst_event.event_id + '/sessions/status';

        return this.http.put(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/api/rest/admin/events/sessions/1/questions/2
     public setQuestionStatus(question: any, status): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        let body = JSON.stringify(
            {                
                question_status_id: status,
                user_id : question.user_id,
                approver_id: 'Admin'
            }
        );

        console.log('#### setQuestionStatus body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'sessions/' + question.event_session_id + '/questions/' + question.question_id;

        return this.http.put(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/kw/api/v1/webadmin/sessions/1/report
    public getFeedbackReport(sessionId: any): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'sessions/' + sessionId + '/report';

        return this.http.get(url, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    //http://192.168.43.150:31607/kw/api/v1/webadmin/sessions/1/approvalmode
    public updateApprovalModeForSession(sessionId, status): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });

        let body = JSON.stringify(
            {                
                is_auto_approval: status
            }
        );

        console.log('#### setQuestionStatus body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'sessions/' + sessionId + '/approvalmode';

        return this.http.put(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }

    private feedback = new BehaviorSubject<any[]>([]);
    feedbackReport = this.feedback.asObservable();
    updateFeedbackReport(report: any[]) {
        console.log('#### feedback changeMessage ####' + report)
        this.feedback.next(report)
    }

}