import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: Observable<firebase.User>;
  loginForm: FormGroup;
  signupForm: FormGroup;
  signupVar: boolean = false;
  isLoggedIn: boolean = false;
  resetForm:FormGroup;

  constructor(public afAuth: AngularFireAuth,
    public fb: FormBuilder,
    public router: Router,
    private authService:AuthService) {
    this.user = afAuth.authState;
  }

  ngOnInit() {

    this.loginForm = this.fb.group({
      
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.resetForm=this.fb.group({
      email:['',Validators.required]
    });

    if (this.isLoggedIn) {
      /*this.router.navigate(['/dashboard']);*/
      alert("logged in already!");
    }

    /*if (this.signupVar) {
      this.signupForm = this.fb.group({
        name:['',[Validators.required,Validators.maxLength(30)]],
        email: ['', Validators.required],
        pass:this.fb.group({
          password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
        },{validator:this.emailMatcher})
        
      });
    }*/

  }

  signinWithGoogle() {
    let that = this;
    const promise = this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (user) {
      alert("successful rotate loader");
      that.isLoggedIn = true;
      localStorage.setItem('loggedIn','true');
    });

    promise.catch(e => {
      alert(e.message);
      console.log(e.message);
      this.isLoggedIn = false;
    });

  }

  

  signinWithFb() {
    let that = this;
    const promise = this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (user) {
      console.log(user);
      alert("successful rotate loader");
      that.isLoggedIn = true;
      localStorage.setItem('loggedIn','true');
    });

    promise.catch(e => {
      alert(e.message);
      console.log(e.message);
      this.isLoggedIn = false;
    });

  }
  

  logout() {
    alert("logout");
    this.afAuth.auth.signOut();
    this.isLoggedIn = false;
    localStorage.setItem('loggedIn','false');
  }

  signinClicked() {
    let signupbtn = document.getElementById("signUpLi");
    signupbtn.className = "";
    let signinbtn = document.getElementById("signInLi");
    signinbtn.className = "active";
    if (this.signupVar == true) {
      let earlierEmail = this.loginForm.value["email"];
      let earlierPassword = this.loginForm.value["password"];
       this.signupVar = false;
      this.loginForm = this.fb.group({
        email: [earlierEmail, Validators.required],
        password: [earlierPassword, Validators.required]
      });
    }
  }

  signupClicked() {
    let signupbtn = document.getElementById("signUpLi");
    signupbtn.className = "active";
    let signinbtn = document.getElementById("signInLi");
    signinbtn.className = "";

    let earlierEmail = "";
    let earlierPassword = "";
    let earlierConfirmPassword = "";
    let earliername="";
    // let earlieraddress="";
    // let earlierpin="";
    // let earlierphone="";
    console.log(this.signupForm);
    if (this.signupForm) {
      // earlieraddress=this.signupForm.value["address"];
      // earlierpin=this.signupForm.value["pin"];
      // earlierphone=this.signupForm.value["phone"];
      earliername=this.signupForm.value["name"];
      earlierEmail = this.signupForm.value["email"];
      earlierPassword = this.signupForm.value["password"];
      earlierConfirmPassword = this.signupForm.value["confirmPassword"];
    }

    if (this.signupVar == false) {
      this.signupVar = true;
      this.signupForm = this.fb.group({
        // address:[earlieraddress,Validators.required],
        // pin:[earlierpin,Validators.required],
        // phone:[earlierphone,Validators.required],
        name:[earliername,[Validators.required,Validators.maxLength(30)]],
        email: [earlierEmail, Validators.required],
        pass:this.fb.group({
          password: [earlierPassword, Validators.required],
        confirmPassword: [earlierConfirmPassword, Validators.required]
        },{validator:this.emailMatcher})
        
      });
    }
  }

    emailMatcher = (control: AbstractControl): {[key: string]: boolean} => {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;
  return password.value === confirm.value ? null : { nomatch: true };
};

  submitSignup() {
    if (this.signupForm.value["password"] != this.signupForm.value["confirmPassword"]) {
      alert("Password not matched!");
      return;
    }
    alert("creating user:");
    let that=this;
    const promise = this.afAuth.auth.createUserWithEmailAndPassword(this.signupForm.value["email"], this.signupForm.value["password"]).then(function (user) {
      user["name"]=that.signupForm.value["name"];
      console.log(user);
    });

    promise.catch(e => {
      console.log(e.message);

    });
  }


  verifyEmail() {
    alert("verifying");
    var curuser = firebase.auth().currentUser;

    console.log("see user", curuser);
    curuser.sendEmailVerification().then(function () {
      alert("check ur email id");
    }).catch(function (error) {
      alert(error);
    });
  }

  resetPassword() {
    // var emailAddress=prompt("Enter your email address: ","");
    var emailAddress=this.resetForm.value["email"];
    var auth = firebase.auth();
    //var curuser = firebase.auth().currentUser;
    //var emailAddress = curuser.email;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
      alert("check ur email");
    }).catch(function (error) {
      alert(error);
    });
  }
  signinWithEmailPass() {
    let that = this;
    const promise = this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value["email"], this.loginForm.value["password"]).then(function (user) {
      console.log(user);
      console.log(that.afAuth.auth.currentUser);
      that.isLoggedIn = true;
      that.router.navigate(['/dashboard']);
      localStorage.setItem('loggedIn','true');
      
    });

    promise.catch(e => {
      console.log(e.message);
      alert(e.message);
      this.isLoggedIn = false;
    });

  }


  userIsLoggedIn(){
    if(this.afAuth.auth.currentUser)
    {
      alert("user logged in: ");
      console.log(this.afAuth.auth.currentUser);
      return true;
    }
    alert("not exists");
    return false;
  }

}
