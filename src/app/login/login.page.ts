import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UiComponent } from '../common/ui/ui.component';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { User } from '../model/User';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public usuario: User;

  constructor(private auth:AuthService,
    private ui:UiComponent,
    private router:Router) {
    }
     
    

  ngOnInit() {
  }
  
  public async loginGoogle(){
    this.ui.presentLoading();
    const r:boolean= await this.auth.loginGoogle();
    this.ui.hideLoading();
    if(r){
      this.router.navigate(['tabs']);
    }
    //OCULTAR
  }

  public async loginFacebook(){
    await this.auth.loginFacebook();
    this.router.navigate(['tabs']);
  }

    
/*  loginFacebook() {
    if (this.platform.is('capacitor')) {
      this.loginFacebookAndroid();
    } else {
      this.loginFacebookWeb();
    }
  }

  public async loginFacebookAndroid() {
    const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    const resConfirmed = await this.afAuth.signInWithCredential(facebookCredential);
    const user = resConfirmed.user;
    this.userf.displayName=user.displayName;
    this.userf.email=user.email;
    this.userf.photoUrl=user.photoURL;
    this.auth.saveSessionFb(this.userf);
    this.router.navigate(['tabs']);
  }

  public async loginFacebookWeb() {
    const res = await this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    const user = res.user;
    this.userf.displayName=user.displayName;
    this.userf.email=user.email;
    this.userf.photoUrl=user.photoURL;
    this.auth.saveSessionFb(this.userf);
    this.router.navigate(['tabs']);
  }
/*
  async loginGoogle() {
    if (this.platform.is('android')) {
      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    }
  }

  async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': "876615581010-nqmg52mif8328vm5p126a04sal41o7n6.apps.googleusercontent.com",
      'offline': true
    });
    const resConfirmed = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
    const user = resConfirmed.user;
    this.usuario.email=user.email;
    this.usuario.displayName=user.displayName;
    this.usuario.imageUrl=user.photoURL;
    this.auth.saveSession(this.usuario);
    /*this.usuario.imageUrl = user.photoURL;
    this.usuario.displayName = user.displayName;
    this.usuario.email = user.email;
    console.log(user.email);
  }

  async loginGoogleWeb() {
    const res = await this.googlePlus.trySilentLogin({
      'webClientId': "876615581010-6ac401dm18kmp9l4f8uhv8jeq9l5set9.apps.googleusercontent.com",
      'offline': true
    });
    const resConfirmed = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = resConfirmed.user;
    console.log(user);
    this.usuario.email=user.email;
    this.usuario.displayName=user.displayName;
    this.usuario.imageUrl=user.photoURL;
    this.auth.saveSession(this.usuario);
    console.log(user.email);
  }*/
}