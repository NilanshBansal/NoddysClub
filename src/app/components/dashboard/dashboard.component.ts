import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseService } from "../../services/firebase.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(private http: Http,
    private fs: FirebaseService,
    public fb: FormBuilder
  ) { }
  try;
  interestedEventTitle;
  interestedEventId;
  locationsForm: FormGroup;
  agesForm: FormGroup;
  userInfoForm:FormGroup;
  categoriesForm: FormGroup;
  count = 0;
  allData;
  objectKeys = Object.keys;
  allEvents = {};
  td = new Date();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  todaysDate = this.td.getDate() + this.months[this.td.getMonth()] + this.td.getFullYear();
  city = "delhi";
  locations;
  eventsArray = [];
  ages;
  lastPage:boolean=false;
  categories;
  startAt=null;
  pageNo=1;
  endAt=null;

  ngOnInit() {
    this.reqEventsApi();
    

   

     this.fs.getEvents("events").valueChanges().subscribe(data => {
       console.log(data);
      this.allEvents = data;
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
     
    });


    /* this.fs.findItems("locations").valueChanges().subscribe(data => {
      console.log("locations: ",data);
      this.locations = data;

    }); */
    this.fs.findObjects("locations").valueChanges().subscribe(data => {
      console.log("locations: ",data);
      this.locations = data;

    });
 
    /* this.fs.findItems("ages").valueChanges().subscribe(data => {
      console.log("ages: ",data);
      this.ages = data;

    
    }); */
    this.fs.findObjects("ages").valueChanges().subscribe(data => {
      console.log("ages: ",data);
      this.ages = data;

    
    });

   
  /* this.fs.findItems("categories").valueChanges().subscribe(data => {
    console.log("categories: ",data);
    this.categories = data;

    
  }); */

  this.fs.findObjects("categories").valueChanges().subscribe(data => {
    console.log("categories: ",data);
    this.categories = data;

    
  });
 
  this.userInfoForm = this.fb.group({
    
    email: ['', Validators.required],
    phone: ['', Validators.required]
  });


  }

  reqEventsApi(){
    this.http.get('https://developer.eventshigh.com/events/' + this.city + '?key=ev3nt5h1ghte5tK3y&cf=kids').subscribe((data) => {
      this.allData = data.json();
      console.log(this.allData);
      this.fs.addEvents("events", this.allData.events);

    })
  }
  nextPage(){
    // console.log(this.startAt["$key"]);
    console.log(this.startAt);
    //this.pageNo++;
    this.fs.getEventsWithStartAt("events",this.startAt.title).valueChanges().subscribe(data=>{
      this.allEvents=data;
      if(Object.keys(this.allEvents).length == 2)
        {this.lastPage=true;}
      // console.log(data);
      // console.log("dekho");
      // console.log(data);
      // console.log(Object.keys(this.allEvents).length -1);
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
      // console.log(this.startAt);
      this.endAt=this.allEvents[0];
      delete(this.allEvents[0]);
    });
  }

  prevPage(){
    this.fs.getEventsWithEndAt("events",this.endAt.title).valueChanges().subscribe(data=>{
      this.allEvents=data;
      // console.log("prev: ",data);
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
      this.endAt=this.allEvents[0];

    });
  }


  ngAfterViewInit() {
    console.log("after init");

  }

  myOnChange(event) {
    console.log(event);
    console.log(event.from);
  }


  submitUserForm(){
    var emailAddress=this.userInfoForm.value["email"];
    var phone=this.userInfoForm.value["phone"];
    var data={};
    data["email"]=emailAddress;
    data["phone"]=phone;
    data["eventId"]=this.interestedEventId;
    data["eventTitle"]=this.interestedEventTitle;
    this.fs.addData("interested",data);
    var closeModal=document.getElementById("closeModal");
    closeModal.click();

  }
  
  interested(key,allEvents){
    var btn=document.getElementById("interestedBtn");
    btn.click();
    this.interestedEventTitle=allEvents[key].title;
    this.interestedEventId=allEvents[key].id;
    var locationInput=<HTMLInputElement>document.getElementById("locationInput");
    console.log(locationInput.value);
    var categoryInput=<HTMLInputElement>document.getElementById("categoryInput");
    console.log(categoryInput.value);
    var ageInput=<HTMLInputElement>document.getElementById("ageInput");
    console.log(ageInput.value);
    var dateInput=<HTMLInputElement>document.getElementById("dateInput");
    console.log(dateInput.value);
    var minPriceInput=<HTMLInputElement>document.getElementById("minPriceInput");
    console.log(minPriceInput.value);
    var maxPriceInput=<HTMLInputElement>document.getElementById("maxPriceInput");
    console.log(maxPriceInput.value);

  }


  checkObject(val){
    // return val instanceof Object;
    // console.log(val);
    // console.log(typeof val == 'object');
    return typeof val == 'object';
  }

  checkNotObject(val){
    return typeof val !== 'object';
  }
}
