import { Component } from '@angular/core';
import { FirebaseService } from "./services/firebase.service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items;
  objects;
  constructor(private firebaseService:FirebaseService ,
              private db: AngularFireDatabase) { 

   /* this.items=this.firebaseService.items;
    this.objects=this.firebaseService.objects;
    console.log("see", this.items);
    console.log("see", this.objects);
    //  this.items = db.list('items').valueChanges();
    this.items.subscribe(data=>{
      console.log(data);
    });
    this.objects.subscribe(data=>{
      console.log(data);
    });*/
  }
  title = 'app';
}