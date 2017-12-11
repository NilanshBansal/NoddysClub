import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseService } from "../../services/firebase.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(private http: Http,
    private fs: FirebaseService,
    public fb: FormBuilder,
    public httpservice:HttpService,
  ) {
    this.Math=Math;
   }
  try;
  interestedEventTitle;
  interestedEventId;
  locationsForm: FormGroup;
  agesForm: FormGroup;
  userInfoForm:FormGroup;
  categoriesForm: FormGroup;
  count = 0;
  allData;
  Math:any;
  objectKeys = Object.keys;
  allEvents =[];
  td = new Date();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  todaysDate = this.td.getDate() + this.months[this.td.getMonth()] + this.td.getFullYear();
  city = "Delhi";
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
    /* let that=this;
    setTimeout(function () {
      that.getEventsFromDb();
          alert('VIDEO HAS STOPPED');
      
  }, 5); */

   this.getEventsFromDb();

     

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

  getEventsFromDb(){
   /*  this.fs.getEvents("events").valueChanges().subscribe(data => {
      console.log(data);
      console.log(this.city.toUpperCase());
    //  var keys =Object.keys(data);
    //  console.log(keys);
    var count=0;
     data.forEach(el => {
       if(el["city"].toUpperCase()==this.city.toUpperCase()){
         console.log(el);
         this.allEvents.push(el);
         count ++;
       }
     });
     if(count==0){
      alert("count 0");
    }
    //  this.allEvents = data;
     console.log(this.allEvents);
     this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
    //  console.log(this.startAt);
   }); */
   this.fs.filterdata('city',this.city).valueChanges().subscribe(data=>{
    this.allEvents = data;
    console.log(data);
    // this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
    // console.log(this.startAt);
    if(this.allEvents.length==0){
      this.allEvents=this.allData;
      console.log(this.allData);
    }
   });
   
  
   /* const promise =new Promise((resolve, reject) => {
   this.fs.filterdata('city',this.city).valueChanges().subscribe(data=>{
    this.allEvents = data;
    console.log(data);
    this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
    console.log(this.startAt);
    resolve();
   });
   }) */
  /*  promise.then(()=>{
     console.log("hehehgdj");
    alert("resolved");
   });
    */
  }
  reqEventsApi(){
    this.allData=[];
    this.http.get('https://developer.eventshigh.com/events/' + this.city + '?key=ev3nt5h1ghte5tK3y&cf=kids').subscribe((data) => {
      console.log(data.json());
      this.allData = (data.json()).events;
      console.log(this.allData);
      this.fs.addEvents("events", this.allData);
    })
  }
  nextPage(){
    // console.log(this.startAt["$key"]);
    // console.log(this.startAt);
    //this.pageNo++;
    /* this.fs.getEventsWithStartAt("events",this.startAt.title).valueChanges().subscribe(data=>{
      //this.allEvents=data;
      if(Object.keys(this.allEvents).length == 2)
        {this.lastPage=true;}
      // console.log(data);
      // console.log("dekho");
      // console.log(data);
      // console.log(Object.keys(this.allEvents).length -1);
      var count=0;
      data.forEach(el => {
        if(el["city"].toUpperCase()==this.city.toUpperCase()){
          console.log(el);
          this.allEvents[count]=el;
          count++;
        }
      });
      if(count==0){
        alert("count 0");
      }
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
      // console.log(this.startAt);
      this.endAt=this.allEvents[0];
      delete(this.allEvents[0]);
    }); */



   /*  this.fs.filterDataWithStartAt('city','Chennai',this.startAt.title).valueChanges().subscribe(data=>{
      this.allEvents=data;
      if(Object.keys(this.allEvents).length == 2)
        {this.lastPage=true;}
      console.log(data);
      
       console.log(Object.keys(this.allEvents).length -1);
     
    
      
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
      console.log(this.startAt);
      this.endAt=this.allEvents[0];
      delete(this.allEvents[0]);
    }); */
  }

  prevPage(){
   /*  this.fs.filterDataWithEndAt('city','Chennai',this.endAt.title).valueChanges().subscribe(data=>{
      
      this.allEvents=data;
      console.log("prev: ",data);
      this.startAt=this.allEvents[Object.keys(this.allEvents).length -1];
      this.endAt=this.allEvents[0];

    }); */
  }


  ngAfterViewInit() {
    console.log("after init");

  }

  myOnChange(event) {
    console.log(event);
    console.log(event.from);
  }

  updateFilter(input){
    var locationInput=(<HTMLInputElement>document.getElementById("locationInput" + input)).value;
    console.log(locationInput);
    var categoryInput=(<HTMLInputElement>document.getElementById("categoryInput" + input)).value;
    console.log(categoryInput);
    var ageInput=(<HTMLInputElement>document.getElementById("ageInput" + input)).value;
    console.log(ageInput);
    var dateInput=(<HTMLInputElement>document.getElementById("dateInput" + input)).value;
    console.log(dateInput);
    var minPriceInput=(<HTMLInputElement>document.getElementById("minPriceInput" + input)).value;
    console.log(minPriceInput);
    var maxPriceInput=(<HTMLInputElement>document.getElementById("maxPriceInput" + input)).value;
    console.log(maxPriceInput);
    this.city=locationInput;
    this.reqEventsApi() ;
    let that=this;
    setTimeout(function () {
      if(that.allData.length!=0){
        that.getEventsFromDb();
        
        }
        else{
          that.allEvents=[];
        }
      
  }, 500);


    /* if(this.allData.length!=0){
    this.getEventsFromDb();
    
    } */
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
    this.httpservice.postEmail(emailAddress,phone,this.interestedEventId,this.interestedEventTitle).subscribe((data)=>{
      console.log(data);
    },(err)=>{
      console.log(err);
    });
  
  }

  
  
  interested(key,allEvents){
    var btn=document.getElementById("interestedBtn");
    btn.click();
    this.interestedEventTitle=allEvents[key].title;
    this.interestedEventId=allEvents[key].id;
    
    


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
