import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService implements CanActivate {
    constructor(private router: Router,
        public afAuth: AngularFireAuth) { }

    canActivate() {
        /*let that = this;
        
        this.afAuth.auth.onAuthStateChanged(function (user) {

            if (user) {
                // User is signed in.
                alert("user logged in ");
                console.log(user);
                
                return true;
            }
            // No user is signed in.
            alert("user not logged in");
            this.router.navigate(['', '/'])
            return false;

        });*/
        var user = localStorage.getItem('loggedIn');
        console.log(user);
        if (user == "true") {
            alert("user logged in ");
            console.log(user);

            return true;
        }
        else {
            alert("user not logged in");
            this.router.navigate(['', '/'])
            return false;
        }
    }
}