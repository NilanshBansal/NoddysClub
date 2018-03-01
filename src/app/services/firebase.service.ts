import { Injectable } from '@angular/core';
import { AngularFireDatabase/* , FirebaseListObservable, FirebaseObjectObservable */ } from 'angularfire2/database';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseService {
  public items: Observable<any[]>;
  public objects: Observable<any[]>;
  //  items: FirebaseListObservable<any[]>;
  //  objects: FirebaseObjectObservable<any[]>;

  constructor(private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private router: Router,
    public afAuth: AngularFireAuth) {

    /*this.items = db.list('/items');
    console.log(this.items);
    console.log("oehoe");
    this.objects=db.object('/items');
    console.log(this.objects.$ref);
    
   this.objects.subscribe(data=>{
     console.log(data);
   });*/
    //  this.itemDoc = afs.doc<Item>('items/1');
    //  this.item = this.itemDoc.valueChanges();

  }


  findItems(stringvar) {
    /*this.items = this.db.list('items');
     console.log(this.items);
     this.items = this.db.list('items');
     console.log("oehoe");
     this.objects=this.db.object('/items');
     console.log(this.objects.$ref);*/
    //return this.db.list('/' + stringvar);
    return this.db.list('/' + stringvar);

    /* this.objects = this.db.object("/" + stringvar);
    return this.objects; */


  }
  findEvent(eventid){
    // return this.db.list('/events',ref=>ref.orderByKey().equalTo(eventid));
   // return this.db.list('/events',ref=>ref.child(eventid));
    return this.db.object('/events/' + eventid);
  
  }
  findObjects(stringvar) {
    return this.db.object('/' + stringvar);
  }
  getEvents(stringvar) {
    /* return this.db.list('/' + stringvar , {
      query: {
        orderByKey:true,
        limitToFirst:5
      }
    }); */
    return this.db.list('/' + stringvar, ref => ref.orderByKey().limitToFirst(5));

  }
  
  getEventsWithStartAt(stringvar, startAt) {

    /*return this.db.list('/' + stringvar  , {
      query: {
        orderByKey:true,
         startAt: startAt,
         limitToFirst:6
      }
    }) ;*/
    return this.db.list('/' + stringvar, ref => ref.orderByKey().startAt(startAt).limitToFirst(6));
  }

  getEventsWithEndAt(stringvar, endAt) {
    /*console.log(endAt);
    return this.db.list('/' + stringvar  , {
      query: {
        orderByKey:true,
         endAt: endAt,
         limitToLast:5
      }
    } );*/
    return this.db.list('/' + stringvar, ref => ref.orderByKey().endAt(endAt).limitToLast(5));
  }
filterdata(order,equal){
  // return this.db.list('/events', ref => ref.orderByChild(order).equalTo(equal).limitToFirst(5));
  return this.db.list('/events', ref => ref.orderByChild(order).equalTo(equal));
}

/* filterDataWithStartAt(order,equal,startAt){
  return this.db.list('/events' , ref => ref.orderByChild(order).startAt(startAt).equalTo(equal).limitToFirst(6));
  
} */

/* filterDataWithEndAt(order,equal,endAt){
   return this.db.list('/events' , ref => ref.orderByChild(order).equalTo(equal).endAt(endAt).limitToLast(5));
  

  //  ref
  // .orderBy('genre')
  // .equalTo('comedy')
  // .on('child_added', function(snapshot) { 
  //     var movie = snapshot.val();
  //     if (movie.lead == 'Jack Nicholson') {
  //         console.log(movie);
  //     }
  // });
 
} */

  addEvents(stringvar, arrEvents) {
    let obj = {};
    // const itemRef = this.db.object("/" + stringvar, { preserveSnapshot: true });
    const itemRef = this.db.object("/" + stringvar);
  
  
    itemRef.snapshotChanges().subscribe(snapshot => {
      obj={};
      arrEvents.forEach(element => {
        element["title"] = element["title"].replace(/[\.,#,$,/,\[,\]]/g, '');
        if (snapshot.payload.val() == null || (snapshot.payload.val() != null && snapshot.payload.val()[element["title"]] == undefined)) {
          element["myAdminApproved"] = true;
          element["myDisplayTitle"]=element["title"];
          element["myLocation"]="";
         
          // element["myLocationCaps"]="";
          if(element["city"]=='Delhi'){
            element["myCity"]='Delhi NCR';
            element["myCityCaps"]=element["myCity"].toUpperCase();
          }
          else{
            element["myCityCaps"]=element["city"].toUpperCase();
          
          }
          element["myCategory"]=element["cats"][0];
          // element["myCategoryCaps"]="";
          element["myContactDetails"]={
            "telephoneNo":"",
            "contactPerson":""
          };
          element["myAge"]={
           "lower":0,
           "upper":18
          };
          obj[element["myDisplayTitle"]] = element;
          //console.log(element["myDisplayTitle"]);
        }
      });
      console.log(obj);
      //console.log(Object.keys(obj).length);
      itemRef.update(obj);
      // console.log("done");
    });

  }
  addEventsFb(stringvar, arrEvents){
    let obj={};
    const itemRef = this.db.object("/" + stringvar);
    itemRef.snapshotChanges().subscribe(snapshot => {
      obj={};
      arrEvents.forEach(element => {
        var startDateTime=new Date(element["start_time"]);
        var endDateTime=new Date(element["end_time"]);
        var startTime=(startDateTime.getHours()<10?'0':'') + startDateTime.getHours() +"-"+ (startDateTime.getMinutes()<10?'0':'') + startDateTime.getMinutes(); 
        var startDate=(startDateTime.getFullYear()).toString()+"-"+(startDateTime.getMonth()+1).toString()+"-"+(startDateTime.getDay()).toString() + ":" + startTime;
        var endTime=(endDateTime.getHours()<10?'0':'') + endDateTime.getHours() +"-"+ (endDateTime.getMinutes()<10?'0':'') + endDateTime.getMinutes();
        var endDate=(endDateTime.getFullYear()).toString()+"-"+(endDateTime.getMonth()+1).toString()+"-"+(endDateTime.getDay()).toString() + ":" + endTime;
        element["title"] = element["name"].replace(/[\.,#,$,/,\[,\]]/g, '');
       if (snapshot.payload.val() == null || (snapshot.payload.val() != null && snapshot.payload.val()[element["title"]] == undefined)) {
          element["booking_enquiry_url"]='';
          element["booking_url"]='';
          element["category"]='';
          element["myCategory"]='';
          if("picture" in element && "data" in  element["picture"] && "url" in element["picture"]["data"])
            element["img_url"] = element["picture"]["data"]["url"];

           element["myAdminApproved"] = true;
          element["myDisplayTitle"]=element["title"];
          element["myLocation"]="";
          element["myPincode"]="";
          if("place" in element && "location" in element["place"] && "zip" in element["place"]["location"])
            element["myPincode"]=element["place"]["location"]["zip"];
          
         
          element["price"] = {
            0: {
              "currency": "INR",
              "value": "Not Specified",
              "date": "",
              "time": "",
              "all_occurrences": 1,
              "end_date": "",
              "end_time": "",
              "is_valid": "Y",
              "occurrences": [
                {
                  "date": "",
                  "time": "",
                  "end_date": "",
                  "end_time": "",
                }
              ],
              "convenience_fees": "",
              "cgst": "",
              "sgst": ""
            }
          };
         
          element["url"] = "";
          var street="";
          var city="";
          var latitude="";
          var longitude="";
          if(("place" in element && "location" in element["place"]) && "street" in element["place"]["location"])
            street=element["place"]["location"]["street"];
          
          if(("place" in element && "location" in element["place"]) && "city" in element["place"]["location"])
            city=element["place"]["location"]["city"];
          
          if(("place" in element && "location" in element["place"]) && "latitude" in element["place"]["location"])
            latitude=element["place"]["location"]["latitude"];
          
          if(("place" in element && "location" in element["place"]) && "longitude" in element["place"]["location"])
            longitude=element["place"]["location"]["longitude"];

          element["venue"]={};
          element["venue"] = {
            "name": "",
            "address": street,
            "city": city,
            "lat": latitude,
            "lon": longitude
          };
          
          element["upcoming_occurrences"] = {
            0: {
              "date": startDate,
              "start_time": startTime,
              "end_time": endTime,
              "end_date": endDate,
              "single_occurrence": "",
              "timezone": "",
              "enable_ticketing": "",
            }
          };
          
          element["myAge"]={
            "lower":0,
            "upper":18
           };
           element["city"]=city;
           if(element["city"]=='Delhi' || element["city"]=='New Delhi'){
            element["myCity"]='Delhi NCR';
            element["myCityCaps"]=element["myCity"].toUpperCase();
          }
          else{
            element["myCityCaps"]=element["city"].toUpperCase();
          
          }
          element["myContactDetails"]={
            "telephoneNo":"",
            "contactPerson":""
          };  
          // element["myLocationCaps"]="";
        }
        obj[element["title"]] = element;
      }); 
      console.log(obj);
      //console.log(Object.keys(obj).length);
      itemRef.update(obj);
      // console.log("done");
    });

  }
  addObject(stringvar,element){
    const itemRef = this.db.object("/" + stringvar);
    var obj={};
    itemRef.snapshotChanges().subscribe(snapshot => {

      element["title"] = element["title"].replace(/[\.,#,$,/,\[,\]]/g, '');
      //console.log(element["title"] );
      if (snapshot.payload.val() == null || (snapshot.payload.val() != null && snapshot.payload.val()[element["title"]] == undefined)) {
        //console.log("dekhoji");
        element["myAdminApproved"] = true;
        element["myDisplayTitle"]=element["title"];
        element["myLocation"]="";
        // element["myPincode"]="";
        // element["myLocationCaps"]="";
        if(element["city"]=='Delhi'){
          element["myCity"]='Delhi NCR';
          element["myCityCaps"]=element["myCity"].toUpperCase();
        }
        else{
          element["myCityCaps"]=element["city"].toUpperCase();
        
        }
        // element["myCategory"]=element["cats"][0];
        // element["myCategoryCaps"]="";
        element["myContactDetails"]={
          "telephoneNo":"",
          "contactPerson":""
        };
        // element["myAge"]={
        //  "lower":0,
        //  "upper":18
        // };
        obj[element["myDisplayTitle"]] = element;
        //console.log(element["myDisplayTitle"]);
      }
      console.log(obj);
      itemRef.update(obj);
    });
    
  }

  addData(stringvar, objvar) {
    var obj = {};
    const itemRef = this.db.list("/" + stringvar);
    console.log(objvar);
    console.log(itemRef);
    
    itemRef.push(objvar);
  }
  removeData(){

    const itemRef = this.db.list("/events");
    itemRef.remove();
  }
}



