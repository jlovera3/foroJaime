import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
})
export class UiComponent implements OnInit {

  constructor(private loadingController:LoadingController,
    private toast: ToastController,
    private local: NativeStorage) { }

    loading:HTMLIonLoadingElement;

   ngOnInit() {}

  
  public async crearToast(msg){
    let toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  public async getEmail(){
    var email;
      try {
        var user = await this.local.getItem('user');
        email = user.email;
      } catch (err) {
        
      }
      console.log(email+' AHHHH');
      return email;
    }
  

  public async presentLoading() {
    await this.hideLoading();
    this.loading = await this.loadingController.create({
    });
    await this.loading.present();
  }

  public async hideLoading(){
    if(this.loading){
      await this.loading.dismiss();
    }
    this.loading=null;
  }

}