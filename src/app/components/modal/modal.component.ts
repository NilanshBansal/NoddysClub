import {Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
  <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" >
        <span *ngIf="display"><strong>{{allEvents[keyname]?.title}}</strong></span>
          <ng-content select=".app-modal-header"></ng-content>
          
        </div>
        <div class="modal-body">
        
        
        <span *ngIf="display" style="font-size: 13px" [innerHTML]="allEvents[keyname]?.description"></span>
        
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
  public display:boolean=false;
  public allEvents={};
  public show(key,allEvents,display): void {
    this.keyname=key;
    this.allEvents=allEvents;
    this.display=display;
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