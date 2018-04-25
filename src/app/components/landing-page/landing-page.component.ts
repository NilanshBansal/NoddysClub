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

    /* updateFilter(input) {
        var locationInput = null;
        var cityInput = (<HTMLInputElement>document.getElementById("cityDropdown")).value;
        var lI = (<HTMLInputElement>document.getElementById("locationInput" + input));
        if (lI) {
            locationInput = lI.value;
        }
        var minPriceInputno = -1;
        var maxPriceInputno = -1;
        var startAge = -1;
        var endAge = -1;
        var parsedDate;
        var categoryInput = (<HTMLInputElement>document.getElementById("categoryInput" + input)).value;
        var ageInput = (<HTMLInputElement>document.getElementById("ageInput" + input)).value;
        var dateInput = (<HTMLInputElement>document.getElementById("dateInput" + input)).value;
        var minPriceInput: string = (<HTMLInputElement>document.getElementById("minPriceInput" + input)).value;
        var maxPriceInput: string = (<HTMLInputElement>document.getElementById("maxPriceInput" + input)).value;
        parsedDate = Date.parse(dateInput);
        if (isNaN(parsedDate)) {
            parsedDate = null;
        }
        if (cityInput != 'No selection')
            this.city = cityInput;
        this.reqEventsApi();

        if (locationInput == 'No selection') {
            locationInput = null;
        }
        if (categoryInput == 'No selection') {
            categoryInput = null;
        }
        if (minPriceInput == '') {
            minPriceInputno = null;
        }

        if (minPriceInputno != null) {
            minPriceInputno = parseInt(minPriceInput);
        }
        if (maxPriceInput == '') {
            maxPriceInputno = null;
        }
        if (maxPriceInputno != null) {
            maxPriceInputno = parseInt(maxPriceInput);
        }

        if (ageInput == 'No selection') {
            startAge = null;
            endAge = null;
        }

        if (ageInput[1] != '-') {
            startAge = parseInt(ageInput[0] + ageInput[1]);
            if (ageInput[2] == '-') {
                endAge = parseInt(ageInput[3] + ageInput[4]);
            }
            if (ageInput[2] == '+') {
                endAge = 50;
            }
        }
        else {
            startAge = parseInt(ageInput[0]);
            if (ageInput[3] == ' ') {
                endAge = parseInt(ageInput[2]);
            }
            if (ageInput[4] == ' ') {
                endAge = parseInt(ageInput[2] + ageInput[3]);
            }
        }

        this.getEventsFromDb(locationInput, categoryInput, minPriceInputno, maxPriceInputno, startAge, endAge, parsedDate);

        if (input == "mob") {
            document.getElementById("filterBtnMob").click();
        }
    }



    getEventsFromDb(locationInput, categoryInput, minPriceInput, maxPriceInput, startAge, endAge, dateInput) {

        var items = [];
        var spliceIndex = [];
        this.fs.filterdata('myCityCaps', this.city.toUpperCase()).valueChanges().subscribe(data => {
            console.log(data);
            items = data.slice();
            this.allEvents = [];
            var len = items.length;
            console.log(len);


            for (var i = 0; i < len; i++) {


                if (maxPriceInput != null && minPriceInput != null) {
                    if (minPriceInput > maxPriceInput || minPriceInput < 0 || maxPriceInput < 0) {
                        alert("Invalid input");
                        //clear all the filter fields
                        return;
                    }
                    if (minPriceInput > parseInt(items[i]["price"][0]["value"]) || maxPriceInput < parseInt(items[i]["price"][0]["value"])) {
                        spliceIndex.push(i);
                    }

                }

                if (minPriceInput != null && maxPriceInput == null) {
                    if (minPriceInput > parseInt(items[i]["price"][0]["value"])) {
                        spliceIndex.push(i);
                    }
                }

                if (maxPriceInput != null && minPriceInput == null) {
                    if (maxPriceInput < parseInt(items[i]["price"][0]["value"])) {
                        spliceIndex.push(i);
                    }
                }

            }
            console.log(spliceIndex);
            var spliceLen = spliceIndex.length;
            console.log(spliceLen);


            var len = items.length;
            // console.log(len);
            //  console.log(items);

            if (locationInput != null && data.length != spliceIndex.length) {
                for (var i = 0; i < items.length; i++) {

                    if (items[i]["myLocation"].toUpperCase() != locationInput.toUpperCase()) {
                        if (spliceIndex.indexOf(i) == -1) {
                            spliceIndex.push(i);

                        }

                    }
                }
            }

            //  console.log(spliceIndex);
            var spliceLen = spliceIndex.length;
            //  console.log(spliceLen);

            //  console.log(items);
            var len = items.length;
            // console.log(len);

            if (categoryInput != null && data.length != spliceIndex.length) {
                for (var i = 0; i < len; i++) {
                    if (items[i]["myCategory"].toUpperCase() != categoryInput.toUpperCase()) {
                        if (spliceIndex.indexOf(i) == -1) {
                            spliceIndex.push(i);

                        }

                    }
                }
            }
            var len = items.length;

            for (var i = 0; i < len; i++) {

                if (endAge != null && startAge != null) {
                    if (startAge > endAge || startAge < 0 || endAge < 0) {
                        alert("Invalid input");
                        //clear all the filter fields
                        return;
                    }
                    if (startAge < parseInt(items[i]["myAge"]["lower"]) && endAge < parseInt(items[i]["myAge"]["lower"]) || startAge > parseInt(items[i]["myAge"]["upper"]) && endAge > parseInt(items[i]["myAge"]["upper"])) {

                        if (spliceIndex.indexOf(i) == -1) {
                            spliceIndex.push(i);
                        }
                    }
                }
            }
            // console.log(items);
            var len = items.length;
            // console.log(len);

            if (dateInput != null && data.length != spliceIndex.length) {
                for (var i = 0; i < len; i++) {

                    if (dateInput != Date.parse(items[i]["upcoming_occurrences"][0]["date"].split(':')[0])) {
                        if (spliceIndex.indexOf(i) == -1) {
                            spliceIndex.push(i);
                        }
                    }
                }
            }

            for (var i = 0; i < items.length; i++) {
                // console.log("i:" , i);
                // console.log(items.length);
                //  console.log("out");

                if (Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length - 1]["date"].split(':')[0]) < this.todayTimestamp) {
                    // console.log("in");
                    // console.log(i);
                    // console.log(Date.parse(items[i]["upcoming_occurrences"][items[i]["upcoming_occurrences"].length -1]["date"].split(':')[0]));
                    //  console.log(this.todayTimestamp);
                    //items.splice(i,1);
                    if (spliceIndex.indexOf(i) == -1) {
                        spliceIndex.push(i);

                    }
                    // console.log(items.length);

                }
            }



            var spliceLen = spliceIndex.length;
            spliceIndex.sort(function (a, b) { return b - a; });

            for (var i = 0; i < spliceLen; i++) {
                items.splice(spliceIndex[i], 1);
            }

            var spliceLen = spliceIndex.length;

            this.allEvents = items;

        });

    } */
}