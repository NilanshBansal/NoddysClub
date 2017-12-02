import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {RouterModule,Routes} from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MomentModule } from 'angular2-moment';
import { HttpModule } from '@angular/http';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
 import { FirebaseService } from "./services/firebase.service";
import { HomeComponent } from "./components/home/home.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ModalComponent } from "./components/modal/modal.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthService } from "./services/auth.service";

import { AngularFirestoreModule } from 'angularfire2/firestore';
import * as $ from 'jquery';
import { AddEventComponent } from './components/add-event/add-event.component'; 
import { HttpService } from './services/http.service';
export const firebaseConfig = {
  
  
  apiKey: "AIzaSyAKt-m1_bzokNg-2ZKQYLycN8yfbNo_ipc",
  authDomain: "noddysclub-6d0a4.firebaseapp.com",
  databaseURL: "https://noddysclub-6d0a4.firebaseio.com",
  projectId: "noddysclub-6d0a4",
  storageBucket: "noddysclub-6d0a4.appspot.com",
  messagingSenderId: "155131590327"
  
};



const appRoutes:Routes=[
  /* {path:'',component:HomeComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthService]}, */
  {path:'',component:DashboardComponent},
  {path:'login',component:HomeComponent},
  {path:'addevent',component:AddEventComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ModalComponent,
    DashboardComponent,
    AddEventComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(appRoutes),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    IonRangeSliderModule,
    AngularFirestoreModule,
  
  ],
  providers: [FirebaseService,AuthService,HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
