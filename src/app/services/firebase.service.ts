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
    /* itemRef.subscribe(snapshot => {
      arrEvents.forEach(element => {
        element["title"] = element["title"].replace(/[\.,#,$,/,\[,\]]/g, '');

        if (snapshot.val() == null || (snapshot.val() != null && snapshot.val()[element["title"]] == undefined)) {
          element["adminApproved"] = false;
          obj[element["title"]] = element;

          console.log(element["title"]);
        }
      });
       console.log(obj);
       console.log(Object.keys(obj).length);
      itemRef.update(obj);
    }); */

    itemRef.snapshotChanges().subscribe(snapshot => {
      //console.log("checking");
      obj={};
      arrEvents.forEach(element => {
        element["title"] = element["title"].replace(/[\.,#,$,/,\[,\]]/g, '');
        //console.log(element["title"] );
        if (snapshot.payload.val() == null || (snapshot.payload.val() != null && snapshot.payload.val()[element["title"]] == undefined)) {
          //console.log("dekhoji");
          element["myAdminApproved"] = true;
          element["myDisplayTitle"]=element["title"];
          element["myLocation"]="";
          element["myPincode"]="";
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



