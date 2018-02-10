import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  constructor(private fs: FirebaseService,) { }
  count=1;
  city = "Delhi NCR";
  categories;
  locations;
  objectKeys = Object.keys;  
  curDate=new Date();
  curMonth=this.curDate.getMonth() + 1;
  nowDate=this.curDate.getFullYear() + "-" +  ("0" + this.curMonth).slice(-2) + "-" + ("0" + this.curDate.getDate()).slice(-2);
  nowTime=new Date().toLocaleTimeString();
  numbers=[1];
  ngOnInit() {  
    
    this.fs.findObjects("categories").valueChanges().subscribe(data => {
      // console.log("categories: ",data);
      this.categories = data;
    });
    this.fs.findObjects("locations").valueChanges().subscribe(data => {
      console.log("locations: ",data);
      this.locations = data;
    });

  }

  ngAfterViewChecked(){
    var cityDropdown=(<HTMLInputElement>document.getElementById("cityDropdown"));
    cityDropdown.value=this.city;
    //console.log("dekh bhai dekh");
  
   
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
  addOccurrence(){
    this.count++;
    this.numbers.push(this.count);
    console.log(this.count);
    console.log(this.numbers);
  }
  deleteOccurrence(){
    this.count--;
    this.numbers.pop();
    console.log(this.count);
    console.log(this.numbers);
    var occurrenceDiv=(<HTMLCollectionOf<Element>>document.getElementsByClassName("occurrenceDiv"));
    if(occurrenceDiv.length>1){
      occurrenceDiv[occurrenceDiv.length-1].remove();
    }
  }

}
