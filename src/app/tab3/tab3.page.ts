import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  public user: User;

  picture;
  name;
  email;
  desc;

  constructor( private auth:AuthService,
    private local: NativeStorage) { }

  ngOnInit() {
    this.getUser();
  }
  
  public async getUser(){
    try {
      this.user = await this.local.getItem('user');
      this.picture =await this.local.getItem('avatar');
      console.log(this.picture+' SE VE LA PUTA FOTO O Q');
      this.name = this.user.displayName;
      this.email = this.user.email;
    } catch (err) {
      this.user = null;  
    }
  }

  public async editName(){
    var nombre= prompt("Escriba su nuevo nombre");
    if (nombre != null) {
      this.name=nombre;
    }
  }
  public async editDesc(){
    var desc= prompt("Escriba una descripción personal");
    if (desc != null) {
      this.desc=desc;
    }
  }

  public logout(){
    confirm("¿Desea cerrar sesión?");
    if(confirm){
      this.auth.logout();
    }else{

    }
  }

}
