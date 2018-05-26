import { Component, OnInit } from "@angular/core"
import { Http } from "@angular/http"
import { FirebaseService } from "../../services/firebase.service";
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {
    constructor(private http: Http,
        private fs: FirebaseService,
        public httpservice: HttpService,
        private router: Router,

    ) { }
    categories;
    ages;
    locations;

    ngOnInit() {
        this.fs.findObjects("locations").valueChanges().subscribe(data => {
             console.log("locations: ",data);
            this.locations = data;

        });

        this.fs.findObjects("ages").valueChanges().subscribe(data => {
            console.log("ages: ",data);
            this.ages = data;


        });

        this.fs.findObjects("categories").valueChanges().subscribe(data => {
            console.log("categories: ",data);
            this.categories = data;


        });


    }

}