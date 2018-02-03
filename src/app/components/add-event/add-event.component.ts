import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  constructor(private fs: FirebaseService,) { }
  
  categories;
  curDate=new Date();
  curMonth=this.curDate.getMonth() + 1;
  nowDate=this.curDate.getFullYear() + "-" +  ("0" + this.curMonth).slice(-2) + "-" + ("0" + this.curDate.getDate()).slice(-2);
  nowTime=new Date().toLocaleTimeString();
  ngOnInit() {  
    this.fs.findObjects("categories").valueChanges().subscribe(data => {
      // console.log("categories: ",data);
      this.categories = data;
    });
  }

}
