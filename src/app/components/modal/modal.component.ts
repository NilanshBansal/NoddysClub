import {Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
  <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" >
        <span *ngIf="display"><strong>{{allEvents[keyname]?.myDisplayTitle}}</strong></span>
          <ng-content select=".app-modal-header"></ng-content>
          
        </div>
        <div class="modal-body">
        <div *ngIf="display">
        <img [src]="allEvents[keyname]?.img_url">
        <br><br>
        <span *ngIf="allEvents[keyname].myCategory!=''"><b>Category: </b>{{allEvents[keyname]?.myCategory}}</span><br>
        <span ><b>Age Group: </b>{{allEvents[keyname]?.myAge["lower"] + ' - ' + allEvents[keyname]?.myAge["upper"]}}  Yrs</span><br>
        <span  style="font-size: 13px"><b>Price:</b> ₹ {{allEvents[keyname]?.price[0]['value']}}</span><br>
        <span><b>Date: </b> {{allEvents[keyname]?.upcoming_occurrences[occurrence]["date"].split(':')[0] | amParse:'YYYY-MM-DD' | amDateFormat:'LL'}}</span>  
        
        <span><b>Starts: </b>{{(allEvents[keyname]?.upcoming_occurrences[occurrence]["start_time"]| amParse:'hh:mm:ss' | amCalendar).split("at")[1]}}</span>
        <span><b>Ends: </b>{{(allEvents[keyname]?.upcoming_occurrences[occurrence]["end_time"]| amParse:'hh:mm:ss' | amCalendar).split("at")[1]}}</span><br>
        <span><b>Venue: </b>{{allEvents[keyname]?.venue["name"] + ", " }}</span><br>
        <span>{{allEvents[keyname]?.venue["address"] + ", " + allEvents[keyname]?.venue["city"]}}</span><br>
        <span *ngIf="allEvents[keyname].myLocation!=''"><b>Locality: </b>{{allEvents[keyname]?.myLocation}}</span>
        <span *ngIf="allEvents[keyname].myPincode!=''"><b>Pincode: </b>{{ allEvents[keyname]?.myPincode}}</span><br>
       
        <span *ngIf="allEvents[keyname].myContactDetails['contactPerson']!=''"><b>Contact Person : </b>{{ allEvents[keyname]?.myContactDetails["contactPerson"]}}</span>
        <span *ngIf="allEvents[keyname].myContactDetails['telephoneNo']!=''"><b>Tel : </b>{{ allEvents[keyname]?.myContactDetails["telephoneNo"]}}</span><br>
        
        <span  style="font-size: 13px" [innerHTML]="allEvents[keyname]?.description"></span>
        <span *ngIf="allEvents[keyname].url!=''"><b>Booking Url : </b><a [href]="allEvents[keyname]?.url">{{allEvents[keyname]?.url}}</a></span>
        
        
        

        </div>
        

        <br>
          <ng-content select=".app-modal-body"></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select=".app-modal-footer"></ng-content>
        </div>
      </div>
    </div>
  </div>
  ` ,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  public visible = false;
  public visibleAnimate = false;
  public keyname;
  public occurrence;
  public display:boolean=false;
  public allEvents={};
  public show(key,allEvents,display,occurrence): void {
    this.keyname=key;
    this.allEvents=allEvents;
    this.display=display;
    this.occurrence=occurrence;
    console.log(this.allEvents);
    
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }
  public showReset(): void{
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}
