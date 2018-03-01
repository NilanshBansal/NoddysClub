import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseService } from "../../services/firebase.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { FacebookService, UIParams, UIResponse, InitParams } from 'ngx-facebook';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(private http: Http,
    private fs: FirebaseService,
    public fb: FormBuilder,
    public httpservice: HttpService,
    private facebookService: FacebookService,
    private router: Router,
  ) {
    this.Math = Math;
    let initParams: InitParams = {
      appId: '1950221055301408',
      xfbml: true,
      version: 'v2.10'
    };

    facebookService.init(initParams);
  }
  try;
  parseDate = Date.parse;
  today = new Date();
  todayTimestamp = Date.parse(this.today.toString());
  interestedEventTitle;
  interestedEventId;
  interestedOccurrenceDate;
  locationsForm: FormGroup;
  agesForm: FormGroup;
  userInfoForm: FormGroup;
  categoriesForm: FormGroup;
  count = 0;
  allData;
  Math: any;
  objectKeys = Object.keys;
  allEvents = [];
  td = new Date();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  todaysDate = this.td.getDate() + this.months[this.td.getMonth()] + this.td.getFullYear();
  city = "Delhi NCR";
  locations;
  eventsArray = [];
  ages;
  lastPage: boolean = false;
  categories;
  startAt = null;
  pageNo = 1;
  endAt = null;
  currentUrl;
  //selectedCity="";
  /*  check(par){
     console.log(par);
     // par=par.replace(" ","%20");
     par=par.split(" ").join("%20");
     console.log(par);
     
 
   } */
  share(url: string, title: string, imgUrl: string, venueName: string, price, date) {
    url = url.split(" ").join("%20");

    /* let params: UIParams = {
     // href: 'https://github.com/zyra/ngx-facebook',
      href:url,
      method: 'share'
    }; */


    let params: UIParams = {
      // href: 'https://github.com/zyra/ngx-facebook',
      // href:url,
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
        object: {
          'og:url': url,
          'og:title': title,
          'og:description': "Price: ₹ " + price + " Date: " + date + " Venue: " + venueName,
          // 'og:image': url + '/assets/images/logo.png',
          'og:image': imgUrl,
          'og:image:width': '1200',
          'og:image:height': '630',
          // 'og:image:type': 'image/jpeg'
        }
      })
    };

    /* let params: UIParams = {
     // href: 'https://github.com/zyra/ngx-facebook',
     // href:url,
     //  method: 'share_open_graph',
     method: 'share',
           href: url,
           'description': "Price: ₹ " + price + " Date: " + date + " Venue: " + venueName,
           // 'og:image': url + '/assets/images/logo.png',
           'picture': imgUrl,
           // 'og:image:width': '1200',
           // 'og:image:height': '630',
           // 'og:image:type': 'image/jpeg'
    }; */

    this.facebookService.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }

  ngOnInit() {
    /* if(localStorage.getItem('city')==null){
      this.city=prompt("Enter city","Delhi NCR");
      localStorage.setItem('city',this.city);
    } */

    this.reqEventsApi();

    this.currentUrl = window.location.href;
    this.getEventsFromDb(null, null, null, null, null, null, null);



    /* this.fs.findItems("locations").valueChanges().subscribe(data => {
      console.log("locations: ",data);
      this.locations = data;

    }); */
    this.fs.findObjects("locations").valueChanges().subscribe(data => {
      // console.log("locations: ",data);
      this.locations = data;

    });

    /* this.fs.findItems("ages").valueChanges().subscribe(data => {
      console.log("ages: ",data);
      this.ages = data;

    
    }); */
    this.fs.findObjects("ages").valueChanges().subscribe(data => {
      // console.log("ages: ",data);
      this.ages = data;


    });


    /* this.fs.findItems("categories").valueChanges().subscribe(data => {
      console.log("categories: ",data);
      this.categories = data;
  
      
    }); */

    this.fs.findObjects("categories").valueChanges().subscribe(data => {
      // console.log("categories: ",data);
      this.categories = data;


    });

    this.userInfoForm = this.fb.group({

      email: ['', Validators.required],
      phone: ['', Validators.required]
    });


  }
  ngAfterViewChecked() {
    var cityDropdown = (<HTMLInputElement>document.getElementById("cityDropdown"));
    cityDropdown.value = this.city;
    //console.log("dekh bhai dekh");


  }

  viewEventPage(title, allEventsClicked, occurrenceClicked) {
    this.httpservice.allEvents = allEventsClicked;
    console.log(title);

    /* this.fs.findEvent(title).valueChanges().subscribe(eventObj=>{
      console.log(eventObj);
    }); */
    this.router.navigate(['/viewEvent'], { queryParams: { 'title': title, 'occurrence': occurrenceClicked } });

  }

  removeitem() {
    alert("hi");
    this.fs.removeData();
  }


  getEventsFromDb(locationInput, categoryInput, minPriceInput, maxPriceInput, startAge, endAge, dateInput) {

    var items = [];
    var spliceIndex = [];
    this.fs.filterdata('myCityCaps', this.city.toUpperCase()).valueChanges().subscribe(data => {
      console.log(data);
      items = data.slice();
      this.allEvents = [];
      var len = items.length;
      console.log(len);


      for (var i = 0; i < len; i++) {


        if (maxPriceInput != null && minPriceInput != null) {
          if (minPriceInput > maxPriceInput || minPriceInput < 0 || maxPriceInput < 0) {
            alert("Invalid input");
            //clear all the filter fields
            return;
          }
          if (minPriceInput > parseInt(items[i]["price"][0]["value"]) || maxPriceInput < parseInt(items[i]["price"][0]["value"])) {
            spliceIndex.push(i);
          }

        }

        if (minPriceInput != null && maxPriceInput == null) {
          if (minPriceInput > parseInt(items[i]["price"][0]["value"])) {
            spliceIndex.push(i);
          }
        }

        if (maxPriceInput != null && minPriceInput == null) {
          if (maxPriceInput < parseInt(items[i]["price"][0]["value"])) {
            spliceIndex.push(i);
          }
        }

      }
      console.log(spliceIndex);
      var spliceLen = spliceIndex.length;
      console.log(spliceLen);


      var len = items.length;
      // console.log(len);
      //  console.log(items);

      if (locationInput != null && data.length != spliceIndex.length) {
        for (var i = 0; i < items.length; i++) {

          if (items[i]["myLocation"].toUpperCase() != locationInput.toUpperCase()) {
            if (spliceIndex.indexOf(i) == -1) {
              spliceIndex.push(i);

            }

          }
        }
      }

      //  console.log(spliceIndex);
      var spliceLen = spliceIndex.length;
      //  console.log(spliceLen);

      //  console.log(items);
      var len = items.length;
      // console.log(len);

      if (categoryInput != null && data.length != spliceIndex.length) {
        for (var i = 0; i < len; i++) {
          if (items[i]["myCategory"].toUpperCase() != categoryInput.toUpperCase()) {
            if (spliceIndex.indexOf(i) == -1) {
              spliceIndex.push(i);

            }

          }
        }
      }
      var len = items.length;

      for (var i = 0; i < len; i++) {

        if (endAge != null && startAge != null) {
          if (startAge > endAge || startAge < 0 || endAge < 0) {
            alert("Invalid input");
            //clear all the filter fields
            return;
          }
          if (startAge < parseInt(items[i]["myAge"]["lower"]) && endAge < parseInt(items[i]["myAge"]["lower"]) || startAge > parseInt(items[i]["myAge"]["upper"]) && endAge > parseInt(items[i]["myAge"]["upper"])) {

            if (spliceIndex.indexOf(i) == -1) {
              spliceIndex.push(i);
            }
          }
        }
      }
      // console.log(items);
      var len = items.length;
      // console.log(len);

      if (dateInput != null && data.length != spliceIndex.length) {
        for (var i = 0; i < len; i++) {

          if (dateInput != Date.parse(items[i]["upcoming_occurrences"][0]["date"].split(':')[0])) {
            if (spliceIndex.indexOf(i) == -1) {
              spliceIndex.push(i);
            }
          }
        }
      }

      for (var i = 0; i < items.length; i++) {
        // console.log("i:" , i);
        // console.log(items.length);
        //  console.log("out");

        if (Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length - 1]["date"].split(':')[0]) < this.todayTimestamp) {
          // console.log("in");
          // console.log(i);
          // console.log(Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length -1]["date"].split(':')[0]));
          //  console.log(this.todayTimestamp);
          //items.splice(i,1);
          if (spliceIndex.indexOf(i) == -1) {
            spliceIndex.push(i);

          }
          // console.log(items.length);

        }
      }



      var spliceLen = spliceIndex.length;
      spliceIndex.sort(function (a, b) { return b - a; });

      for (var i = 0; i < spliceLen; i++) {
        items.splice(spliceIndex[i], 1);
      }

      var spliceLen = spliceIndex.length;

      this.allEvents = items;

    });

  }


  reqEventsApi() {
    var fbEventObj = {};
    var fbAllData = [];
    this.allData = [];
    var alternateCity;
    if (this.city == 'Delhi NCR') {
      alternateCity = 'Delhi';
    }
    else {
      alternateCity = this.city;
    }

    var urlEventsHigh = 'https://developer.eventshigh.com/events/' + alternateCity + '?key=ev3nt5h1ghte5tK3y&cf=kids';

    this.http.get(urlEventsHigh).subscribe((data) => {
      console.log(data.json());
      this.allData = (data.json()).events;
      console.log(this.allData);
      this.fs.addEvents("events", this.allData);
    })
    //for fb events 
    var urlFb = 'https://graph.facebook.com/search?fields=name,%20description,place,start_time,end_time,picture.type(large)&oauth_token=EAAbttzk8FyABAIfOXVCv7agDpiPDBXeWEY4uFXShhQeZC6F94qJgYSAz3Q1DUuoYbLC3tDRL63Cg4X8rixZCZAnGsaWh6veqy88GlAd5KOUTubQ5C8EMpGCoYbKo0NmdNck9BkyFZBBWq59bfstAKi1kQ1TCi5YZD&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1517140071&oauth_nonce=sbHLDt&oauth_version=1.0&oauth_signature=kK2UFjbk4GQQtzYPMzmZIbrr8q0=&type=event&limit=100&q={kids,' + alternateCity + '}'
    let that = this;
    // setTimeout(function () {
      that.allData=[];
      that.http.get(urlFb).subscribe((data) => {
        console.log("fb api data: ");
        console.log(data.json());
        fbAllData = (data.json()).data;
        console.log("dekh bhai",fbAllData);
        this.fs.addEventsFb("events",fbAllData);
        this.fs.addEventsFb("fbEvents",fbAllData);
      });

    // },2000);
  }
  nextPage() {
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

  prevPage() {
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
  cityChanged(cityInput) {
    // var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    this.city = cityInput;
    this.reqEventsApi();
    let that = this;
    setTimeout(function () {
      that.getEventsFromDb(null, null, null, null, null, null, null);



    }, 500);

  }
  updateFilter(input) {
    var locationInput = null;
    var cityInput = (<HTMLInputElement>document.getElementById("cityDropdown")).value;
    var lI = (<HTMLInputElement>document.getElementById("locationInput" + input));
    if (lI) {
      locationInput = lI.value;
    }
    var minPriceInputno = -1;
    var maxPriceInputno = -1;
    var startAge = -1;
    var endAge = -1;
    var parsedDate;
    var categoryInput = (<HTMLInputElement>document.getElementById("categoryInput" + input)).value;
    var ageInput = (<HTMLInputElement>document.getElementById("ageInput" + input)).value;
    var dateInput = (<HTMLInputElement>document.getElementById("dateInput" + input)).value;
    var minPriceInput: string = (<HTMLInputElement>document.getElementById("minPriceInput" + input)).value;
    var maxPriceInput: string = (<HTMLInputElement>document.getElementById("maxPriceInput" + input)).value;
    parsedDate = Date.parse(dateInput);
    if (isNaN(parsedDate)) {
      parsedDate = null;
    }
    if (cityInput != 'No selection')
      this.city = cityInput;
    this.reqEventsApi();

    if (locationInput == 'No selection') {
      locationInput = null;
    }
    if (categoryInput == 'No selection') {
      categoryInput = null;
    }
    if (minPriceInput == '') {
      minPriceInputno = null;
    }

    if (minPriceInputno != null) {
      minPriceInputno = parseInt(minPriceInput);
    }
    if (maxPriceInput == '') {
      maxPriceInputno = null;
    }
    if (maxPriceInputno != null) {
      maxPriceInputno = parseInt(maxPriceInput);
    }

    if (ageInput == 'No selection') {
      startAge = null;
      endAge = null;
    }

    if (ageInput[1] != '-') {
      startAge = parseInt(ageInput[0] + ageInput[1]);
      if (ageInput[2] == '-') {
        endAge = parseInt(ageInput[3] + ageInput[4]);
      }
      if (ageInput[2] == '+') {
        endAge = 50;
      }
    }
    else {
      startAge = parseInt(ageInput[0]);
      if (ageInput[3] == ' ') {
        endAge = parseInt(ageInput[2]);
      }
      if (ageInput[4] == ' ') {
        endAge = parseInt(ageInput[2] + ageInput[3]);
      }
    }

    this.getEventsFromDb(locationInput, categoryInput, minPriceInputno, maxPriceInputno, startAge, endAge, parsedDate);

    if (input == "mob") {
      document.getElementById("filterBtnMob").click();
    }
  }

  submitUserForm() {
    var emailAddress = this.userInfoForm.value["email"];
    var phone = this.userInfoForm.value["phone"];
    var data = {};
    data["email"] = emailAddress;
    data["phone"] = phone;
    data["eventId"] = this.interestedEventId;
    data["eventTitle"] = this.interestedEventTitle;
    data['eventOccurrenceDate'] = this.interestedOccurrenceDate;
    this.fs.addData("interested", data);
    var closeModal = document.getElementById("closeModal");
    closeModal.click();
    this.httpservice.postEmail(emailAddress, phone, this.interestedEventId, this.interestedEventTitle, this.interestedOccurrenceDate).subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    });

  }



  interested(key, allEvents, occurrence) {
    var btn = document.getElementById("interestedBtn");
    btn.click();
    this.interestedEventTitle = allEvents[key].title;
    this.interestedEventId = allEvents[key].id;
    this.interestedOccurrenceDate = allEvents[key]['upcoming_occurrences'][occurrence]["date"].split(':')[0];

  }


  checkObject(val) {
    // return val instanceof Object;
    // console.log(val);
    // console.log(typeof val == 'object');
    return typeof val == 'object';
  }

  checkNotObject(val) {
    return typeof val !== 'object';
  }
}
