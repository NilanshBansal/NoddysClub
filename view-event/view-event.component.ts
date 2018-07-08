import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Params} from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FirebaseService } from '../../services/firebase.service';
@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  constructor(private route:ActivatedRoute,
              public httpservice:HttpService,
              private fs: FirebaseService) { }

  ngOnInit() {
      this.title=this.route.snapshot.queryParamMap.get('title');
      this.occurrence=this.route.snapshot.queryParamMap.get('occurrence');
      console.log(this.occurrence);
      console.log(this.title);
      this.fs.findEvent(this.title).valueChanges().subscribe(eventObj=>{
        this.eventObj=eventObj;
        console.log(eventObj);
        if(this.eventObj==null ){
          this.noEvent=true;
        }
        if(this.eventObj.upcoming_occurrences[this.occurrence]==undefined){
          this.occurrence=0;
        }
      });
      // this.allEvents=this.httpservice.allEvents;
      // console.log(this.allEvents);

  }
  eventObj;
  noEvent=false;
  title;
  public allEvents={};
  occurrence;


}
