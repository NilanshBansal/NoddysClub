import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  constructor (
    private http: Http
  ) {}

 /*  getUser() {
    return this.http.get(`https://conduit.productionready.io/api/profiles/eric`)
    .map((res:Response) => res.json());
  } */

  postEmail(emailAddress: String, phone: String, interestedEventId: String,interestedEventTitle:String): Observable<string>{
    alert("inside post email");
          let headers = new Headers({ 
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
    
          });
          let options = new RequestOptions({ headers: headers });
    
          let url = "http://formspree.io/care.noddys@gmail.com";
    
          // WRONG
          // let data = {
          //   name: name,
          //   email: email,
          //   message: message
          // }
    
          // RIGHT
          let data = `email=${emailAddress}&phone=${phone}&interestedEventId=${interestedEventId}&interestedEventTitle=${interestedEventTitle}`;
    
     
          return this.http.post(url,data,options).map((res:Response) => res.json()) // ...and calling .json() on the response to return data
          .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
        }
    
      private handleError(err){
            // handle error
        }

}