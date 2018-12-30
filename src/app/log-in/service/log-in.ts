import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/Rx';


@Injectable()
export class LogInService {

    SERVER_URL = 'http://192.168.43.150:31607/kw/api/v1/webadmin/';

     constructor(private http: Http) { }

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


     //http://192.168.43.150:31607/kw/api/v1/webadmin/user/details
      public getUserDetails(input: any, type: string): Observable<any> {
        var headers: Headers;
        var options: RequestOptions;
        headers = new Headers({            
            'Content-Type': 'application/json'
        });
        let body: any  = JSON.stringify(
            {                
                input: input,
                type: type
            }
        ); 
        console.log('#### getUserDetails body ####',body)

        options = new RequestOptions({ headers: headers });

        let url = this.SERVER_URL + 'user/details';

        return this.http.post(url, body, options).map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().info || 'Server error while fetching data')
            );
    }    
    

    private userDetails = new BehaviorSubject('');
    userInfo = this.userDetails.asObservable();
     
    publishUserDetailskReport(userName: any) {
        console.log('#### userDetails changeMessage ####', userName)
        this.userDetails.next(userName)
    }

    private userQDetails = new BehaviorSubject('');
    userQInfo = this.userQDetails.asObservable();
     
    publishUserDetailsToQuestionMonitor(userName: any) {
        console.log('#### userDetails changeMessage ####', userName)
        this.userQDetails.next(userName)
    }

}