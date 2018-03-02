import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  constructor(private fs: FirebaseService,
              public fb: FormBuilder,
            private router:Router) { }
  city = "Delhi NCR";
  categories;
  locations;
  objectKeys = Object.keys;  
  curDate=new Date();
  curMonth=this.curDate.getMonth() + 1;
  nowDate=this.curDate.getFullYear() + "-" +  ("0" + this.curMonth).slice(-2) + "-" + ("0" + this.curDate.getDate()).slice(-2);
  nowTime=new Date().toLocaleTimeString();
  addForm:FormGroup;
  ngOnInit() {  
    
    this.fs.findObjects("categories").valueChanges().subscribe(data => {
      // console.log("categories: ",data);
      this.categories = data;
    });
    this.fs.findObjects("locations").valueChanges().subscribe(data => {
      console.log("locations: ",data);
      this.locations = data;
    });

    this.addForm = this.fb.group({
      
      title: ['', Validators.required],
      description: ['', Validators.required],
      // cat:this.fb.group({
        category: ['Choose a category'],
        anyOtherCategory: [''],
      // },{validator:this.catValidator}),
      
      age:this.fb.group({
        startAge: ['',Validators.required],
        endAge: ['',Validators.required],
      },{validator:this.ageValidator}),
      
      startDate:[this.nowDate,Validators.required],
      endDate:[this.nowDate,Validators.required],
      startTime:[this.nowTime,Validators.required],
      endTime:[this.nowTime,Validators.required],
      city:['Delhi NCR'],
      
      // placeGroup:this.fb.group({
        place:['Choose a place'],
        anyOtherPlace:[''],
      // },{validator:this.placeValidator}),
      
      address:['',Validators.required],
      pinCode:[''],
      price:['',Validators.required],
      email:[''],
      phone:[''],

      
    });

    /*

    {
  "title": "xcc",
  "description": "ccz",
  "category": "Sports & Outdoors",
  "anyOtherCategory": "cxzc",
  "startAge": 1,
  "endAge": 12,
  "startDate": "2018-02-17",
  "endDate": "2018-02-17",
  "startTime": "16:19:45",
  "endTime": "16:19:45",
  "city": "Delhi NCR",
  "place": "Delhi NCR",
  "anyOtherPlace": "xz",
  "address": "xZ",
  "pinCode": 1111,
  "price": 11
}



    */


  }

  placeValidator = (control: AbstractControl): {[key: string]: boolean} => {
    const place = control.get('place');
    const anyOtherPlace = control.get('anyOtherPlace');
    if (!place || !anyOtherPlace) return null;
    if(place && anyOtherPlace){
      return {nomatch:true};
    }
  };
  

  catValidator = (control: AbstractControl): {[key: string]: boolean} => {
    const category = control.get('category');
    const anyOtherCategory = control.get('anyOtherCategory');
    if (!category || !anyOtherCategory) return null;
    if(category && anyOtherCategory){
      return {nomatch:true};
    }
  };

  ageValidator = (control: AbstractControl): {[key: string]: boolean} => {
    const startAge = control.get('startAge');
    const endAge = control.get('endAge');
    
    if(startAge.value>endAge.value){
      // alert("hello");
      return  {nomatch:true};
    }
    else{
      // alert("correct");
      return null;
    }
    /* if (!place || !anyOtherPlace) return null;
    if(place && anyOtherPlace){
      return {nomatch:true};
    } */
  };
  
  ngAfterViewChecked(){
    var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    cityDropdown.value=this.city;
    //console.log("dekh bhai dekh");
  
   
  }

  submitEvent(){
    var title=this.addForm.value["title"];
    var description=this.addForm.value["description"];
    var category=this.addForm.value["category"];
    var anyOtherCategory=this.addForm.value["anyOtherCategory"];
    var startAge=this.addForm.get('age.startAge').value;
    var endAge=this.addForm.get('age.endAge').value;
    var startDate=this.addForm.value["startDate"];
    var endDate=this.addForm.value["endDate"];
    var startTime=this.addForm.value["startTime"];
    var endTime=this.addForm.value["endTime"];
    var city=this.addForm.value["city"];
    var place=this.addForm.value["place"];
    var anyOtherPlace=this.addForm.value["anyOtherPlace"];
    var address=this.addForm.value["address"];
    var pinCode=this.addForm.value["pinCode"];
    var price=this.addForm.value["price"];
    var email=this.addForm.value["email"];
    var phone=this.addForm.value["phone"];
    var myCategory;
    console.log("see",title);
    if(anyOtherCategory==""){
      anyOtherCategory=null;
    }
    if(category=="Choose a category"){
      category=null;
    }
    if(category==null){
      myCategory=anyOtherCategory;
    }
    else{
      myCategory=category;
    }
    var obj={
      "title":title,
      "description":description,
      "category":category,
      "anyOtherCategory":anyOtherCategory,
      "myCategory":myCategory,
      "startAge":startAge,
      "endAge":endAge,
      "myAge":{
        "lower":startAge,
        "upper":endAge
       },
      // "startDate":startDate,
      // "endDate":endDate,
      // "startTime":startTime,
      // "endTime":endTime,
      "city":city,
      "place":place,
      "anyOtherPlace":anyOtherPlace,
      "myPincode":pinCode,
      // "price":price,
      "img_url":'',
      "url":'',
      "booking_url":'',
      "booking_enquiry_url":'',
      "venue":{
        "name":"",
        "address":address,
        "lat":"",
        "lon":"",
        "city":city
      },
      "mySource":"noddysApp",
      "upcoming_occurrences":{
        0:{
          "date":startDate,
          "start_time":startTime,
          "end_time":endTime,
          "end_date":endDate,
          "single_occurrence":"",
          "timezone":"",
          "enable_ticketing":"",

        }
      },
      "price":{
        0:{
        
            "name": "Per Person",
            "currency": "INR",
            "value": price,
            "is_individual": 1,
            "date": "",
            "time": "",
            "all_occurrences": 1,
            "rank": 1,
            "occurrence_id": 37988610,
            "end_date": "2018-02-17",
            "end_time": "17:00:00",
            "is_valid": "Y",
            "occurrences": [
                {
                    "date": startDate,
                    "time": startTime,
                    "end_date": endDate,
                    "end_time": endTime,
                }
            ],
            "convenience_fees": "",
            "cgst": "",
            "sgst": ""
        }
        
      },
      "myContactDetails":{
        "contactPerson":"",
        "telephoneNo":phone,
        "email":email
      }
    };

    console.log(obj);
    this.fs.addObject("events",obj);
    let that=this;
    setTimeout(function(){
      that.fs.addObject("noddysEvents",obj);
    },2000);
    alert("Event added");
    this.router.navigate(['/']);
    
    
  }
  onUploadFinished(event){
    console.log(event);
    console.log(event.file);
    // event.file.webkitRelativePath="/assets/uploads/";
  }

  cityChanged(cityInput){
    // var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    this.city=cityInput;
    let that=this;

  }
  
}
