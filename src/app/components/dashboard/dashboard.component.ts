import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseService } from "../../services/firebase.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { FacebookService, UIParams, UIResponse ,InitParams} from 'ngx-facebook';


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
    private facebookService: FacebookService
  ) {
    this.Math=Math;
    let initParams: InitParams = {
      appId: '1950221055301408',
      xfbml: true,
      version: 'v2.10'
    };

    facebookService.init(initParams);
   }
  try;
  parseDate=Date.parse;
  today=new Date();
  todayTimestamp=Date.parse(this.today.toString());
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
  //selectedCity="";

  share(url: string) {
    
     let params: UIParams = {
      // href: 'https://github.com/zyra/ngx-facebook',
       href:url,
       method: 'share'
     };
    
     this.facebookService.ui(params)
       .then((res: UIResponse) => console.log(res))
       .catch((e: any) => console.error(e));
    
   }

  ngOnInit() {
    /* if(localStorage.getItem('city')==null){
      this.city=prompt("Enter city","Delhi");
      localStorage.setItem('city',this.city);
    } */
    
    this.reqEventsApi();


   this.getEventsFromDb(null,null,null,null,null,null,null);

     

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
  ngAfterViewChecked(){
    var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    cityDropdown.value=this.city;
  }
  
  
  removeitem(){
    alert("hi");
    this.fs.removeData();
  }


  getEventsFromDb(locationInput,categoryInput,minPriceInput,maxPriceInput,startAge,endAge,dateInput){

    var items=[];
   var spliceIndex=[];
 this.fs.filterdata('myCityCaps',this.city.toUpperCase()).valueChanges().subscribe(data=>{
   console.log(data);
   items=data.slice();
   this.allEvents=[];
   var len=items.length;
   console.log(len);

   
 for(var i=0;i<len;i++){
    
    
    if(maxPriceInput!=null && minPriceInput!=null)
    {
     if(minPriceInput>maxPriceInput || minPriceInput<0 || maxPriceInput<0)
     {  
       alert("Invalid input");
       //clear all the filter fields
       return;
     }
     if(minPriceInput>parseInt(items[i]["price"][0]["value"]) || maxPriceInput<parseInt(items[i]["price"][0]["value"])){
      spliceIndex.push(i);
     }
 
    }
 
   if(minPriceInput!=null && maxPriceInput==null){
     if(minPriceInput>parseInt(items[i]["price"][0]["value"])){
      spliceIndex.push(i);
     }
   }
 
   if(maxPriceInput!=null && minPriceInput==null){
     if(maxPriceInput<parseInt(items[i]["price"][0]["value"])){
       spliceIndex.push(i);
     }
   }
 
  } 
  console.log(spliceIndex);
  var spliceLen=spliceIndex.length;
  console.log(spliceLen);
  
  
  var len=items.length;
  console.log(len);
 console.log(items);
   
 if(locationInput!=null && data.length != spliceIndex.length){
   for(var i=0;i<items.length;i++){
     
       if(items[i]["myLocation"].toUpperCase()!=locationInput.toUpperCase()){
        if(spliceIndex.indexOf(i)==-1){
          spliceIndex.push(i);
        
        }
       
     }
   }
   }

   console.log(spliceIndex);
   var spliceLen=spliceIndex.length;
   console.log(spliceLen);
   
   console.log(items);
    var len=items.length;
    console.log(len);

    if(categoryInput!=null && data.length != spliceIndex.length){
  for(var i=0;i<len;i++){
       if(items[i]["myCategory"].toUpperCase()!=categoryInput.toUpperCase()){
         if(spliceIndex.indexOf(i)==-1){
          spliceIndex.push(i);
        
        }

       }
     }
   } 
   var len=items.length;

   for(var i=0;i<len;i++){
    
    if(endAge!=null && startAge!=null)
    {
     if(startAge>endAge || startAge<0 || endAge<0)
     {  
       alert("Invalid input");
       //clear all the filter fields
       return;
     }
     if(startAge<parseInt(items[i]["myAge"]["lower"]) && endAge<parseInt(items[i]["myAge"]["lower"]) || startAge>parseInt(items[i]["myAge"]["upper"]) && endAge>parseInt(items[i]["myAge"]["upper"])){
      
      if(spliceIndex.indexOf(i)==-1){
        spliceIndex.push(i);
      }
     }
    }
  } 
  console.log(items);
  var len=items.length;
  console.log(len);

  if(dateInput!=null && data.length != spliceIndex.length){
  for(var i=0;i<len;i++){
    
    if(dateInput!=Date.parse(items[i]["upcoming_occurrences"][0]["date"].split(':')[0])){
      if(spliceIndex.indexOf(i)==-1){
        spliceIndex.push(i);
      }
    }
  }
  }

  for(var i=0;i<items.length;i++){
    // console.log("i:" , i);
    // console.log(items.length);
  //  console.log("out");
   
    if(Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length -1]["date"].split(':')[0])<this.todayTimestamp){
      // console.log("in");
      // console.log(i);
      // console.log(Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length -1]["date"].split(':')[0]));
    //  console.log(this.todayTimestamp);
      //items.splice(i,1);
      if(spliceIndex.indexOf(i)==-1){
       spliceIndex.push(i);
     
     }
    // console.log(items.length);
    
    }
  }


  
   var spliceLen=spliceIndex.length;
   spliceIndex.sort(function(a,b){ return b - a; });
   
   for(var i=0;i<spliceLen;i++){
    items.splice(spliceIndex[i],1);
  }

  var spliceLen=spliceIndex.length;
  
  this.allEvents = items;
  
  });
  
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


  

  myOnChange(event) {
    console.log(event);
    console.log(event.from);
  }
  cityChanged(cityInput){
    // var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    this.city=cityInput;
    this.reqEventsApi();
    let that=this;
    setTimeout(function () {
      if(that.allData.length!=0){
        that.getEventsFromDb(null,null,null,null,null,null,null);
        
        }
        else{
          that.allEvents=[];
        }
      
  }, 500);
    
  }
  updateFilter(input){
    var locationInput=null;
    var cityInput=(<HTMLInputElement>document.getElementById("cityDropdown")).value;
    var lI=(<HTMLInputElement>document.getElementById("locationInput" + input));
    if(lI)
    {
      locationInput=lI.value;
    }
    var minPriceInputno=-1;
    var maxPriceInputno=-1;
    var startAge=-1;
    var endAge=-1;
    var parsedDate;
    var categoryInput=(<HTMLInputElement>document.getElementById("categoryInput" + input)).value;
    var ageInput=(<HTMLInputElement>document.getElementById("ageInput" + input)).value;
    var dateInput=(<HTMLInputElement>document.getElementById("dateInput" + input)).value;
    var minPriceInput:string=(<HTMLInputElement>document.getElementById("minPriceInput" + input)).value;
    var maxPriceInput:string=(<HTMLInputElement>document.getElementById("maxPriceInput" + input)).value;
    parsedDate=Date.parse(dateInput);
    if(isNaN(parsedDate)){
      parsedDate=null;
    }
    if (cityInput != 'No selection')
      this.city = cityInput;
    this.reqEventsApi() ;
    
    if(locationInput=='No selection'){
      locationInput=null;
    }
    if(categoryInput=='No selection'){
      categoryInput=null;
    }
    if(minPriceInput==''){
      minPriceInputno=null;
    }
    
    if(minPriceInputno!=null){
      minPriceInputno=parseInt(minPriceInput);
    }
    if(maxPriceInput==''){
      maxPriceInputno=null;
    }
    if(maxPriceInputno!=null){
      maxPriceInputno=parseInt(maxPriceInput);
    }

    if(ageInput=='No selection'){
      startAge=null;
      endAge=null;
    }

    if(ageInput[1]!='-'){
      startAge=parseInt(ageInput[0] + ageInput[1]);
      if(ageInput[2]=='-'){
        endAge=parseInt(ageInput[3] + ageInput[4]);
      }
      if(ageInput[2]=='+'){
        endAge=50;
      }
    }
    else{
      startAge=parseInt(ageInput[0]);
      if(ageInput[3]==' '){
        endAge=parseInt(ageInput[2]);
      }
      if(ageInput[4]==' '){
        endAge=parseInt(ageInput[2] + ageInput[3]);
      }
    }
    
        this.getEventsFromDb(locationInput,categoryInput,minPriceInputno,maxPriceInputno,startAge,endAge,parsedDate);
        
       
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
