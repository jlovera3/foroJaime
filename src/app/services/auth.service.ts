import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User;

  constructor(private local: NativeStorage,
    private google: GooglePlus,
    private router:Router,
    private platform: Platform,
    private fb: Facebook,
    private afAuth: AngularFireAuth) { }

  public async checkSession(): Promise<void> {
    if (!this.user) {
      try {
        this.user = await this.local.getItem('user')
      } catch (err) {
        this.user = null;
      }
    }
  }

  public isAuthenticated(): boolean {
    var autent =false;
    if(this.user){
      autent=true;
    }
    return autent;
  }
  /**
   * Almacena el usuario en local con el nombre 'user'
   * @param user el usuario a almacenar, en caso de omisión
   * saveSession() emilinará el usuario-> se emplea cuando cerramos
   * sesión.
   */
  public saveSession(user?:User){
    if(user){
      this.local.setItem('user',user);
    }else{
      this.local.remove('user');
    }
  }


  public loginGoogle():Promise<boolean> {
    return new Promise((resolve,reject)=>{
        //lógica
        this.google.login({})
        .then(d => {
          if (d && d.email) {
            console.log(d);
            let user: User = {
              email: d.email,
              displayName: d.displayName,
              imageUrl: d.imageUrl,
              type: 'Google'
            }
            console.log(user.imageUrl);
            this.user=user;
            this.local.setItem('avatar', user.imageUrl);
            this.saveSession(user);
            this.router.navigate(['tabs']);
            resolve(true);
          }else{
            resolve(false);
          }
        })
        .catch(err => resolve(false));
    });
  }
  public async logout(){
    this.local.remove('user');    
    this.local.remove('avatar');
    if(this.user.type=='Google'){
      this.user=null;
      this.google.logout();
      this.router.navigate(['login']);
    }else{
      this.user=null;
      this.fb.logout();
      this.router.navigate(['login']);
    }
  }

  public loginFacebook() {
    /*return new Promise((resolve,reject)=>{
        this.fb.login(['email'])
        .then((response:FacebookLoginResponse) => {
          this.loginWithFacebook(response.authResponse.accessToken);
        }).catch((error) => {
          alert('error:' + JSON.stringify(error))
        });
        console.log('saliendo con fb en cordova')
        this.router.navigate(['tabs']);
        resolve(true);
    });*/
      this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => this.getUserInfo(res.authResponse.userID))
      .catch();
      
  }

  getUserInfo(userId: string) {
    this.fb.api('me?fields=' + ['name', 'email', 'picture.type(large)'].join(), null)
    .then(d => {
      if (d && d.email) {
        console.log(d);
        let user: User = {
          email: d.email,
          displayName: d.name,
          imageUrl: d.picture.data.url,
          type: 'Facebook'
        }
        console.log(user.email);
        this.user=user;
        this.saveSession(user);
        this.local.setItem('avatar', user.imageUrl);
        this.router.navigate(['tabs']);
      }else{
      }
    })
    .catch();
  }
  
  
  loginWithFacebook(accessToken) {
    //this.loginType = 'Login with Facebook'
    const credential = firebase.auth.FacebookAuthProvider
        .credential(accessToken);
    return this.afAuth.signInWithCredential(credential)
  }

  fbLogin(): Promise<any> {
    //this.loginType = 'Login with Facebook'
    return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  }


}