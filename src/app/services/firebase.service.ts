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
    private afs:AngularFirestore,
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
  findObjects(stringvar){
    return this.db.object('/'+ stringvar);
  }
  getEvents(stringvar){
    /* return this.db.list('/' + stringvar , {
      query: {
        orderByKey:true,
        limitToFirst:5
      }
    }); */
   return this.db.list('/' + stringvar, ref => ref.orderByKey().limitToFirst(5));
   
  }

  getEventsWithStartAt(stringvar,startAt){

    /*return this.db.list('/' + stringvar  , {
      query: {
        orderByKey:true,
         startAt: startAt,
         limitToFirst:6
      }
    }) ;*/
    return this.db.list('/' + stringvar, ref => ref.orderByKey().startAt(startAt).limitToFirst(6));
  }

  getEventsWithEndAt(stringvar,endAt){
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

  addData(stringvar, arrEvents) {
    var obj = {};
    // const itemRef = this.db.object("/" + stringvar, { preserveSnapshot: true });
    const itemRef=this.db.object("/" + stringvar);
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
      arrEvents.forEach(element => {
        element["title"] = element["title"].replace(/[\.,#,$,/,\[,\]]/g, '');

        if (snapshot.payload.val() == null || (snapshot.payload.val()!= null && snapshot.payload.val()[element["title"]] == undefined)) {
          element["adminApproved"] = false;
          obj[element["title"]] = element;

          console.log(element["title"]);
        }
      });
       console.log(obj);
       console.log(Object.keys(obj).length);
      itemRef.update(obj);
    });

  }

}