import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userData: any = {};
  picture;
  name;
  email;
  public loading: any;
  public isGoogleLogin = false;
  public user = null;

  constructor(private google: GooglePlus, public platform: Platform, private afAuth: AngularFireAuth, private fb: Facebook) {
    this.platform.ready().then(() => {
      //alert("inicio la app");
    });
  }
              /*private googlePlus: GooglePlus*/
              

  async loginGoogle() {
    alert('entra google');
    try {
      // let res:any;
      // let provider = new firebase.auth.GoogleAuthProvider();
      // if (this.platform.is('ios') || this.platform.is('android')) {
      //   alert("entra a celular")
      //   firebase.auth().onAuthStateChanged(function(user) {
      //     alert(user);
      //   });
      //   res = await firebase.auth().getRedirectResult();
      // } else {
      //   res = await this.afAuth.signInWithPopup(provider)
      // }
      // const user = res.user;
      // alert(user);
      // this.picture = user.photoURL;
      // this.name = user.displayName;
      // this.email = user.email;


      let params: any;
      if (this.platform.is('android') || this.platform.is('ios')) {
        if (this.platform.is('android')) {
          params = {
            scopes: "",
            webClientId: '275933511417-h61b3gmjd02n3rmgvmr0mmpojng5c9f0.apps.googleusercontent.com', //  webclientID 'string'
            offline: true,
          };
        } else {
          params = {};
        }
        alert(`params ${JSON.stringify(params)}`);
        // this.google.login(params)
        // .then((response) => {
        //   alert("entro login");
        //   const { idToken, accessToken } = response;
        //   this.onLoginSuccess(idToken, accessToken);
        // }).catch((error) => {
        //   console.log(error);
        //   alert('error:' + JSON.stringify(error));
        // });
        const user = await this.google.trySilentLogin(params);
        alert(user);
        const firebaseUser = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken));
        alert(firebaseUser);
      } else{
        console.log('else...');
        this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
          console.log('success in google login', success);
          this.isGoogleLogin = true;
          this.user =  success.user;
        }).catch(err => {
          console.log(err.message, 'error in google login');
        });
      }
    } catch(e){
      // e.message; // error under useUnknownInCatchVariables 
      if (typeof e === "string") {
          alert(e.toUpperCase()); // works, `e` narrowed to string
      } else if (e instanceof Error) {
          alert(e.message); // works, `e` narrowed to Error
      }
  }

  
    
    // this.googlePlus.login({})
    //   .then(result => alert(result))
    //   .catch(err => alert(`Error ${JSON.stringify(err)}`));
  }


  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.afAuth.signInWithCredential(credential)
      .then((success) => {
        alert('successfully');
        this.isGoogleLogin = true;
        this.user =  success.user;
        this.loading.dismiss();
      });

  }

  async loginFacebook () {
    alert('entra facebook');
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.loginFacebookAndroid();
    } else {
      this.loginFacebookWeb();
    }
  }

  async loginFacebookAndroid() {
    alert("entro login android");
    const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
    alert(res);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    alert(facebookCredential);
    const resConfirmed = await this.afAuth.signInWithCredential(facebookCredential);
    alert(resConfirmed);
    const user = resConfirmed.user;
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
  }

  async loginFacebookWeb() {
    const res = await this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    const user = res.user;
    console.log(user);
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
  }

}
